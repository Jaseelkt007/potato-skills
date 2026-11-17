import { files, codeLines, ratchet, config } from "../lib.mjs";

const SLEEP = /\b(thread::sleep|time::sleep|tokio::time::sleep|time\.sleep|asyncio\.sleep|time\.Sleep|Thread\.sleep|Start-Sleep|setTimeout|sleep_ms)\s*\(|\bsleep\s*\(\s*(Duration::|\d)/;

export function counts() {
  const { roots = ["src"], exts = [".ts", ".js", ".rs", ".py"] } = config();
  const c = {};
  for (const f of files(roots, exts)) {
    const n = codeLines(f).filter((l) => SLEEP.test(l)).length;
    if (n) c[f] = n;
  }
  return c;
}

export default {
  id: "fixed-sleep-ratchet",
  why:
    "A fixed sleep or timeout is a guess about how long something takes, and each one gets copied into " +
    "the next file. Wait for the condition itself, polled against a deadline (the element exists, the text " +
    "appeared, the response arrived). Existing ones are capped per file; replace them when you touch the file.",
  run: () => ratchet("fixed-sleep-ratchet", counts()),
};
