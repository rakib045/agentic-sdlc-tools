import { loadAgent, loadCommand, loadRule, loadSkill } from "../lib/source.js";
import { markdown, tomlValue } from "../lib/render.js";
import { agentDescription, capability, omitInherit, skillFile, withPersona } from "./shared.js";
import type { ToolAdapter } from "./types.js";

/**
 * Gemini CLI: subagents in .gemini/agents/*.md, custom commands as TOML in .gemini/commands,
 * skills as .gemini/skills/<id>/SKILL.md, rules in GEMINI.md.
 */
export const geminiAdapter: ToolAdapter = {
  id: "gemini",
  label: "Gemini CLI",
  render(category, name, level) {
    switch (category) {
      case "agents": {
        const agent = loadAgent(name, level);
        const tools = [
          "read_file",
          "grep_search",
          "glob",
          "list_directory",
          ...(capability(agent.permissions, "edit") !== "deny" ? ["write_file", "replace"] : []),
          ...(capability(agent.permissions, "shell") !== "deny" ? ["run_shell_command"] : []),
        ];
        return [
          {
            path: `.gemini/agents/${name}.md`,
            kind: "markdown",
            content: markdown(
              { name, description: agentDescription(agent), kind: "local", model: omitInherit(agent.model), tools },
              agent.body,
            ),
          },
        ];
      }
      case "commands": {
        const command = loadCommand(name, level);
        const prompt = withPersona(command.agent, command.body, level);
        return [
          {
            path: `.gemini/commands/${name}.toml`,
            kind: "toml",
            content: `description = ${tomlValue(command.description)}\nprompt = ${tomlValue(prompt)}\n`,
          },
        ];
      }
      case "skills": {
        const skill = loadSkill(name, level);
        return [skillFile(".gemini/skills", name, skill.description, skill.body)];
      }
      case "rules":
        return [{ path: "GEMINI.md", kind: "markdown", content: markdown({}, loadRule(name, level)) }];
    }
  },
  doctorPaths: () => ["GEMINI.md"],
  describe: () => "gemini: agents=.gemini/agents commands=.gemini/commands (TOML) skills=.gemini/skills/<id>/SKILL.md rules=GEMINI.md",
};
