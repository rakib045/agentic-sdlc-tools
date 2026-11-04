import { existsSync, readFileSync, readdirSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

export type Category = "agents" | "commands" | "skills" | "rules";

/**
 * Token-efficiency level. Each template exists in up to three versions:
 * `name.md.low`, `name.md` (default), and `name.md.high`. The installer writes the
 * chosen version under the plain name, so the suffix is dropped on install.
 */
export type TokenLevel = "low" | "default" | "high";

export const TOKEN_LEVELS: TokenLevel[] = ["low", "default", "high"];

const CATEGORY_LIST: Category[] = ["agents", "commands", "skills", "rules"];

const SUFFIX: Record<TokenLevel, string> = { low: ".low", default: "", high: ".high" };

export function parseLevel(value: string | undefined): TokenLevel {
  if (value === undefined) return "default";
  if ((TOKEN_LEVELS as string[]).includes(value)) return value as TokenLevel;
  throw new Error(`Unknown token-efficiency "${value}". Use one of: ${TOKEN_LEVELS.join(", ")}.`);
}

function packageRoot(from: string): string | null {
  let dir = from;
  for (let i = 0; i < 6; i++) {
    if (existsSync(join(dir, "package.json"))) return dir;
    const parent = dirname(dir);
    if (parent === dir) return null;
    dir = parent;
  }
  return null;
}

/** Published layout: categories under dist/templates. Dev layout: categories at the package root. */
export function templatesDir(): string {
  const here = dirname(fileURLToPath(import.meta.url));
  for (const candidate of [join(here, "templates"), join(here, "..", "templates")]) {
    if (existsSync(join(candidate, "agents"))) return candidate;
  }
  const root = packageRoot(here);
  if (root && existsSync(join(root, "agents"))) return root;
  return join(here, "templates");
}

/** Skills are directories (`skills/<id>/SKILL.md`); other categories are `<category>/<id>.md`. */
function itemPath(category: Category, name: string, level: TokenLevel): string {
  const dir = join(templatesDir(), category);
  const file = category === "skills" ? join(name, "SKILL.md") : `${name}.md`;
  return join(dir, `${file}${SUFFIX[level]}`);
}

export function listItems(category: Category, level: TokenLevel = "default"): string[] {
  const dir = join(templatesDir(), category);
  if (!existsSync(dir)) return [];
  const suffix = SUFFIX[level];
  if (category === "skills") {
    return readdirSync(dir, { withFileTypes: true })
      .filter((entry) => entry.isDirectory() && existsSync(join(dir, entry.name, `SKILL.md${suffix}`)))
      .map((entry) => entry.name)
      .sort();
  }
  const ext = `.md${suffix}`;
  return readdirSync(dir)
    .filter((file) => file.endsWith(ext))
    .map((file) => file.slice(0, -ext.length))
    .sort();
}

export function readItem(category: Category, name: string, level: TokenLevel = "default"): string {
  const file = itemPath(category, name, level);
  if (!existsSync(file)) {
    throw new Error(
      `Unknown ${category.slice(0, -1)} "${name}" at token-efficiency "${level}": ${relative(templatesDir(), file)} not found`,
    );
  }
  return readFileSync(file, "utf8");
}

export function manifest(level: TokenLevel = "default"): Record<Category, string[]> {
  return Object.fromEntries(CATEGORY_LIST.map((category) => [category, listItems(category, level)])) as Record<
    Category,
    string[]
  >;
}
