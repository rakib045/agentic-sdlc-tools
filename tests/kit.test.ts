import { describe, expect, it } from "vitest";
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { parse as parseYaml } from "yaml";
import { parse as parseToml } from "smol-toml";
import { ALL_TOOL_IDS, getAdapter, parseTools } from "../src/adapters/index.js";
import { doctor, install, kitItems, planFiles, update } from "../src/commands.js";
import { inspect } from "../src/lib/files.js";
import { listItems, manifest, parseLevel, readItem, TOKEN_LEVELS, type TokenLevel } from "../src/lib/manifest.js";
import { INSTALL_NOTE, withHeader } from "../src/lib/render.js";
import { loadAgent, loadCommand, loadSkill, parseFrontmatter } from "../src/lib/source.js";

const TOOLS = ALL_TOOL_IDS;
const AGENTS = listItems("agents");
const COMMANDS = listItems("commands");
const SKILLS = listItems("skills");
const LOW_SKILLS = listItems("skills", "low");
const LOW_AGENTS = listItems("agents", "low");

function frontmatterOf(text: string): Record<string, unknown> {
  const match = text.match(/^---\n([\s\S]*?)\n---/);
  if (!match) throw new Error("no frontmatter");
  return parseYaml(match[1]) as Record<string, unknown>;
}

function rendered(
  tool: string,
  category: "agents" | "commands" | "skills" | "rules",
  name: string,
  level: TokenLevel = "default",
) {
  return getAdapter(tool).render(category, name, level);
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
    expect(AGENTS).toHaveLength(9);
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
  it("gives every agent, command, and skill a description at every level", () => {
    for (const level of TOKEN_LEVELS) {
      for (const name of listItems("agents", level)) expect(loadAgent(name, level).description, `agent ${name} ${level}`).toBeTruthy();
      for (const name of listItems("commands", level)) expect(loadCommand(name, level).description, `command ${name} ${level}`).toBeTruthy();
      for (const name of listItems("skills", level)) expect(loadSkill(name, level).description, `skill ${name} ${level}`).toBeTruthy();
    }
  });
  it("binds every command to an existing agent at every level", () => {
    for (const level of TOKEN_LEVELS) {
      const agents = listItems("agents", level);
      for (const name of listItems("commands", level)) {
        const agent = loadCommand(name, level).agent;
        expect(agent, `command ${name} ${level}`).toBeDefined();
        expect(agents, `command ${name} ${level}`).toContain(agent);
      }
    }
  });
  it("gives every skill a name that matches its directory at every level", () => {
    for (const level of TOKEN_LEVELS) {
      for (const name of listItems("skills", level)) {
        expect(parseFrontmatter(readItem("skills", name, level)).name, `skill ${name} ${level}`).toBe(name);
      }
    }
  });
  it("binds only skills that exist at the same level", () => {
    for (const level of TOKEN_LEVELS) {
      const skills = listItems("skills", level);
      for (const agent of listItems("agents", level)) {
        for (const skill of loadAgent(agent, level).skills) expect(skills, `${agent} ${level} -> ${skill}`).toContain(skill);
      }
    }
  });
  it("keeps each agent's 'Load these skills' list in step with its skills binding at every level", () => {
    for (const level of TOKEN_LEVELS) {
      for (const agent of listItems("agents", level)) {
        const loaded = loadAgent(agent, level);
        const section = loaded.body.match(/## Load (?:these )?skills?\n([\s\S]*?)(?:\n## |$)/)?.[1] ?? "";
        const listed = [...section.matchAll(/`([a-z0-9-]+)`/g)].map((m) => m[1]).filter((id) => SKILLS.includes(id));
        expect([...new Set(listed)].sort(), `${agent} ${level}`).toEqual([...new Set(loaded.skills)].sort());
      }
    }
  });
});

describe("agent metadata", () => {
  it("gives every agent an icon and inherits the session model", () => {
    for (const agent of AGENTS) {
      expect(loadAgent(agent).icon, `${agent} icon`).toBeTruthy();
      expect(loadAgent(agent).model, `${agent} model`).toBe("inherit");
    }
  });

  it("lets the orchestrator delegate to every other agent, and devops-engineer to its reviewers", () => {
    const delegates = (agent: string) =>
      loadAgent(agent)
        .permissions.filter((rule) => rule.action === "subagent" && rule.effect === "allow")
        .map((rule) => rule.resource)
        .sort();
    expect(delegates("orchestrator")).toEqual(AGENTS.filter((agent) => agent !== "orchestrator").sort());
    expect(delegates("devops-engineer")).toEqual(["code-reviewer", "qa-engineer", "security-reviewer"]);
    for (const agent of AGENTS.filter((name) => name !== "orchestrator" && name !== "devops-engineer")) {
      expect(delegates(agent), agent).toEqual([]);
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
    expect(fm).not.toHaveProperty("model");
    expect(fm.description).toMatch(/^🔍 /);
    const perms = fm.permissions as { action: string; resource: string; effect: string }[];
    expect(perms).toContainEqual({ action: "skill", resource: "*", effect: "deny" });
    expect(perms).toContainEqual({ action: "skill", resource: "review-checklist", effect: "allow" });
    expect(perms).toContainEqual({ action: "edit", resource: "*", effect: "deny" });
  });

  it("writes Claude agents with name, native skills, and tool denials", () => {
    const reviewer = frontmatterOf(rendered("claude", "agents", "code-reviewer")[0].content);
    expect(reviewer.name).toBe("code-reviewer");
    expect(reviewer.model).toBe("inherit");
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
    expect(fm.model).toBe("inherit");
    expect(fm.agent).toBeUndefined();
  });

  it("writes Codex agents as TOML with policy and reasoning effort", () => {
    const file = rendered("codex", "agents", "code-reviewer")[0];
    expect(file.path).toBe(".codex/agents/code-reviewer.toml");
    const toml = parseToml(file.content) as Record<string, string>;
    expect(toml.name).toBe("code-reviewer");
    expect(toml).not.toHaveProperty("model");
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
    expect(command.prompt).toContain("Persona: `📋 product-owner`");

    const reviewer = frontmatterOf(rendered("gemini", "agents", "security-reviewer")[0].content);
    expect(reviewer.tools).toContain("read_file");
    expect(reviewer.tools).not.toContain("write_file");
    expect(reviewer.kind).toBe("local");
    expect(reviewer).not.toHaveProperty("model");
  });

  it("writes GitHub agents as .agent.md with tool aliases", () => {
    const file = rendered("github", "agents", "code-reviewer")[0];
    expect(file.path).toBe(".github/agents/code-reviewer.agent.md");
    const fm = frontmatterOf(file.content);
    expect(fm.tools).toEqual(["read", "search", "execute"]);
    expect(fm).not.toHaveProperty("model");
    expect(rendered("github", "agents", "senior-backend-developer")[0].content).toContain("edit");
  });

  it("writes GitHub commands as skills that are not auto-invoked", () => {
    const fm = frontmatterOf(rendered("github", "commands", "test")[0].content);
    expect(fm["disable-model-invocation"]).toBe(true);
    expect(rendered("github", "commands", "test")[0].path).toBe(".github/skills/test/SKILL.md");
  });

  it("writes Cursor agents with readonly reviewers and .mdc rules", () => {
    expect(frontmatterOf(rendered("cursor", "agents", "code-reviewer")[0].content).readonly).toBe(true);
    expect(frontmatterOf(rendered("cursor", "agents", "senior-backend-developer")[0].content)).not.toHaveProperty("readonly");
    expect(frontmatterOf(rendered("cursor", "agents", "senior-backend-developer")[0].content).model).toBe("inherit");
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

    const target = join(dir, ".claude/agents/senior-backend-developer.md");
    writeFileSync(target, "stale\n", "utf8");
    const check = update(dir, ["claude"], { dryRun: true });
    expect(check.conflicts).toContain(".claude/agents/senior-backend-developer.md");
    expect(readFileSync(target, "utf8")).toBe("stale\n");
    expect(check.skipped).toContain(".claude/agents/code-reviewer.md");
    expect(inspect(removed, "x")).toBe("missing");

    const applied = update(dir, ["claude"], { force: true });
    expect(applied.overwritten).toContain(".claude/agents/senior-backend-developer.md");
    expect(inspect(removed, "x")).toBe("missing");
    rmSync(dir, { recursive: true, force: true });
  });

  it("minimal preset includes agents needed by its commands and only their skills", () => {
    const items = kitItems("minimal");
    const agents = items.filter((i) => i.category === "agents").map((i) => i.name).sort();
    expect(agents).toEqual([
      "orchestrator",
      "product-owner",
      "qa-engineer",
      "senior-backend-developer",
      "senior-frontend-developer",
      "solution-architect",
    ]);
    const skills = items.filter((i) => i.category === "skills").map((i) => i.name);
    expect(skills).toContain("interview-me");
    expect(skills).toContain("test-driven-development");
    expect(skills).not.toContain("security-and-hardening");

    const lowItems = kitItems("minimal", "low");
    expect(lowItems.filter((i) => i.category === "agents").map((i) => i.name)).toContain("qa-engineer");
    const lowSkills = lowItems.filter((i) => i.category === "skills").map((i) => i.name);
    for (const skill of loadAgent("qa-engineer", "low").skills) expect(lowSkills).toContain(skill);
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

describe("token-efficiency levels", () => {
  const levelFiles = (level: TokenLevel) => planFiles(kitItems("full", level), ["claude"], level);

  it("parses the level, defaults to default, and rejects unknown values", () => {
    expect(parseLevel(undefined)).toBe("default");
    expect(parseLevel("low")).toBe("low");
    expect(parseLevel("high")).toBe("high");
    expect(() => parseLevel("medium")).toThrow(/Unknown token-efficiency/);
  });

  it("ships the same agents, commands, and rules at every level, and fewer skills at low", () => {
    for (const category of ["agents", "commands", "rules"] as const) {
      expect(listItems(category, "high"), category).toEqual(listItems(category, "default"));
      expect(listItems(category, "low"), category).toEqual(listItems(category, "default"));
    }
    expect(listItems("skills", "high")).toEqual(SKILLS);
    expect(LOW_SKILLS.length).toBeLessThan(SKILLS.length);
    expect(LOW_SKILLS.every((skill) => SKILLS.includes(skill))).toBe(true);
  });

  it("keeps low agents, commands, and the rule from naming skills that have no low version", () => {
    const texts = [
      ...LOW_AGENTS.map((agent) => readItem("agents", agent, "low")),
      ...listItems("commands", "low").map((command) => readItem("commands", command, "low")),
      readItem("rules", "global", "low"),
    ];
    const absent = SKILLS.filter((skill) => !LOW_SKILLS.includes(skill));
    for (const text of texts) {
      for (const skill of absent) expect(text, skill).not.toContain(`\`${skill}\``);
    }
  });

  it("gives low agents only the low skills they bind, and every low skill is used", () => {
    const bound = new Set(LOW_AGENTS.flatMap((agent) => loadAgent(agent, "low").skills));
    for (const skill of bound) expect(LOW_SKILLS, skill).toContain(skill);
    expect([...bound].sort()).toEqual([...LOW_SKILLS].sort());
  });

  it("writes low templates shorter than default, and default shorter than high", () => {
    for (const agent of AGENTS) {
      const low = readItem("agents", agent, "low").length;
      const medium = readItem("agents", agent).length;
      const high = readItem("agents", agent, "high").length;
      expect(low, `${agent} low < default`).toBeLessThan(medium);
      expect(medium, `${agent} default < high`).toBeLessThan(high);
    }
    for (const command of COMMANDS) {
      expect(readItem("commands", command, "low").length, `${command} low`).toBeLessThan(
        readItem("commands", command).length,
      );
    }
    for (const skill of LOW_SKILLS) {
      expect(readItem("skills", skill, "low").length, `${skill} low`).toBeLessThan(readItem("skills", skill).length);
    }
  });

  it("installs low with plain file names and only the low set", () => {
    const paths = levelFiles("low").map((file) => file.path);
    expect(paths.some((path) => path.includes(".low"))).toBe(false);
    expect(paths).toContain(".claude/agents/orchestrator.md");
    expect(paths).toContain(".claude/skills/interview-me/SKILL.md");
    expect(paths).not.toContain(".claude/skills/doubt-driven-development/SKILL.md");
    expect(paths.filter((path) => path.startsWith(".claude/skills/")).length).toBe(LOW_SKILLS.length);
  });

  it("writes the low body under the plain file name", () => {
    const orchestrator = levelFiles("low").find((file) => file.path === ".claude/agents/orchestrator.md");
    expect(orchestrator?.content).toContain(loadAgent("orchestrator", "low").body.split("\n")[0]);
  });

  it("installs fewer files at low than at default, and default and high match in count", () => {
    const low = levelFiles("low").length;
    const medium = levelFiles("default").length;
    const high = levelFiles("high").length;
    expect(low).toBeLessThan(medium);
    expect(high).toBe(medium);
  });

  it("refreshes a low install at low level without adding default-only files", () => {
    const dir = tempProject();
    const first = install(dir, kitItems("full", "low"), ["claude"], { level: "low" });
    expect(first.conflicts).toHaveLength(0);
    expect(inspect(join(dir, ".claude/skills/doubt-driven-development/SKILL.md"), "x")).toBe("missing");

    const check = update(dir, ["claude"], { dryRun: true, level: "low" });
    expect(check.conflicts).toHaveLength(0);
    expect(check.skipped).toHaveLength(0);
    expect(check.unchanged.length).toBe(first.created.length);
    rmSync(dir, { recursive: true, force: true });
  });
});
