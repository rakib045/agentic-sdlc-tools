import { loadAgent, loadCommand, loadRule, loadSkill } from "../lib/source.js";
import { markdown } from "../lib/render.js";
import { agentDescription, capability, omitInherit, skillFile, withPersona } from "./shared.js";
import type { ToolAdapter } from "./types.js";

/**
 * GitHub Copilot: custom agents as .github/agents/<id>.agent.md with tool aliases.
 * Copilot CLI runs skills, not prompt files, so commands become user-invocable-only skills
 * (disable-model-invocation). Skills live in .github/skills/<id>/SKILL.md.
 */
export const githubAdapter: ToolAdapter = {
  id: "github",
  label: "GitHub Copilot",
  render(category, name, level) {
    switch (category) {
      case "agents": {
        const agent = loadAgent(name, level);
        const tools = [
          "read",
          "search",
          ...(capability(agent.permissions, "edit") !== "deny" ? ["edit"] : []),
          ...(capability(agent.permissions, "shell") !== "deny" ? ["execute"] : []),
          ...(capability(agent.permissions, "subagent") !== "deny" ? ["agent"] : []),
        ];
        return [
          {
            path: `.github/agents/${name}.agent.md`,
            kind: "markdown",
            content: markdown(
              { name, description: agentDescription(agent), tools, model: omitInherit(agent.model) },
              agent.body,
            ),
          },
        ];
      }
      case "commands": {
        const command = loadCommand(name, level);
        return [
          skillFile(".github/skills", name, command.description, withPersona(command.agent, command.body, level), {
            "disable-model-invocation": true,
          }),
        ];
      }
      case "skills": {
        const skill = loadSkill(name, level);
        return [skillFile(".github/skills", name, skill.description, skill.body)];
      }
      case "rules":
        return [
          {
            path: ".github/copilot-instructions.md",
            kind: "markdown",
            content: markdown({}, loadRule(name, level)),
          },
        ];
    }
  },
  doctorPaths: () => [".github/copilot-instructions.md"],
  describe: () => "github: agents=.github/agents (*.agent.md) commands=.github/skills (invocation off) skills=.github/skills/<id>/SKILL.md rules=.github/copilot-instructions.md",
};
