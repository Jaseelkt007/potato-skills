#!/usr/bin/env node
// Structural checks for the whole repo. Run from anywhere, WSL or Windows:
//   node scripts/check/run.mjs            every rule
//   node scripts/check/run.mjs <rule-id>  one rule
//   node scripts/check/run.mjs --tighten  lower every ratchet cap to today's count
// Exit 1 on any violation. Each rule lives in rules/<id>.mjs and carries the
// reason it exists, so the failure message teaches the fix.
import { readdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const RULES = join(dirname(fileURLToPath(import.meta.url)), "rules");
const only = process.argv[2] === "--tighten" ? null : process.argv[2];
const tightenAll = process.argv[2] === "--tighten";
const started = Date.now();

let failed = 0;
let ran = 0;
for (const name of readdirSync(RULES).filter((n) => n.endsWith(".mjs")).sort()) {
  const mod = await import(pathToFileURL(join(RULES, name)).href);
  const rule = mod.default;
  if (only && rule.id !== only) continue;
  if (tightenAll && mod.counts) {
    const { tighten } = await import(pathToFileURL(join(RULES, "..", "lib.mjs")).href);
    tighten(rule.id, mod.counts());
  }
  ran++;
  const violations = await rule.run();
  if (violations.length === 0) continue;
  failed++;
  console.log(`\n[${rule.id}] ${violations.length} violation(s)`);
  for (const v of violations) {
    const where = v.file ? `${v.file}${v.line ? `:${v.line}` : ""}` : "(repo)";
    console.log(`  ${where}  ${v.msg ?? v.text ?? ""}`);
  }
  console.log(`  why: ${rule.why}`);
}

if (only && ran === 0) {
  console.log(`no rule named ${only}`);
  process.exit(2);
}
const secs = ((Date.now() - started) / 1000).toFixed(1);
console.log(failed ? `\n${failed} of ${ran} rule(s) failed (${secs}s)` : `all ${ran} rules pass (${secs}s)`);
process.exit(failed ? 1 : 0);
