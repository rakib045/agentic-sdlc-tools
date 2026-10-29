import { existsSync, readFileSync, readdirSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

export type Category = "agents" | "commands" | "skills" | "rules";

const CATEGORY_LIST: Category[] = ["agents", "commands", "skills", "rules"];

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
function itemPath(category: Category, name: string): string {
  const dir = join(templatesDir(), category);
  return category === "skills" ? join(dir, name, "SKILL.md") : join(dir, `${name}.md`);
}

export function listItems(category: Category): string[] {
  const dir = join(templatesDir(), category);
  if (!existsSync(dir)) return [];
  if (category === "skills") {
    return readdirSync(dir, { withFileTypes: true })
      .filter((entry) => entry.isDirectory() && existsSync(join(dir, entry.name, "SKILL.md")))
      .map((entry) => entry.name)
      .sort();
  }
  return readdirSync(dir)
    .filter((file) => file.endsWith(".md"))
    .map((file) => file.slice(0, -".md".length))
    .sort();
}

export function readItem(category: Category, name: string): string {
  const file = itemPath(category, name);
  if (!existsSync(file)) {
    throw new Error(`Unknown ${category.slice(0, -1)} "${name}": ${relative(templatesDir(), file)} not found`);
  }
  return readFileSync(file, "utf8");
}

export function manifest(): Record<Category, string[]> {
  return Object.fromEntries(CATEGORY_LIST.map((category) => [category, listItems(category)])) as Record<Category, string[]>;
}
