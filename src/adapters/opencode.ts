import { loadAgent, loadCommand, loadRule, loadSkill } from "../lib/source.js";
import { markdown } from "../lib/render.js";
import { agentDescription, omitInherit, skillFile } from "./shared.js";
import type { ToolAdapter } from "./types.js";

/**
 * OpenCode: agents and commands in .opencode/*, skills as .opencode/skills/<id>/SKILL.md,
 * rules in AGENTS.md. Permissions are native here, so they are written as-is.
 */
export const opencodeAdapter: ToolAdapter = {
  id: "opencode",
  label: "OpenCode",
  render(category, name, level) {
    switch (category) {
      case "agents": {
        const agent = loadAgent(name, level);
        const skillRules = [
          { action: "skill", resource: "*", effect: "deny" },
          ...agent.skills.map((skill) => ({ action: "skill", resource: skill, effect: "allow" })),
        ];
        return [
          {
            path: `.opencode/agents/${name}.md`,
            kind: "markdown",
            content: markdown(
              {
                description: agentDescription(agent),
                mode: agent.mode,
                model: omitInherit(agent.model),
                permissions: [...skillRules, ...agent.permissions],
              },
              agent.body,
            ),
          },
        ];
      }
      case "commands": {
        const command = loadCommand(name, level);
        return [
          {
            path: `.opencode/commands/${name}.md`,
            kind: "markdown",
            content: markdown(
              { description: command.description, agent: command.agent, subagent: command.subagent },
              command.body,
            ),
          },
        ];
      }
      case "skills": {
        const skill = loadSkill(name, level);
        return [skillFile(".opencode/skills", name, skill.description, skill.body)];
      }
      case "rules":
        return [{ path: "AGENTS.md", kind: "markdown", content: markdown({}, loadRule(name, level)) }];
    }
  },
  doctorPaths: () => ["AGENTS.md"],
  describe: () => "opencode: agents=.opencode/agents commands=.opencode/commands skills=.opencode/skills/<id>/SKILL.md rules=AGENTS.md",
};
