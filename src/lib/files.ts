import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";

export type FileState = "missing" | "same" | "differs";

function normalize(text: string): string {
  return text.replace(/\r\n/g, "\n");
}

/** Compares a destination with the rendered content. Line endings are ignored so CRLF checkouts do not look edited. */
export function inspect(dest: string, content: string): FileState {
  if (!existsSync(dest)) return "missing";
  return normalize(readFileSync(dest, "utf8")) === normalize(content) ? "same" : "differs";
}

export function writeFile(dest: string, content: string, backup: boolean): void {
  mkdirSync(dirname(dest), { recursive: true });
  if (backup && existsSync(dest)) writeFileSync(`${dest}.bak`, readFileSync(dest, "utf8"), "utf8");
  writeFileSync(dest, content, "utf8");
}
