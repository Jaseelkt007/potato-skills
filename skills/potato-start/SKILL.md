---
name: potato-start
description: Set up, adopt or upgrade a project to build the "Potato Pyramid" way (Lauren Tan / poteto) in one of three modes, hackathon, product or large. Writes a managed block into the project's CLAUDE.md, and for product/large installs the scripts/check gate (comment and fixed-sleep ratchets, pre-commit hook) and a verification skill. Use for /potato-start, "set this project up the poteto way", "adopt potato rules", "upgrade potato rules", or when the session-start reminder says this project's rules are missing or outdated.
disable-model-invocation: true
---

# potato-start

`/potato-start <mode>` where mode is `hackathon`, `product` or `large`. No mode: ask which, with one line on each:

- **hackathon**: speed first. Prove the demo path, log every quick fix in `DEBT.md`. No checks, no hooks.
- **product**: real users coming. Check gate, ratchets, pre-commit hook, a `verify-<app>` skill.
- **large**: long-lived and agent-heavy. Product, plus worktrees for behaviour changes, before/after comparisons, tag before big deletions.

This skill's version is in `VERSION` next to this file. Templates are under `templates/`.

## Rules for this skill

- Change the project's `CLAUDE.md` only between `<!-- potato-start:begin ... -->` and `<!-- potato-start:end -->`. Everything outside is the owner's.
- Never delete project code or docs without the owner's yes. Propose; tag (`git tag pre-potato-<date>`) before any approved deletion.
- Never overwrite an existing git hook, `core.hooksPath`, or a project rule file in `scripts/check/rules/`. If one exists, show it and ask.
- Existing debt is capped, not fixed: ratchets are seeded at today's counts, so adopting never means a big cleanup first.

## 1. Read the project

Answer from the repo, ask only what you cannot see:

- Git repo? If not, offer `git init` (needed for the checks, which read `git ls-files`).
- `CLAUDE.md` present? Does it already have a potato block? Read its `mode=` and `version=`.
- New (little or no code) or existing (real code, history)?
- Languages and source folders (`git ls-files`, top-level dirs holding code).
- A runnable surface (web app, desktop app, CLI, API) for verification?
- Node available (`node --version`)? The check gate needs it.

Say in two lines what you found and what you will do.

## 2. The CLAUDE.md block

Body: `templates/claude/<mode>.md`. Wrap it:

```
<!-- potato-start:begin mode=<mode> version=<VERSION> -->
<body>
<!-- potato-start:end -->
```

No `CLAUDE.md`: create it with `# <project name>`, one line on what the project is (ask if unclear), then the block. Existing block: replace it. Existing `CLAUDE.md` without a block: add the block after the first heading and its intro paragraph.

## 3. By mode

**hackathon**
- Create `DEBT.md` from `templates/DEBT.md` if missing.
- Nothing else. Done.

**product** and **large**
1. Copy `templates/check/run.mjs`, `lib.mjs` and `rules/*.mjs` to `scripts/check/`. Existing files: if identical, skip; if different, show the diff and ask.
2. Write `scripts/check/config.json` from `templates/check/config.json` with this project's real `roots` (source folders) and `exts` (its languages).
3. Seed the ratchets: `node scripts/check/run.mjs --tighten`, then `node scripts/check/run.mjs` must print `all N rules pass`.
4. Pre-commit hook: copy `templates/githooks/pre-commit` to `.githooks/pre-commit` (executable), then `git config core.hooksPath .githooks`. Check first: an existing `core.hooksPath` or `.git/hooks/pre-commit` means ask.
5. Encode what the project already knows. Read `CLAUDE.md` (and `AGENTS.md`, `CONTRIBUTING.md`) for "never / always / don't / must" rules that a script can check. List them with the check you would write; write the ones the owner approves as `scripts/check/rules/<id>.mjs` (shape: `{ id, why, run() }`, see the two templates), prove each fails on an injected violation, then shorten the paragraph to the rule's name.
6. Upgrading from hackathon: go through `DEBT.md`. Each line becomes a fix, a rule or a ratchet entry; propose, then do the approved ones.
7. Existing project: list subtraction candidates (unused code the compiler or linter names, folders nothing imports, docs for finished work). Propose; delete only what is approved, after a tag.
8. Verification: if the project has a runnable surface, read `~/.claude/skills/create-verification-skill/SKILL.md` and follow it to make `verify-<app>`, including its step that proves the skill end to end. **large**: required. **product**: strongly recommended; ask.

**large** only, in addition:
- Confirm with the owner how behaviour changes are isolated (git worktree per change is the default in the block).

## 4. Finish

- `node scripts/check/run.mjs` passes (product/large).
- Commit in small commits, one per step, unless the owner says otherwise. Message prefix `potato-start:`.
- Report: mode, version, files added, rules seeded with their counts (comments, sleeps), what was proposed and not done, and the next command the owner might want (`/potato-start product` from hackathon, `/create-verification-skill` if skipped).

## Upgrading and changing mode

- Same mode, newer version: replace the block, add template files that are new since the old version, re-run step 3 for anything missing. Never remove project rules.
- Up a mode: run that mode's steps on top.
- Down a mode (for example large to hackathon for a sprint): only when asked. Replace the block; leave `scripts/check` in place but unset `core.hooksPath` if the owner wants commits unblocked. Say what stays.
