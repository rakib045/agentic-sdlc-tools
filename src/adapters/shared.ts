import type { Permission } from "../lib/source.js";
import { markdown, type RenderedFile } from "../lib/render.js";

export type Capability = "allow" | "ask" | "deny" | "partial";

/**
 * Overall capability for an action. The last wildcard rule decides; a deny with
 * specific allow rules is "partial" (for example, edit everything except SPEC.md).
 */
export function capability(permissions: Permission[], action: string): Capability {
  const mine = permissions.filter((rule) => rule.action === action);
  const wildcard = mine.filter((rule) => rule.resource === "*");
  const overall = wildcard.length > 0 ? wildcard[wildcard.length - 1].effect : "allow";
  if (overall === "deny") {
    const hasSpecificAllow = mine.some((rule) => rule.resource !== "*" && rule.effect === "allow");
    return hasSpecificAllow ? "partial" : "deny";
  }
  return overall === "ask" ? "ask" : "allow";
}

export function allowedResources(permissions: Permission[], action: string): string[] {
  return permissions
    .filter((rule) => rule.action === action && rule.effect === "allow" && rule.resource !== "*")
    .map((rule) => rule.resource);
}

/** Plain-language policy for harnesses that cannot enforce permissions in config. */
export function policyNotes(permissions: Permission[]): string[] {
  const notes: string[] = [];
  const edit = capability(permissions, "edit");
  if (edit === "deny") notes.push("Do not edit files.");
  if (edit === "partial") notes.push(`Edit only these paths: ${allowedResources(permissions, "edit").join(", ")}.`);
  const shell = capability(permissions, "shell");
  if (shell === "deny") notes.push("Do not run shell commands.");
  if (shell === "ask") notes.push("Ask before running shell commands.");
  if (capability(permissions, "subagent") === "deny") notes.push("Do not launch other agents.");
  return notes;
}

export function withPersona(agent: string | undefined, body: string): string {
  if (!agent) return body;
  return `Persona: \`${agent}\`. Apply that persona's responsibilities, working agreement, and output format.\n\n${body}`;
}

export function skillFile(
  dir: string,
  name: string,
  description: string,
  body: string,
  extra: Record<string, unknown> = {},
): RenderedFile {
  return {
    path: `${dir}/${name}/SKILL.md`,
    kind: "markdown",
    content: markdown({ name, description, ...extra }, body),
  };
}

export function nonEmpty<T>(items: T[]): T[] | undefined {
  return items.length > 0 ? items : undefined;
}
