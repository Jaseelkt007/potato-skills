## How we build here (large mode)

Built on Lauren Tan's "Potato Pyramid": trust comes from the codebase first, then automated checks, then verification on the real app, then this file, and human review last. Agents copy whatever the codebase shows them, so the codebase is the main instruction.

- **Prove behaviour on the real app** with the project's `verify-<app>` skill and keep its evidence. Unit tests prove code, not features. Measure before you fix: test the premise of a fix before building on it, and explain any number before trusting it.
- **Checks before prose.** `node scripts/check/run.mjs` runs every rule in `scripts/check/rules/` (one file each, its message says why). When the same correction comes up a second time, add a rule, then delete any paragraph here that said it.
- **Ratchets** (`scripts/check/baseline.json`) cap fixed sleeps, comment lines and any other debt per file. A count above its cap fails; a lower one fails until `node scripts/check/run.mjs --tighten`. Never raise a cap by hand.
- **No new comments.** The reason goes in a name, a type, a test, a check's message, the commit message or the project's change log. Safety notes and tool directives are exempt.
- **No "wait and hope".** Wait for the condition itself against a deadline, never a fixed sleep.
- **Delete before adding.** Dead code, a second way of doing the same thing, a stale doc: remove it first. Git keeps history; tag before large deletions.
- **Behaviour changes are developed in a git worktree**, compared before and after against `main` on the real app, and merged only when the result is better. A regression costs `git worktree remove`.
- Checks run on every commit (`.githooks/pre-commit`; a fresh clone runs `git config core.hooksPath .githooks` once) and before any release. Never commit with `--no-verify`.
- Many small commits, one logical change each.
