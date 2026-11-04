import { Command } from "commander";
import { createInterface } from "node:readline/promises";
import { stdin, stdout } from "node:process";
import { ALL_TOOL_IDS, getAdapter, parseTools } from "./adapters/index.js";
import { VERSION } from "./version.js";
import { doctor, install, kitItems, listLines, update, type Report } from "./commands.js";
import { parseLevel, readItem, TOKEN_LEVELS, type Category, type TokenLevel } from "./lib/manifest.js";

const LEVEL_OPTION = `Instruction level: ${TOKEN_LEVELS.join("|")} (default: default). low = smallest set, high = full detail`;

const program = new Command();
program
  .name("agentic-sdlc-tools")
  .description("Agentic SDLC kit - install agents, commands, skills and rules into any project")
  .version(VERSION);

async function confirm(question: string): Promise<boolean> {
  const rl = createInterface({ input: stdin, output: stdout });
  try {
    const answer = await rl.question(`${question} [y/N] `);
    return /^y(es)?$/i.test(answer.trim());
  } finally {
    rl.close();
  }
}

function run<T extends unknown[]>(fn: (...args: T) => Promise<void> | void) {
  return async (...args: T) => {
    try {
      await fn(...args);
    } catch (error) {
      console.error(`error: ${(error as Error).message}`);
      process.exitCode = 1;
    }
  };
}

function printReport(report: Report, dryRun: boolean, failOnConflict: boolean): void {
  const suffix = dryRun ? " (dry-run)" : "";
  if (report.created.length) console.log(`created${suffix}: ${report.created.length}`);
  if (report.overwritten.length) console.log(`overwritten (backup .bak kept)${suffix}: ${report.overwritten.length}`);
  if (report.unchanged.length) console.log(`unchanged: ${report.unchanged.length}`);
  for (const path of report.conflicts) {
    console.warn(`CONFLICT ${path} differs from the kit. Re-run with --force to overwrite (backup .bak kept).`);
  }
  if (report.conflicts.length && failOnConflict) process.exitCode = 1;
}

program
  .command("init")
  .description("Install the full kit (or a preset) into the current project")
  .option("--tools <list>", `Comma list: ${ALL_TOOL_IDS.join(",")} (default: all)`)
  .option("--preset <name>", "full|minimal (minimal = core SDLC commands with their agents and skills)", "full")
  .option("--force", "Overwrite existing files (backs up to *.bak)")
  .option("--dry-run", "Show what would be installed without writing")
  .option("--yes", "Non-interactive (assume defaults)")
  .option("--instruction-level <level>", LEVEL_OPTION)
  .action(
    run(
      async (opts: {
        tools?: string;
        preset: string;
        force?: boolean;
        dryRun?: boolean;
        yes?: boolean;
        instructionLevel?: string;
      }) => {
        const tools = parseTools(opts.tools);
        const level = parseLevel(opts.instructionLevel);
        const items = kitItems(opts.preset === "minimal" ? "minimal" : "full", level);
        if (!opts.yes && !opts.dryRun) {
          const byCategory = (category: Category) => items.filter((i) => i.category === category).map((i) => i.name);
          console.log(`Will install to: ${tools.map((t) => getAdapter(t).label).join(", ")}`);
          console.log(`  instruction level: ${level}`);
          console.log(`  agents: ${byCategory("agents").join(", ") || "(none)"}`);
          console.log(`  commands: ${byCategory("commands").join(", ") || "(none)"}`);
          console.log(`  skills: ${byCategory("skills").length} skills`);
          console.log(`  rules: ${byCategory("rules").join(", ") || "(none)"}`);
          if (!(await confirm("Continue?"))) {
            console.log("Aborted.");
            return;
          }
        }
        printReport(install(process.cwd(), items, tools, { ...opts, level }), Boolean(opts.dryRun), true);
      },
    ),
  );

program
  .command("add <spec>")
  .description('Granular install, e.g. "agent:orchestrator", "command:spec", "skill:adr-writing", "rule:global"')
  .option("--tools <list>", `Comma list: ${ALL_TOOL_IDS.join(",")} (default: all)`)
  .option("--force", "Overwrite existing files (backs up to *.bak)")
  .option("--dry-run", "Show what would be installed without writing")
  .option("--instruction-level <level>", LEVEL_OPTION)
  .action(
    run(
      async (spec: string, opts: { tools?: string; force?: boolean; dryRun?: boolean; instructionLevel?: string }) => {
        const match = spec.match(/^(agent|command|skill|rule):([\w-]+)$/);
        if (!match) throw new Error(`Bad spec "${spec}". Use <type>:<name>, e.g. agent:orchestrator`);
        const category = `${match[1]}s` as Category;
        const name = match[2];
        const level = parseLevel(opts.instructionLevel);
        readItem(category, name, level);
        const tools = parseTools(opts.tools);
        printReport(install(process.cwd(), [{ category, name }], tools, { ...opts, level }), Boolean(opts.dryRun), true);
      },
    ),
  );

program
  .command("list")
  .description("List available agents, commands, skills, rules")
  .option("--tools", "Also show tool target paths")
  .option("--instruction-level <level>", LEVEL_OPTION)
  .action((opts: { tools?: boolean; instructionLevel?: string }) => {
    console.log(listLines(Boolean(opts.tools), parseLevel(opts.instructionLevel)).join("\n"));
  });

program
  .command("doctor")
  .description("Validate SDLC artifacts (spec, plan, test setup) and kit installation in the current project")
  .action(
    run(() => {
      const result = doctor(process.cwd());
      console.log(result.lines.join("\n"));
    }),
  );

program
  .command("update")
  .description("Refresh kit files already installed in this project. Does not add new items.")
  .option("--tools <list>", `Comma list: ${ALL_TOOL_IDS.join(",")} (default: all)`)
  .option("--check", "Only report what would change")
  .option("--diff", "Show per-file status without writing")
  .option("--force", "Apply updates (backs up to *.bak)")
  .option("--instruction-level <level>", `${LEVEL_OPTION}. Use the level you installed with`)
  .action(
    run(
      async (opts: {
        tools?: string;
        check?: boolean;
        diff?: boolean;
        force?: boolean;
        instructionLevel?: string;
      }) => {
      const tools = parseTools(opts.tools);
      const level: TokenLevel = parseLevel(opts.instructionLevel);
      const dryRun = Boolean(opts.check || opts.diff || !opts.force);
      if (dryRun && !opts.check && !opts.diff) {
        console.log("Dry run (no --force): showing what would change. Re-run with --force to apply.");
      }
      const report = update(process.cwd(), tools, { force: opts.force && !dryRun, dryRun, level });
      console.log(`unchanged: ${report.unchanged.length}`);
      console.log(`${dryRun ? "would update" : "updated"}: ${report.overwritten.length + report.conflicts.length}`);
      for (const path of report.conflicts) console.warn(`OUTDATED ${path}`);
      if (report.skipped.length) console.log(`not installed (skipped): ${report.skipped.length}`);
      },
    ),
  );

program.parseAsync(process.argv);
