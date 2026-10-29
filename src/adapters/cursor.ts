import { loadAgent, loadCommand, loadRule, loadSkill } from "../lib/source.js";
import { markdown } from "../lib/render.js";
import { capability, skillFile, withPersona } from "./shared.js";
import type { ToolAdapter } from "./types.js";

/**
 * Cursor: subagents in .cursor/agents/*.md (readonly for reviewers). Cursor ignores plain .md
 * rules, so rules are .mdc with alwaysApply. Slash commands are migrated to skills with
 * disable-model-invocation, which is Cursor's documented replacement.
 */
export const cursorAdapter: ToolAdapter = {
  id: "cursor",
  label: "Cursor",
  render(category, name) {
    switch (category) {
      case "agents": {
        const agent = loadAgent(name);
        const readonly = capability(agent.permissions, "edit") === "deny" ? true : undefined;
        return [
          {
            path: `.cursor/agents/${name}.md`,
            kind: "markdown",
            content: markdown(
              { name, description: agent.description, model: agent.models.cursor ?? "inherit", readonly },
              agent.body,
            ),
          },
        ];
      }
      case "commands": {
        const command = loadCommand(name);
        return [
          skillFile(".cursor/skills", name, command.description, withPersona(command.agent, command.body), {
            "disable-model-invocation": true,
          }),
        ];
      }
      case "skills": {
        const skill = loadSkill(name);
        return [skillFile(".cursor/skills", name, skill.description, skill.body)];
      }
      case "rules":
        return [
          {
            path: ".cursor/rules/global.mdc",
            kind: "markdown",
            content: markdown(
              { description: "Global SDLC rules (always apply)", alwaysApply: true },
              loadRule(name),
            ),
          },
        ];
    }
  },
  doctorPaths: () => [".cursor/rules/global.mdc"],
  describe: () => "cursor: agents=.cursor/agents commands=.cursor/skills (invocation off) skills=.cursor/skills/<id>/SKILL.md rules=.cursor/rules/global.mdc",
};
