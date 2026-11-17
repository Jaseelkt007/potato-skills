# potato-skills

Claude Code skills for building any project the "Potato Pyramid" way, from Lauren Tan's talk *All code is slop (except mine)*: trust comes from the codebase first, then automated checks, then verification on the real app, then a thin rules file, and human review last.

## Install

```sh
git clone https://github.com/Jaseelkt007/potato-skills ~/potato-skills
sh ~/potato-skills/install.sh
```

`install.sh` links each skill into `~/.claude/skills` and adds a SessionStart hook to `~/.claude/settings.json`. Run it again after pulling; it is idempotent. To update: `git -C ~/potato-skills pull`.

Requires git and Node (the check gate runs on Node). The pstack skills that `/potato-help` lists come from [cursor/plugins](https://github.com/cursor/plugins) (folder `pstack`) and are installed separately.

## Skills

| Skill | What it does |
|---|---|
| `/potato-start hackathon\|product\|large` | Sets up, adopts or upgrades a project: a managed block in its CLAUDE.md, and for product/large the `scripts/check` gate, ratchets, pre-commit hook and a verification skill |
| `/potato-help` | Lists every command here and the pstack skills that go with them |

## Modes

| | hackathon | product | large |
|---|---|---|---|
| Prove the demo / feature on the real app | yes | yes, verification skill | yes, plus before/after comparisons |
| Quick fixes | allowed, logged in `DEBT.md` | a check after the second time | ratcheted down |
| Comments | allowed | no new ones | ratchet |
| Pre-commit checks | off | on | on |
| Worktrees for behaviour changes | off | risky changes | always |

## Updating existing projects

The block `/potato-start` writes is tagged `<!-- potato-start:begin mode=<mode> version=<n> -->`. When `skills/potato-start/VERSION` goes up, the SessionStart hook tells every project with an older block to run `/potato-start <mode>`, which replaces only that block and adds what is new. A project with a CLAUDE.md but no block is never nagged; a git project with no CLAUDE.md gets a one-line suggestion.

Adopting an existing project starts every ratchet at today's counts, so nothing has to be fixed on day one, and deletions are only proposed.

## Changing the skills

Edit under `skills/`, test in a throwaway repo, and bump `skills/potato-start/VERSION` when the CLAUDE.md templates or check files change, so projects get the update reminder.
