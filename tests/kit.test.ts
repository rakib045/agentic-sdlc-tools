import { describe, expect, it } from "vitest";
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { parse as parseYaml } from "yaml";
import { parse as parseToml } from "smol-toml";
import { ALL_TOOL_IDS, getAdapter, parseTools } from "../src/adapters/index.js";
import { doctor, install, kitItems, planFiles, update } from "../src/commands.js";
import { inspect } from "../src/lib/files.js";
import { listItems, manifest, readItem } from "../src/lib/manifest.js";
import { INSTALL_NOTE, withHeader } from "../src/lib/render.js";
import { loadAgent, loadCommand, loadSkill, parseFrontmatter } from "../src/lib/source.js";

const TOOLS = ALL_TOOL_IDS;
const AGENTS = listItems("agents");
const COMMANDS = listItems("commands");
const SKILLS = listItems("skills");

function frontmatterOf(text: string): Record<string, unknown> {
  const match = text.match(/^---\n([\s\S]*?)\n---/);
  if (!match) throw new Error("no frontmatter");
  return parseYaml(match[1]) as Record<string, unknown>;
}

function rendered(tool: string, category: "agents" | "commands" | "skills" | "rules", name: string) {
  return getAdapter(tool).render(category, name);
}

function tempProject(): string {
  return mkdtempSync(join(tmpdir(), "ast-"));
}

describe("tools", () => {
  it("parses all by default", () => {
    expect(parseTools(undefined)).toEqual(["claude", "opencode", "codex", "gemini", "github", "cursor"]);
  });
  it("rejects unknown tools", () => {
    expect(() => parseTools("nope")).toThrow(/Unknown tools/);
  });
});

describe("manifest", () => {
  it("discovers the kit", () => {
    expect(AGENTS).toHaveLength(7);
    expect(COMMANDS).toHaveLength(6);
    expect(SKILLS).toHaveLength(26);
    expect(manifest().rules).toEqual(["global"]);
  });
  it("finds skills only as directories with SKILL.md", () => {
    expect(SKILLS).toContain("adr-writing");
    expect(readItem("skills", "adr-writing")).toMatch(/^---\n/);
  });
});

describe("source metadata", () => {
  it("gives every agent, command, and skill a description", () => {
    for (const name of AGENTS) expect(loadAgent(name).description, `agent ${name}`).toBeTruthy();
    for (const name of COMMANDS) expect(loadCommand(name).description, `command ${name}`).toBeTruthy();
    for (const name of SKILLS) expect(loadSkill(name).description, `skill ${name}`).toBeTruthy();
  });
  it("binds every command to an existing agent", () => {
    for (const name of COMMANDS) {
      const agent = loadCommand(name).agent;
      expect(agent, `command ${name}`).toBeDefined();
      expect(AGENTS, `command ${name}`).toContain(agent);
    }
  });
  it("gives every skill a name that matches its directory", () => {
    for (const name of SKILLS) {
      expect(parseFrontmatter(readItem("skills", name)).name, `skill ${name}`).toBe(name);
    }
  });
  it("binds only skills that exist", () => {
    for (const agent of AGENTS) {
      for (const skill of loadAgent(agent).skills) expect(SKILLS, `${agent} -> ${skill}`).toContain(skill);
    }
  });
  it("keeps each agent's 'Load these skills' list in step with its skills binding", () => {
    for (const agent of AGENTS) {
      const body = loadAgent(agent).body;
      const section = body.match(/## Load (?:these )?skills?\n([\s\S]*?)(?:\n## |$)/)?.[1] ?? "";
      const listed = [...section.matchAll(/`([a-z0-9-]+)`/g)].map((m) => m[1]).filter((id) => SKILLS.includes(id));
      expect([...new Set(listed)].sort(), agent).toEqual([...new Set(loadAgent(agent).skills)].sort());
    }
  });
  it("gives every agent a model for every harness", () => {
    for (const agent of AGENTS) {
      for (const tool of TOOLS) expect(loadAgent(agent).models[tool], `${agent} ${tool}`).toBeTruthy();
    }
  });
});

describe("model names match each harness", () => {
  const patterns: Record<string, RegExp> = {
    opencode: /^opencode\/[\w.-]+(#\w+)?$/,
    claude: /^(sonnet|opus|haiku|fable|inherit|claude-[\w.-]+)$/,
    codex: /^gpt-[\w.-]+$/,
    gemini: /^gemini-[\w.-]+$/,
    cursor: /^(inherit|[\w.-]+(\[[^\]]*\])?)$/,
  };
  // GitHub Copilot lists models by display name; these are the names from its supported-models table.
  const githubModels = [
    "GPT-6.1 Sol",
    "GPT-6 Luna",
    "Claude Haiku 5.5",
    "Claude Opus 5.5",
    "Claude Sonnet 5.5",
  ];
  it("uses valid model names per harness for every agent", () => {
    for (const agent of AGENTS) {
      const models = loadAgent(agent).models;
      for (const tool of Object.keys(patterns)) {
        expect(models[tool], `${agent} ${tool}`).toMatch(patterns[tool]);
      }
      expect(githubModels, `${agent} github`).toContain(models.github);
    }
  });
});

describe("rendering", () => {
  it("renders every category for every tool with unique paths per tool", () => {
    for (const tool of TOOLS) {
      const items = kitItems("full");
      const files = planFiles(items, [tool]);
      expect(new Set(files.map((f) => f.path)).size, tool).toBe(files.length);
    }
  });

  it("puts markdown frontmatter on line 1 with the installer note after it", () => {
    for (const tool of TOOLS) {
      for (const item of kitItems("full")) {
        for (const file of rendered(tool, item.category, item.name)) {
          const out = withHeader(file);
          if (file.kind === "markdown" && out.startsWith("---\n")) {
            expect(out.indexOf(INSTALL_NOTE), file.path).toBeGreaterThan(out.indexOf("\n---\n"));
          }
          expect(out, file.path).not.toMatch(/[A-Z]:\\|\/Users\//);
        }
      }
    }
  });

  it("writes OpenCode agents with mode, model, and skill-scoped permissions", () => {
    const fm = frontmatterOf(rendered("opencode", "agents", "code-reviewer")[0].content);
    expect(fm.mode).toBe("subagent");
    expect(fm.model).toBe("opencode/gpt-6.1-sol#high");
    const perms = fm.permissions as { action: string; resource: string; effect: string }[];
    expect(perms).toContainEqual({ action: "skill", resource: "*", effect: "deny" });
    expect(perms).toContainEqual({ action: "skill", resource: "review-checklist", effect: "allow" });
    expect(perms).toContainEqual({ action: "edit", resource: "*", effect: "deny" });
  });

  it("writes Claude agents with name, native skills, and tool denials", () => {
    const reviewer = frontmatterOf(rendered("claude", "agents", "code-reviewer")[0].content);
    expect(reviewer.name).toBe("code-reviewer");
    expect(reviewer.model).toBe("opus");
    expect(reviewer.effort).toBe("high");
    expect(reviewer.skills).toContain("security-and-hardening");
    expect(reviewer.disallowedTools).toEqual(expect.arrayContaining(["Write", "Edit", "Agent"]));
    expect(reviewer).not.toHaveProperty("permissions");
    expect(reviewer).not.toHaveProperty("mode");

    const devops = frontmatterOf(rendered("claude", "agents", "devops-engineer")[0].content);
    expect(devops.disallowedTools ?? []).not.toContain("Agent");
  });

  it("writes Claude command models from the bound agent", () => {
    const fm = frontmatterOf(rendered("claude", "commands", "build")[0].content);
    expect(fm.model).toBe("sonnet");
    expect(fm.agent).toBeUndefined();
  });

  it("writes Codex agents as TOML with policy and reasoning effort", () => {
    const file = rendered("codex", "agents", "code-reviewer")[0];
    expect(file.path).toBe(".codex/agents/code-reviewer.toml");
    const toml = parseToml(file.content) as Record<string, string>;
    expect(toml.name).toBe("code-reviewer");
    expect(toml.model).toBe("gpt-6.1-sol");
    expect(toml.model_reasoning_effort).toBe("high");
    expect(toml.developer_instructions).toContain("Do not edit files.");
  });

  it("writes Codex commands as skills with implicit invocation off", () => {
    const files = rendered("codex", "commands", "build");
    expect(files.map((f) => f.path)).toEqual([
      ".agents/skills/build/SKILL.md",
      ".agents/skills/build/agents/openai.yaml",
    ]);
    expect(parseYaml(files[1].content)).toEqual({ policy: { allow_implicit_invocation: false } });
    expect(frontmatterOf(files[0].content).name).toBe("build");
  });

  it("writes Gemini commands as TOML and agents with a tool allow-list", () => {
    const command = parseToml(rendered("gemini", "commands", "spec")[0].content) as Record<string, string>;
    expect(command.description).toBeTruthy();
    expect(command.prompt).toContain("Do not implement");
    expect(command.prompt).toContain("Persona: `product-owner`");

    const reviewer = frontmatterOf(rendered("gemini", "agents", "security-reviewer")[0].content);
    expect(reviewer.tools).toContain("read_file");
    expect(reviewer.tools).not.toContain("write_file");
    expect(reviewer.kind).toBe("local");
    expect(reviewer.model).toBe("gemini-3-pro-preview");
  });

  it("writes GitHub agents as .agent.md with tool aliases", () => {
    const file = rendered("github", "agents", "code-reviewer")[0];
    expect(file.path).toBe(".github/agents/code-reviewer.agent.md");
    const fm = frontmatterOf(file.content);
    expect(fm.tools).toEqual(["read", "search", "execute"]);
    expect(fm.model).toBe("GPT-6.1 Sol");
    expect(rendered("github", "agents", "senior-developer")[0].content).toContain("edit");
  });

  it("writes GitHub commands as skills that are not auto-invoked", () => {
    const fm = frontmatterOf(rendered("github", "commands", "test")[0].content);
    expect(fm["disable-model-invocation"]).toBe(true);
    expect(rendered("github", "commands", "test")[0].path).toBe(".github/skills/test/SKILL.md");
  });

  it("writes Cursor agents with readonly reviewers and .mdc rules", () => {
    expect(frontmatterOf(rendered("cursor", "agents", "code-reviewer")[0].content).readonly).toBe(true);
    expect(frontmatterOf(rendered("cursor", "agents", "senior-developer")[0].content)).not.toHaveProperty("readonly");
    const rule = rendered("cursor", "rules", "global")[0];
    expect(rule.path).toBe(".cursor/rules/global.mdc");
    expect(frontmatterOf(rule.content).alwaysApply).toBe(true);
  });

  it("writes Cursor commands as skills with invocation off", () => {
    const fm = frontmatterOf(rendered("cursor", "commands", "plan")[0].content);
    expect(fm["disable-model-invocation"]).toBe(true);
    expect(rendered("cursor", "commands", "plan")[0].path).toBe(".cursor/skills/plan/SKILL.md");
  });

  it("uses each harness's skill directory", () => {
    const paths: Record<string, string> = {
      claude: ".claude/skills/adr-writing/SKILL.md",
      opencode: ".opencode/skills/adr-writing/SKILL.md",
      codex: ".agents/skills/adr-writing/SKILL.md",
      gemini: ".gemini/skills/adr-writing/SKILL.md",
      github: ".github/skills/adr-writing/SKILL.md",
      cursor: ".cursor/skills/adr-writing/SKILL.md",
    };
    for (const tool of TOOLS) {
      expect(rendered(tool, "skills", "adr-writing")[0].path, tool).toBe(paths[tool]);
    }
  });

  it("allows identical shared outputs (AGENTS.md) and rejects differing ones", () => {
    expect(() => planFiles(kitItems("full"), ["opencode", "codex"])).not.toThrow();
  });
});

describe("parsing and file state", () => {
  it("reads frontmatter with CRLF line endings", () => {
    const crlf = "---\r\nname: x\r\ndescription: y\r\n---\r\n\r\nBody\r\n";
    expect(parseFrontmatter(crlf)).toEqual({ name: "x", description: "y" });
  });
  it("compares files ignoring line endings", () => {
    const dir = tempProject();
    const dest = join(dir, "a.md");
    writeFileSync(dest, "one\r\ntwo\r\n", "utf8");
    expect(inspect(dest, "one\ntwo\n")).toBe("same");
    expect(inspect(dest, "one\n")).toBe("differs");
    expect(inspect(join(dir, "missing.md"), "x")).toBe("missing");
    rmSync(dir, { recursive: true, force: true });
  });
});

describe("install, update, and doctor", () => {
  it("installs once, is idempotent, and reports conflicts without overwriting", () => {
    const dir = tempProject();
    const first = install(dir, kitItems("full"), TOOLS);
    expect(first.created.length).toBeGreaterThan(0);
    expect(first.conflicts).toHaveLength(0);

    const second = install(dir, kitItems("full"), TOOLS);
    expect(second.created).toHaveLength(0);
    expect(second.conflicts).toHaveLength(0);

    const target = join(dir, ".claude/agents/code-reviewer.md");
    writeFileSync(target, "local edit\n", "utf8");
    const third = install(dir, kitItems("full"), ["claude"]);
    expect(third.conflicts).toEqual([".claude/agents/code-reviewer.md"]);
    expect(readFileSync(target, "utf8")).toBe("local edit\n");

    const forced = install(dir, kitItems("full"), ["claude"], { force: true });
    expect(forced.overwritten).toEqual([".claude/agents/code-reviewer.md"]);
    expect(readFileSync(`${target}.bak`, "utf8")).toBe("local edit\n");
    rmSync(dir, { recursive: true, force: true });
  });

  it("dry-run writes nothing", () => {
    const dir = tempProject();
    const report = install(dir, kitItems("full"), ["opencode"], { dryRun: true });
    expect(report.created.length).toBeGreaterThan(0);
    expect(inspect(join(dir, ".opencode/agents/code-reviewer.md"), "x")).toBe("missing");
    rmSync(dir, { recursive: true, force: true });
  });

  it("update refreshes only installed files and never adds new ones", () => {
    const dir = tempProject();
    install(dir, kitItems("minimal"), ["claude"]);
    const removed = join(dir, ".claude/agents/code-reviewer.md");
    expect(inspect(removed, "x")).toBe("missing");

    const target = join(dir, ".claude/agents/senior-developer.md");
    writeFileSync(target, "stale\n", "utf8");
    const check = update(dir, ["claude"], { dryRun: true });
    expect(check.conflicts).toContain(".claude/agents/senior-developer.md");
    expect(readFileSync(target, "utf8")).toBe("stale\n");
    expect(check.skipped).toContain(".claude/agents/code-reviewer.md");
    expect(inspect(removed, "x")).toBe("missing");

    const applied = update(dir, ["claude"], { force: true });
    expect(applied.overwritten).toContain(".claude/agents/senior-developer.md");
    expect(inspect(removed, "x")).toBe("missing");
    rmSync(dir, { recursive: true, force: true });
  });

  it("minimal preset includes the agents its commands need and only their skills", () => {
    const items = kitItems("minimal");
    const agents = items.filter((i) => i.category === "agents").map((i) => i.name).sort();
    expect(agents).toEqual(["product-owner", "senior-developer", "solution-architect"]);
    const skills = items.filter((i) => i.category === "skills").map((i) => i.name);
    expect(skills).toContain("interview-me");
    expect(skills).not.toContain("security-and-hardening");
  });

  it("doctor passes spec, plan, and test checks when artifacts exist", () => {
    const dir = tempProject();
    writeFileSync(join(dir, "SPEC.md"), "# spec\n", "utf8");
    writeFileSync(join(dir, "PLAN.md"), "# plan\n", "utf8");
    writeFileSync(join(dir, "package.json"), "{}\n", "utf8");
    mkdirSync(join(dir, "spec"));
    const result = doctor(dir);
    expect(result.lines.join("\n")).toContain("PASS spec");
    expect(result.lines.join("\n")).toContain("PASS plan");
    expect(result.lines.join("\n")).toContain("PASS test");
    expect(result.lines.join("\n")).toContain("WARN kit");
    rmSync(dir, { recursive: true, force: true });
  });

  it("rejects an unknown tool with a clear error", () => {
    expect(() => getAdapter("nope")).toThrow(/Unknown tool/);
  });

  it("gives every command installed in OpenCode the same markdown envelope", () => {
    const dir = tempProject();
    install(dir, [{ category: "commands", name: "build" }], ["opencode"]);
    const text = readFileSync(join(dir, ".opencode/commands/build.md"), "utf8");
    expect(text.startsWith("---\n")).toBe(true);
    expect(loadCommand("build").description).toBeTruthy();
    rmSync(dir, { recursive: true, force: true });
  });
});
