import { loadAgent, loadCommand, loadRule, loadSkill } from "../lib/source.js";
import { markdown } from "../lib/render.js";
import { capability, nonEmpty, skillFile, withPersona } from "./shared.js";
import type { ToolAdapter } from "./types.js";

/**
 * Claude Code: subagents in .claude/agents (name + description required), commands in
 * .claude/commands, skills as .claude/skills/<id>/SKILL.md, rules in CLAUDE.md.
 */
export const claudeAdapter: ToolAdapter = {
  id: "claude",
  label: "Claude Code",
  render(category, name) {
    switch (category) {
      case "agents": {
        const agent = loadAgent(name);
        const disallowed = [
          ...(capability(agent.permissions, "edit") === "deny" ? ["Write", "Edit", "NotebookEdit"] : []),
          ...(capability(agent.permissions, "shell") === "deny" ? ["Bash", "PowerShell"] : []),
          ...(capability(agent.permissions, "subagent") === "deny" ? ["Agent"] : []),
        ];
        return [
          {
            path: `.claude/agents/${name}.md`,
            kind: "markdown",
            content: markdown(
              {
                name,
                description: agent.description,
                model: agent.models.claude,
                effort: agent.effort,
                skills: nonEmpty(agent.skills),
                disallowedTools: nonEmpty(disallowed),
              },
              agent.body,
            ),
          },
        ];
      }
      case "commands": {
        const command = loadCommand(name);
        const model = command.agent ? loadAgent(command.agent).models.claude : undefined;
        return [
          {
            path: `.claude/commands/${name}.md`,
            kind: "markdown",
            content: markdown({ description: command.description, model }, withPersona(command.agent, command.body)),
          },
        ];
      }
      case "skills": {
        const skill = loadSkill(name);
        return [skillFile(".claude/skills", name, skill.description, skill.body)];
      }
      case "rules":
        return [{ path: "CLAUDE.md", kind: "markdown", content: markdown({}, loadRule(name)) }];
    }
  },
  doctorPaths: () => ["CLAUDE.md"],
  describe: () => "claude: agents=.claude/agents commands=.claude/commands skills=.claude/skills/<id>/SKILL.md rules=CLAUDE.md",
};
