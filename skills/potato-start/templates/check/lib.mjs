import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

export const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..", "..");

let tracked;
function trackedFiles() {
  tracked ??= execFileSync("git", ["ls-files", "-z"], { cwd: ROOT, encoding: "utf8", maxBuffer: 64 << 20 })
    .split("\0")
    .filter(Boolean);
  return tracked;
}

export function abs(relPath) {
  return join(ROOT, ...relPath.split("/"));
}

export function exists(relPath) {
  return existsSync(abs(relPath));
}

const cache = new Map();
export function read(relPath) {
  if (!cache.has(relPath)) cache.set(relPath, readFileSync(abs(relPath), "utf8"));
  return cache.get(relPath);
}

const seen = new Map();
function present(relPath) {
  if (!seen.has(relPath)) seen.set(relPath, existsSync(abs(relPath)));
  return seen.get(relPath);
}

export function files(roots, exts) {
  const under = roots.map((r) => (r === "." ? "" : r.replace(/\/$/, "")));
  return trackedFiles()
    .filter((f) => under.some((r) => r === "" || f === r || f.startsWith(r + "/")))
    .filter((f) => exts.some((e) => f.endsWith(e)))
    .filter(present)
    .sort();
}

export function lines(relPath) {
  return read(relPath).split(/\r?\n/);
}

function inString(s, idx) {
  let quote = null;
  for (let i = 0; i < idx; i++) {
    const ch = s[i];
    if (quote) {
      if (ch === "\\") i++;
      else if (ch === quote) quote = null;
    } else if (ch === '"' || ch === "`") quote = ch;
  }
  return quote !== null;
}

const codeCache = new Map();
export function codeLines(relPath) {
  if (!codeCache.has(relPath)) codeCache.set(relPath, stripComments(relPath));
  return codeCache.get(relPath);
}

const HASH = [".py", ".sh", ".bash", ".rb", ".ps1", ".r", ".pl", ".toml", ".yaml", ".yml"];

function stripHash(relPath) {
  return lines(relPath).map((raw) => {
    const t = raw.trimStart();
    if (t.startsWith("#")) return "";
    const cut = raw.search(/\s#(?![!\[{])/);
    return cut >= 0 && !inString(raw, cut) ? raw.slice(0, cut) : raw;
  });
}

function stripComments(relPath) {
  if (HASH.some((e) => relPath.toLowerCase().endsWith(e))) return stripHash(relPath);
  let inBlock = false;
  return lines(relPath).map((raw) => {
    let s = raw;
    if (inBlock) {
      const end = s.indexOf("*/");
      if (end < 0) return "";
      s = s.slice(end + 2);
      inBlock = false;
    }
    const t = s.trimStart();
    if (t.startsWith("//") || t.startsWith("*")) return "";
    const open = s.indexOf("/*");
    if (open >= 0 && !inString(s, open) && s.indexOf("*/", open) < 0) {
      inBlock = true;
      s = s.slice(0, open);
    }
    const cut = s.search(/(^|\s)\/\/(?!\/)/);
    return cut >= 0 && !inString(s, cut) ? s.slice(0, cut) : s;
  });
}

export function hits(relPath, re, { code = true } = {}) {
  const src = code ? codeLines(relPath) : lines(relPath);
  const out = [];
  src.forEach((l, i) => {
    if (re.test(l)) out.push({ file: relPath, line: i + 1, text: l.trim() });
    re.lastIndex = 0;
  });
  return out;
}

export function config() {
  return exists("scripts/check/config.json") ? loadJson("scripts/check/config.json") : {};
}

export function loadJson(relPath) {
  return JSON.parse(read(relPath));
}

export function nonTestLines(relPath) {
  const src = codeLines(relPath);
  const raw = lines(relPath);
  const at = raw.findIndex((l, i) => /^\s*#\[cfg\(test\)\]/.test(l) && /^\s*(pub\s+)?mod\s+\w+/.test(raw[i + 1] ?? ""));
  return at >= 0 ? src.slice(0, at) : src;
}

const BASELINE = "scripts/check/baseline.json";

export function ratchet(id, counts) {
  const base = (exists(BASELINE) ? loadJson(BASELINE) : {})[id] ?? {};
  const out = [];
  for (const [file, n] of Object.entries(counts)) {
    const cap = base[file] ?? 0;
    if (n > cap) out.push({ file, msg: `${n}, cap ${cap}: remove one before adding one` });
    else if (n < cap) out.push({ file, msg: `${n}, cap ${cap}: progress; lock it in with node scripts/check/run.mjs --tighten` });
  }
  for (const [file, cap] of Object.entries(base)) {
    if (!(file in counts) && cap > 0) out.push({ file, msg: `0, cap ${cap}: lock it in with node scripts/check/run.mjs --tighten` });
  }
  return out;
}

export function tighten(id, counts) {
  const all = exists(BASELINE) ? loadJson(BASELINE) : {};
  const seeding = !(id in all);
  const base = all[id] ?? {};
  const next = {};
  for (const file of Object.keys({ ...base, ...counts }).sort()) {
    const n = counts[file] ?? 0;
    const cap = seeding ? n : Math.min(base[file] ?? 0, n);
    if (cap > 0) next[file] = cap;
  }
  all[id] = next;
  writeFileSync(abs(BASELINE), JSON.stringify(all, null, 2) + "\n");
  cache.delete(BASELINE);
}
