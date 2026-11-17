---
name: potato-help
description: List every command in the potato-start toolkit and the pstack skills that go with it, with one line on when to use each. Use for /potato-help, "what potato skills are there", "what can I run with potato-start", or "which skill should I use for X" in a potato-set-up project.
---

# potato-help

Print the table below as it is, then answer the user's question if they asked one ("which do I use for X"): name the one skill that fits and why, in one or two sentences.

If the user asks whether a skill is installed, check `~/.claude/skills/<name>/SKILL.md`. The pstack skills come from Lauren Tan's pstack (github.com/cursor/plugins, folder pstack) and are installed separately; most of them run only when you type them.

## Setup (this toolkit)

| Command | Use it when |
|---|---|
| `/potato-start hackathon` | A new project where speed matters: prove the demo path, log quick fixes in `DEBT.md` |
| `/potato-start product` | Real users are coming: check gate, ratchets, pre-commit hook, a verification skill |
| `/potato-start large` | Long-lived, agent-heavy code: product plus worktrees and before/after comparisons |
| `/potato-start <mode>` again | Upgrading a project's mode, or updating it after the reminder says its rules are outdated |
| `/potato-help` | This list |

## Proving it works

| Command | Use it when |
|---|---|
| `/create-verification-skill` | A project has no scripted way to drive the real app and capture proof |
| `/maintain-verification-skill` | The app changed and the verification skill's feature map may be out of date |
| `/benchmark-checklist` | Before you report or act on a speed or performance number |
| `/blast-radius` | Before shipping: what could this change break outside the diff |
| `/tdd` | You want a failing test first, or a bug has a cheap local test |

## Keeping the code clean

| Command | Use it when |
|---|---|
| `/correct` | Agents keep making the same mistake here: make it impossible (design, types, then a lint) |
| `/no-comments` | Before review: find comments that excuse shortcuts and fix the cause |
| `/architect` | Before writing code that crosses module boundaries: sketch types and structure first |
| `/interrogate` | A design is contested: adversarial review across several models |
| `/arena` | Several candidate solutions in parallel, keep the best and graft in the rest |

## Understanding and planning

| Command | Use it when |
|---|---|
| `/how` | How does this work, where should this live |
| `/why` | Why is it this way, design history, regressions |
| `/teach` | Explain a body of work so a person really understands it |
| `/sharpen` | Before a task: what is really being asked and how to approach it |
| `/figure-it-out` | A big, multi-part change that needs a reviewable plan |
| `/in-your-own-words` | Check the agent understood your goal before it starts |

## Long or unattended work

| Command | Use it when |
|---|---|
| `/poteto-mode` | Big work in her full style: principles, subagents, verified results |
| `/swarm` | Fan out many parallel workers and get one report |
| `/show-me-your-work` | Keep a decision log for work you will review later |
| `/recall` | Pick up where earlier work left off |
| `/ketchup` | Catch up on what changed while you were away |
| `/reflect` | Turn lessons from a session into edits to the skills |

## Writing

| Command | Use it when |
|---|---|
| `/unslop` | Remove AI-sounding patterns from any text |
| `/technical-writing` | Docs, READMEs, PR descriptions, commit messages |
| `/bro` | Say the last message again in plain language |
