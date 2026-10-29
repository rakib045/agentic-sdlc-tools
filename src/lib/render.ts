import { stringify } from "yaml";

export const INSTALL_NOTE = "Installed by @rakib045/agentic-sdlc-tools. Safe to edit; re-run with --force to update.";

export type FileKind = "markdown" | "toml" | "yaml";

export interface RenderedFile {
  path: string;
  kind: FileKind;
  content: string;
}

function withoutUndefined(fields: Record<string, unknown>): Record<string, unknown> {
  return Object.fromEntries(Object.entries(fields).filter(([, value]) => value !== undefined));
}

export function frontmatterBlock(fields: Record<string, unknown>): string {
  return `---\n${stringify(withoutUndefined(fields), { lineWidth: 0 }).trimEnd()}\n---`;
}

export function markdown(fields: Record<string, unknown>, body: string): string {
  const hasFields = Object.keys(withoutUndefined(fields)).length > 0;
  const head = hasFields ? `${frontmatterBlock(fields)}\n\n` : "";
  return `${head}${body.trim()}\n`;
}

export function tomlValue(value: string): string {
  if (value.includes("\n") && !value.includes("'''")) return `'''\n${value.trim()}\n'''`;
  return JSON.stringify(value);
}

export function withHeader(file: RenderedFile): string {
  const content = file.content.endsWith("\n") ? file.content : `${file.content}\n`;
  if (file.kind === "markdown") {
    const block = content.match(/^---\r?\n[\s\S]*?\r?\n---\r?\n/);
    const note = `<!-- ${INSTALL_NOTE} -->\n`;
    if (block) return `${block[0]}\n${note}\n${content.slice(block[0].length).trimStart()}`;
    return `${note}\n${content}`;
  }
  return `# ${INSTALL_NOTE}\n${content}`;
}
