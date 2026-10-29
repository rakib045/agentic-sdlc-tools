# @rakib045/agentic-sdlc-tools

Agentic AI SDLC kit — agents, skills, rules and slash commands with multi-tool support.

- **Agents (SDLC):** product-owner, solution-architect, senior-developer, qa-engineer, devops-engineer, security-reviewer, code-reviewer
- **Commands:** `/spec` `/plan` `/build` `/test` `/code-review` `/deploy` (prompt template + CLI validation via `doctor`). `/build auto` runs the approved plan task by task.
- **Rules:** global language-agnostic standards (assumptions, definition of done, skill routing)
- **Skills:** lifecycle workflows adapted from [addyosmani/agent-skills](https://github.com/addyosmani/agent-skills) (MIT), plus adr-writing, conventional-commits, and review-checklist. Run `list` for every name.
- **Tools:** Claude Code, OpenCode, OpenAI Codex, Gemini CLI, GitHub Copilot, Cursor — from a single source (`agents/`, `commands/`, `rules/`, `skills/` at the repo root) adapted per tool

Requires Node.js >= 20 in the target project environment.

## Install

The package is scoped, so `npx` needs the full package name (the bare
`npx agentic-sdlc-tools` will not resolve — see [Why the full name](#why-the-full-package-name-in-npx)):

```sh
# full install (all tools)
npx @rakib045/agentic-sdlc-tools init

# only some tools, non-interactive
npx @rakib045/agentic-sdlc-tools init --tools claude,opencode --yes

# minimal preset (spec/plan/build with their agents and skills, global rule)
npx @rakib045/agentic-sdlc-tools init --preset minimal --yes

# preview without writing
npx @rakib045/agentic-sdlc-tools init --dry-run
```

Valid `--tools` values: `claude,opencode,codex,gemini,github,cursor` (default: all).

## Granular install

```sh
npx @rakib045/agentic-sdlc-tools list
npx @rakib045/agentic-sdlc-tools list --tools

npx @rakib045/agentic-sdlc-tools add agent:senior-developer --tools claude,github
npx @rakib045/agentic-sdlc-tools add command:spec --tools opencode
npx @rakib045/agentic-sdlc-tools add skill:adr-writing --tools claude,opencode,codex,gemini,github,cursor
npx @rakib045/agentic-sdlc-tools add rule:global --tools cursor
```

Spec format is `<type>:<name>` where type is `agent|command|skill|rule`. Run `list` to see every available name.

## Update / validate

```sh
npx @rakib045/agentic-sdlc-tools update --check   # report what would change
npx @rakib045/agentic-sdlc-tools update --diff    # same, per-file status
npx @rakib045/agentic-sdlc-tools update --force   # apply updates
npx @rakib045/agentic-sdlc-tools doctor           # validate spec/plan/test artifacts + kit installation
```

**Safety:** `init` and `add` never overwrite a file that differs from the kit without `--force`, and they exit non-zero when they hit a conflict. With `--force` they back up the original to `*.bak` first. Re-running `init` is idempotent. `update` refreshes only files that are already installed and never adds items you did not choose.

## Where files go

| Harness | Agents | Commands | Skills | Rules |
|---|---|---|---|---|
| Claude Code | `.claude/agents/<id>.md` | `.claude/commands/<id>.md` | `.claude/skills/<id>/SKILL.md` | `CLAUDE.md` |
| OpenCode | `.opencode/agents/<id>.md` | `.opencode/commands/<id>.md` | `.opencode/skills/<id>/SKILL.md` | `AGENTS.md` |
| OpenAI Codex | `.codex/agents/<id>.toml` | `.agents/skills/<id>/SKILL.md` (implicit invocation off) | `.agents/skills/<id>/SKILL.md` | `AGENTS.md` |
| Gemini CLI | `.gemini/agents/<id>.md` | `.gemini/commands/<id>.toml` | `.gemini/skills/<id>/SKILL.md` | `GEMINI.md` |
| GitHub Copilot | `.github/agents/<id>.agent.md` | `.github/skills/<id>/SKILL.md` (invocation off) | `.github/skills/<id>/SKILL.md` | `.github/copilot-instructions.md` |
| Cursor | `.cursor/agents/<id>.md` | `.cursor/skills/<id>/SKILL.md` (invocation off) | `.cursor/skills/<id>/SKILL.md` | `.cursor/rules/global.mdc` (`alwaysApply: true`) |

Skills use the [Agent Skills](https://agentskills.io) layout everywhere: one directory per skill, with a `SKILL.md` whose `name` matches the directory and whose `description` says when to use it.

Harness-specific notes:

- **Codex** custom prompts are deprecated, so Codex commands are skills. Each one ships an `agents/openai.yaml` that turns implicit invocation off, so the model only runs it when you type its name.
- **Cursor** ignores plain `.md` rules, so the global rule is `.mdc`. Cursor's slash commands are skills with `disable-model-invocation: true`, which is how Cursor migrates them.
- **GitHub Copilot** CLI runs skills rather than prompt files, so commands are skills with `disable-model-invocation: true`.
- **Gemini** custom commands are TOML files with `description` and `prompt`.
- **OpenCode** binds each command to its persona with `agent:`. Other harnesses have no equivalent for commands, so the command gets a `Persona:` line that names the agent, and for Claude its model.
- Installed files start with an install note. `init` never overwrites a file you changed; re-run with `--force` to replace it (the original is kept as `*.bak`).

## Models per harness

Each agent sets one model per harness in the `models:` map of its frontmatter. The installer writes the value that belongs to each harness, so OpenCode gets `opencode/...`, Claude gets Claude names, Codex gets `gpt-*`, Gemini gets `gemini-*`, GitHub Copilot gets its model picker names, and Cursor gets its model IDs.

| Agent | OpenCode | Claude | Codex | Gemini | GitHub Copilot | Cursor |
|---|---|---|---|---|---|---|
| product-owner | `opencode/claude-fable-5-1#medium` | `sonnet` | `gpt-6.1-sol` | `gemini-3-pro-preview` | `Claude Sonnet 5.5` | `inherit` |
| solution-architect | `opencode/claude-fable-5-1#high` | `opus` | `gpt-6.1-sol` | `gemini-3-pro-preview` | `Claude Opus 5.5` | `claude-opus-5[effort=high]` |
| senior-developer | `opencode/gpt-6.1-sol#medium` | `sonnet` | `gpt-6.1-sol` | `gemini-3-pro-preview` | `GPT-6.1 Sol` | `gpt-5.6-sol` |
| qa-engineer | `opencode/claude-haiku-5-5#medium` | `sonnet` | `gpt-6-luna` | `gemini-3-flash-preview` | `Claude Haiku 5.5` | `composer-2.5` |
| devops-engineer | `opencode/gpt-6-luna#medium` | `sonnet` | `gpt-6.1-sol` | `gemini-3-flash-preview` | `GPT-6 Luna` | `inherit` |
| code-reviewer | `opencode/gpt-6.1-sol#high` | `opus` | `gpt-6.1-sol` | `gemini-3-pro-preview` | `GPT-6.1 Sol` | `gpt-5.6-sol` |
| security-reviewer | `opencode/claude-fable-5-1#high` | `opus` | `gpt-6.1-sol` | `gemini-3-pro-preview` | `Claude Opus 5.5` | `claude-opus-5[effort=high]` |

Reasoning effort comes from `effort:` (Claude and Codex) and from the `#variant` suffix (OpenCode). Model availability depends on your plan and provider. Check your model picker, and change the value in `agents/<id>.md` and re-run `init --force`, or edit the installed file.

## After install: what you can change

Installed files are plain files, so you can edit them. `update` reports an edited file as outdated and leaves it alone; `update --force` replaces it and keeps the original as `*.bak`. The tables below list the fields each harness reads. Unknown fields are ignored.

### Agents

| Harness | File | Metadata you can change |
|---|---|---|
| OpenCode | `.opencode/agents/<id>.md` | `description`, `mode` (`primary`, `subagent`, `all`), `model` (`provider/model#variant`), `permissions` (`edit`, `shell`, `subagent`, `skill` rules with `allow`/`ask`/`deny`), `steps`, `hidden`, `color`, `disabled`. The body is the system prompt. |
| Claude Code | `.claude/agents/<id>.md` | `name`, `description`, `model` (`sonnet`, `opus`, `haiku`, `fable`, `inherit`, or a full model ID), `effort` (`low` to `max`), `skills` (preloaded into the subagent), `tools` or `disallowedTools`, `permissionMode`, `maxTurns`, `memory`, `isolation`, `color`. |
| OpenAI Codex | `.codex/agents/<id>.toml` | `name`, `description`, `developer_instructions` (the prompt), `model`, `model_reasoning_effort`. Set `features.*` to turn capabilities off. |
| Gemini CLI | `.gemini/agents/<id>.md` | `name`, `description`, `kind` (`local` or `remote`), `tools` (for example `read_file`, `write_file`, `run_shell_command`), `model`, `temperature`, `max_turns`, `timeout_mins`. |
| GitHub Copilot | `.github/agents/<id>.agent.md` | `name`, `description` (required), `tools` (aliases `read`, `search`, `edit`, `execute`, `agent`, `web`, `todo`), `model`, `user-invocable`, `disable-model-invocation`. |
| Cursor | `.cursor/agents/<id>.md` | `name`, `description`, `model` (`inherit` or a model ID, for example `claude-opus-5[effort=high]`), `readonly`, `is_background`. |

### Commands

| Harness | File | Metadata you can change |
|---|---|---|
| OpenCode | `.opencode/commands/<id>.md` | `description`, `agent` (persona), `model` (`provider/model#variant`), `subagent` (`true` runs it in a child session). |
| Claude Code | `.claude/commands/<id>.md` | `description`, `model`, `allowed-tools`, `argument-hint`. |
| OpenAI Codex | `.agents/skills/<id>/SKILL.md` and `agents/openai.yaml` | `description`. In `openai.yaml`, `policy.allow_implicit_invocation` (`false` by default for commands). |
| Gemini CLI | `.gemini/commands/<id>.toml` | `description`, `prompt`. |
| GitHub Copilot | `.github/skills/<id>/SKILL.md` | `description`, `disable-model-invocation`, `user-invocable`, `argument-hint`. |
| Cursor | `.cursor/skills/<id>/SKILL.md` | `description`, `disable-model-invocation`, `paths` (scope to files), `icon`, `color`. |

### Skills

| Harness | File | Metadata you can change |
|---|---|---|
| All | `<skills dir>/<id>/SKILL.md` | `name` (must equal the directory name) and `description`. The description decides when the model loads the skill, so keep the "use when" trigger in it. |
| OpenCode | same | `metadata.opencode/autoinvoke: false` hides it from the model's list. `disable-model-invocation: true` does the same. |
| Claude Code | same | `disable-model-invocation`, `user-invocable`, `allowed-tools`, `context: fork`, `model`, `paths`, `argument-hint`. |
| OpenAI Codex | `agents/openai.yaml` next to `SKILL.md` | `policy.allow_implicit_invocation`. |
| GitHub Copilot | same | `user-invocable`, `disable-model-invocation`, `argument-hint`. |
| Cursor | same | `disable-model-invocation`, `paths`, `icon`, `color`. |
| Gemini CLI | none in the file | Turn skills on or off with `/skills enable <name>` and `/skills disable <name>`. |

## SDLC flow

```
/spec -> /plan -> /build -> /test -> /code-review -> /deploy
```

Each command file is a prompt template for the AI; `doctor` is the executable check (spec/plan/test artifacts + kit installation). Commands invoke skills; personas do not invoke other personas. `/deploy` is the parallel review fan-out (code review, security, QA) before a go/no-go.

## Repo layout (contributing)

```
agents/ commands/ rules/ skills/   # single source of truth (edit these)
skills/<id>/SKILL.md               # one directory per skill (installer copies SKILL.md only)
src/                               # TypeScript CLI (commander) + per-harness adapters
src/lib/source.ts                  # reads template frontmatter (agents: models, skills, permissions)
scripts/copy-templates.mjs         # copies root categories -> dist/templates on build
tests/                             # vitest
dist/                              # build output (gitignored, published to npm)
```

```sh
npm install
npm run lint
npm test
npm run build
```

## Publishing (maintainers)

One-time setup: create the npm org `@rakib045`, enable 2FA, `npm login`, then publish once manually so the package exists:

```sh
npm run build
npm publish --access public
```

After that, attach the GitHub trusted publisher (npm package Settings → Trusted Publisher → `rakib045/agentic-sdlc-tools`, workflow `publish.yml`). From then on every GitHub Release auto-publishes via `.github/workflows/publish.yml` (`npm publish --provenance` with OIDC, no tokens). Bump with `npm version patch|minor|major`, push tags, draft a release from the tag.

Notes:

- Local publishes must not request provenance (attestation only works on CI) — `publishConfig` intentionally omits it; CI passes `--provenance` explicitly.
- `404` on first `npm publish` means the `@rakib045` org doesn't exist yet — create it at `npmjs.com/org/create` and retry.

## Why the full package name in npx?

`npx <name>` resolves a *package* name, and the binary (`agentic-sdlc-tools`) only becomes available after that package is fetched. Since the package is the scoped `@rakib045/agentic-sdlc-tools`, the correct invocation is `npx @rakib045/agentic-sdlc-tools <command>`. (After a global `npm i -g @rakib045/agentic-sdlc-tools`, the bare `agentic-sdlc-tools` binary works directly.)
