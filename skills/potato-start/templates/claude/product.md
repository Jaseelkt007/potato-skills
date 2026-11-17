## How we build here (product mode)

Built on Lauren Tan's "Potato Pyramid": trust comes from the codebase first, then automated checks, then verification on the real app, then this file, and human review last.

- **Prove behaviour on the real app** before claiming it works: use the project's `verify-<app>` skill (made by `/create-verification-skill`) and keep its evidence. Unit tests prove code, not features.
- **Checks before prose.** `node scripts/check/run.mjs` runs every rule in `scripts/check/rules/` (one file each, its message says why). When the same correction comes up a second time, add a rule, then delete any paragraph here that said it.
- **Ratchets** (`scripts/check/baseline.json`) cap fixed sleeps and comment lines per file at today's count. A count above its cap fails; a lower one fails until `node scripts/check/run.mjs --tighten`. Never raise a cap by hand.
- **No new comments.** The reason goes in a name, a type, a test, a check's message or the commit message. Safety notes and tool directives are exempt.
- **No "wait and hope".** Wait for the condition itself against a deadline, never a fixed sleep.
- **Delete before adding.** Dead code, a second way of doing the same thing, a stale doc: remove it first. Git keeps history.
- Checks run on every commit (`.githooks/pre-commit`; a fresh clone runs `git config core.hooksPath .githooks` once). Never commit with `--no-verify`.
- Risky behaviour changes go on a branch and are compared against `main` on the real app before merging.
