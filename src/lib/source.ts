import { parse } from "yaml";
import { readItem } from "./manifest.js";

export type Effect = "allow" | "ask" | "deny";

export interface Permission {
  action: string;
  resource: string;
  effect: Effect;
}

export type AgentMode = "primary" | "subagent" | "all";

export interface AgentSource {
  id: string;
  description: string;
  mode: AgentMode;
  effort?: string;
  models: Record<string, string>;
  skills: string[];
  permissions: Permission[];
  body: string;
}

export interface CommandSource {
  id: string;
  description: string;
  agent?: string;
  subagent?: boolean;
  body: string;
}

export interface SkillSource {
  id: string;
  description: string;
  body: string;
}

const FRONTMATTER = /^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/;
const MODES: AgentMode[] = ["primary", "subagent", "all"];

function parseSource(raw: string, label: string): { fields: Record<string, unknown>; body: string } {
  const match = raw.match(FRONTMATTER);
  if (!match) return { fields: {}, body: raw.trim() };
  let fields: unknown;
  try {
    fields = parse(match[1]);
  } catch (error) {
    throw new Error(`${label}: invalid frontmatter: ${(error as Error).message}`);
  }
  return { fields: (fields ?? {}) as Record<string, unknown>, body: raw.slice(match[0].length).trim() };
}

function requireDescription(fields: Record<string, unknown>, label: string): string {
  const value = fields.description;
  if (typeof value !== "string" || value.trim() === "") throw new Error(`${label}: missing "description"`);
  return value.trim();
}

export function loadAgent(id: string): AgentSource {
  const label = `agents/${id}`;
  const { fields, body } = parseSource(readItem("agents", id), label);
  const mode = (fields.mode ?? "all") as AgentMode;
  if (!MODES.includes(mode)) throw new Error(`${label}: "mode" must be one of ${MODES.join(", ")}`);
  return {
    id,
    description: requireDescription(fields, label),
    mode,
    effort: typeof fields.effort === "string" ? fields.effort : undefined,
    models: (fields.models ?? {}) as Record<string, string>,
    skills: (fields.skills ?? []) as string[],
    permissions: (fields.permissions ?? []) as Permission[],
    body,
  };
}

export function loadCommand(id: string): CommandSource {
  const label = `commands/${id}`;
  const { fields, body } = parseSource(readItem("commands", id), label);
  return {
    id,
    description: requireDescription(fields, label),
    agent: typeof fields.agent === "string" ? fields.agent : undefined,
    subagent: typeof fields.subagent === "boolean" ? fields.subagent : undefined,
    body,
  };
}

export function loadSkill(id: string): SkillSource {
  const label = `skills/${id}`;
  const { fields, body } = parseSource(readItem("skills", id), label);
  return { id, description: requireDescription(fields, label), body };
}

export function loadRule(id: string): string {
  return parseSource(readItem("rules", id), `rules/${id}`).body;
}

export function parseFrontmatter(raw: string): Record<string, unknown> {
  return parseSource(raw, "file").fields;
}
