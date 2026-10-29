import type { Category } from "../lib/manifest.js";
import type { RenderedFile } from "../lib/render.js";

export type { RenderedFile } from "../lib/render.js";

/**
 * One target harness. Templates stay tool-agnostic in agents/ commands/ rules/ skills/;
 * `render` turns one template into the files this harness reads.
 */
export interface ToolAdapter {
  readonly id: string;
  readonly label: string;
  render(category: Category, name: string): RenderedFile[];
  /** Paths whose existence counts as "kit installed" for `doctor`. */
  doctorPaths(): string[];
  /** One-line summary for `list --tools`. */
  describe(): string;
}
