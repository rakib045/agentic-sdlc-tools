import { loadAgent, loadCommand, loadRule, loadSkill } from "../lib/source.js";
import { markdown, tomlValue } from "../lib/render.js";
import { agentDescription, omitInherit, policyNotes, skillFile, withPersona } from "./shared.js";
import type { ToolAdapter } from "./types.js";

/**
 * OpenAI Codex: custom agents are standalone TOML files in .codex/agents. Codex reads skills
 * from .agents/skills/<id>/SKILL.md. Custom prompts are deprecated, so commands become skills
 * with implicit invocation turned off in agents/openai.yaml.
 */
export const codexAdapter: ToolAdapter = {
  id: "codex",
  label: "OpenAI Codex",
  render(category, name, level) {
    switch (category) {
      case "agents": {
        const agent = loadAgent(name, level);
        const notes = policyNotes(agent.permissions);
        const instructions = notes.length
          ? `${agent.body}\n\n## Tool policy\n${notes.map((note) => `- ${note}`).join("\n")}`
          : agent.body;
        const lines = [
          `name = ${tomlValue(name)}`,
          `description = ${tomlValue(agentDescription(agent))}`,
          `developer_instructions = ${tomlValue(instructions)}`,
        ];
        const model = omitInherit(agent.model);
        if (model) lines.push(`model = ${tomlValue(model)}`);
        if (agent.effort) lines.push(`model_reasoning_effort = ${tomlValue(agent.effort)}`);
        return [{ path: `.codex/agents/${name}.toml`, kind: "toml", content: `${lines.join("\n")}\n` }];
      }
      case "commands": {
        const command = loadCommand(name, level);
        return [
          skillFile(".agents/skills", name, command.description, withPersona(command.agent, command.body, level)),
          {
            path: `.agents/skills/${name}/agents/openai.yaml`,
            kind: "yaml",
            content: "policy:\n  allow_implicit_invocation: false\n",
          },
        ];
      }
      case "skills": {
        const skill = loadSkill(name, level);
        return [skillFile(".agents/skills", name, skill.description, skill.body)];
      }
      case "rules":
        return [{ path: "AGENTS.md", kind: "markdown", content: markdown({}, loadRule(name, level)) }];
    }
  },
  doctorPaths: () => ["AGENTS.md"],
  describe: () => "codex: agents=.codex/agents (TOML) commands=.agents/skills (implicit off) skills=.agents/skills/<id>/SKILL.md rules=AGENTS.md",
};
