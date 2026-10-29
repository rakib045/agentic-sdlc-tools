import { existsSync } from "node:fs";
import { join } from "node:path";
import { ALL_TOOL_IDS, getAdapter } from "./adapters/index.js";
import { inspect, writeFile } from "./lib/files.js";
import { manifest, type Category } from "./lib/manifest.js";
import { withHeader } from "./lib/render.js";
import { loadAgent, loadCommand } from "./lib/source.js";

export interface Item {
  category: Category;
  name: string;
}

export interface Options {
  force?: boolean;
  dryRun?: boolean;
}

export interface Report {
  created: string[];
  unchanged: string[];
  overwritten: string[];
  conflicts: string[];
  skipped: string[];
}

export interface PlannedFile {
  tool: string;
  path: string;
  content: string;
}

function emptyReport(): Report {
  return { created: [], unchanged: [], overwritten: [], conflicts: [], skipped: [] };
}

/** Full kit, or the minimal preset: the core SDLC commands plus every agent and skill they need. */
export function kitItems(preset: "full" | "minimal" = "full"): Item[] {
  const all = manifest();
  let agents = all.agents;
  let commands = all.commands;
  let skills = all.skills;
  let rules = all.rules;
  if (preset === "minimal") {
    commands = ["spec", "plan", "build"].filter((command) => all.commands.includes(command));
    const personas = new Set<string>(["solution-architect", "senior-developer"]);
    for (const command of commands) {
      const agent = loadCommand(command).agent;
      if (agent) personas.add(agent);
    }
    agents = [...personas].filter((agent) => all.agents.includes(agent)).sort();
    const needed = new Set(agents.flatMap((agent) => loadAgent(agent).skills));
    skills = all.skills.filter((skill) => needed.has(skill));
    rules = rules.filter((rule) => rule === "global");
  }
  return [
    ...agents.map((name) => ({ category: "agents" as const, name })),
    ...commands.map((name) => ({ category: "commands" as const, name })),
    ...skills.map((name) => ({ category: "skills" as const, name })),
    ...rules.map((name) => ({ category: "rules" as const, name })),
  ];
}

/** Renders every item for every tool. Shared outputs (AGENTS.md) must be identical to be merged. */
export function planFiles(items: Item[], tools: string[]): PlannedFile[] {
  const planned = new Map<string, PlannedFile>();
  for (const tool of tools) {
    const adapter = getAdapter(tool);
    for (const item of items) {
      for (const file of adapter.render(item.category, item.name)) {
        const content = withHeader(file);
        const existing = planned.get(file.path);
        if (existing && existing.content !== content) {
          throw new Error(`Conflicting outputs for ${file.path} (from ${existing.tool} and ${tool})`);
        }
        if (!existing) planned.set(file.path, { tool, path: file.path, content });
      }
    }
  }
  return [...planned.values()];
}

export function install(cwd: string, items: Item[], tools: string[], options: Options = {}): Report {
  const report = emptyReport();
  for (const file of planFiles(items, tools)) {
    const dest = join(cwd, file.path);
    const state = inspect(dest, file.content);
    if (state === "same") {
      report.unchanged.push(file.path);
    } else if (state === "missing") {
      if (!options.dryRun) writeFile(dest, file.content, false);
      report.created.push(file.path);
    } else if (options.force) {
      if (!options.dryRun) writeFile(dest, file.content, true);
      report.overwritten.push(file.path);
    } else {
      report.conflicts.push(file.path);
    }
  }
  return report;
}

/** Refreshes only files that are already installed. It never adds items the project did not choose. */
export function update(cwd: string, tools: string[], options: Options = {}): Report {
  const report = emptyReport();
  for (const file of planFiles(kitItems("full"), tools)) {
    const dest = join(cwd, file.path);
    const state = inspect(dest, file.content);
    if (state === "missing") {
      report.skipped.push(file.path);
    } else if (state === "same") {
      report.unchanged.push(file.path);
    } else if (options.force) {
      if (!options.dryRun) writeFile(dest, file.content, true);
      report.overwritten.push(file.path);
    } else {
      report.conflicts.push(file.path);
    }
  }
  return report;
}

export interface DoctorResult {
  lines: string[];
  warnings: number;
}

export function doctor(cwd: string): DoctorResult {
  const checks: [string, string[]][] = [
    ["spec", ["SPEC.md", "spec.md", "docs/spec.md", "spec"]],
    ["plan", ["PLAN.md", "plan.md", "docs/plan.md"]],
    ["test", ["package.json", "pyproject.toml", "go.mod"]],
  ];
  const lines: string[] = [];
  let warnings = 0;
  let passed = 0;
  for (const [name, candidates] of checks) {
    const found = candidates.find((candidate) => existsSync(join(cwd, candidate)));
    if (found) passed++;
    else warnings++;
    lines.push(`${found ? "PASS" : "WARN"} ${name}: ${found ?? `missing (${candidates.join(" | ")})`}`);
  }
  const installed = ALL_TOOL_IDS.filter((id) =>
    getAdapter(id)
      .doctorPaths()
      .some((rel) => existsSync(join(cwd, rel))),
  );
  if (installed.length > 0) passed++;
  else warnings++;
  lines.push(
    installed.length > 0
      ? `PASS kit: installed for [${installed.join(", ")}]`
      : "WARN kit: no rules file found. Run init.",
  );
  lines.push(`\n${passed}/${checks.length + 1} checks passed.`);
  return { lines, warnings };
}

export function listLines(withTools: boolean): string[] {
  const all = manifest();
  const lines: string[] = [];
  for (const category of ["agents", "commands", "skills", "rules"] as const) {
    lines.push(`\n## ${category}`);
    for (const item of all[category]) lines.push(`  ${category.slice(0, -1)}:${item}`);
  }
  if (withTools) {
    lines.push("\n## tools");
    for (const id of ALL_TOOL_IDS) lines.push(`  ${getAdapter(id).describe()}`);
  }
  return lines;
}
