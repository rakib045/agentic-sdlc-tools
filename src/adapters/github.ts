import { loadAgent, loadCommand, loadRule, loadSkill } from "../lib/source.js";
import { markdown } from "../lib/render.js";
import { capability, skillFile, withPersona } from "./shared.js";
import type { ToolAdapter } from "./types.js";

/**
 * GitHub Copilot: custom agents as .github/agents/<id>.agent.md with tool aliases.
 * Copilot CLI runs skills, not prompt files, so commands become user-invocable-only skills
 * (disable-model-invocation). Skills live in .github/skills/<id>/SKILL.md.
 */
export const githubAdapter: ToolAdapter = {
  id: "github",
  label: "GitHub Copilot",
  render(category, name) {
    switch (category) {
      case "agents": {
        const agent = loadAgent(name);
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
            content: markdown({ name, description: agent.description, tools, model: agent.models.github }, agent.body),
          },
        ];
      }
      case "commands": {
        const command = loadCommand(name);
        return [
          skillFile(".github/skills", name, command.description, withPersona(command.agent, command.body), {
            "disable-model-invocation": true,
          }),
        ];
      }
      case "skills": {
        const skill = loadSkill(name);
        return [skillFile(".github/skills", name, skill.description, skill.body)];
      }
      case "rules":
        return [{ path: ".github/copilot-instructions.md", kind: "markdown", content: markdown({}, loadRule(name)) }];
    }
  },
  doctorPaths: () => [".github/copilot-instructions.md"],
  describe: () => "github: agents=.github/agents (*.agent.md) commands=.github/skills (invocation off) skills=.github/skills/<id>/SKILL.md rules=.github/copilot-instructions.md",
};
