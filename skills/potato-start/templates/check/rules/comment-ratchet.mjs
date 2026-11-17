import { files, lines, codeLines, ratchet, config } from "../lib.mjs";

const EXEMPT = /^(\/\/|\/\*|\*|#)?\s*(SAFETY:|@ts-|eslint-|prettier-|biome-ignore|noqa|type:\s*ignore|pragma|!)/;

export function counts() {
  const { roots = ["src"], exts = [".ts", ".js", ".rs", ".py"] } = config();
  const c = {};
  for (const f of files(roots, exts)) {
    const raw = lines(f);
    const code = codeLines(f);
    let n = 0;
    raw.forEach((l, i) => {
      const kept = code[i] ?? "";
      if (l.trimEnd() === kept.trimEnd()) return;
      const comment = l.slice(kept.length).trim();
      if (comment && !EXEMPT.test(comment)) n++;
    });
    if (n) c[f] = n;
  }
  return c;
}

export default {
  id: "comment-ratchet",
  why:
    "Comments go stale, no compiler checks them, and they let a shortcut justify itself, which the next " +
    "agent copies. Say it in code: a name, a type, a test, or a rule in scripts/check whose message carries " +
    "the reason; the story goes in the commit message. Existing comments are capped per file. Safety notes " +
    "and tool directives (SAFETY:, @ts-, eslint-, noqa, type: ignore) are exempt.",
  run: () => ratchet("comment-ratchet", counts()),
};
