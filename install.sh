#!/bin/sh
# Links the skills into ~/.claude/skills and adds the potato-start SessionStart reminder hook.
# Safe to run again: existing links are refreshed, an existing hook is left alone.
set -e
repo=$(cd "$(dirname "$0")" && pwd)
dest="$HOME/.claude/skills"
mkdir -p "$dest"
for skill in "$repo"/skills/*/; do
  name=$(basename "$skill")
  target="$dest/$name"
  if [ -e "$target" ] && [ ! -L "$target" ]; then
    echo "skip $name: $target exists and is not a link (move it away first)"
    continue
  fi
  ln -sfn "${skill%/}" "$target"
  echo "linked $name"
done

settings="$HOME/.claude/settings.json"
command -v node >/dev/null 2>&1 || { echo "node not found: add the hook by hand (see README)"; exit 0; }
node - "$settings" <<'EOF'
const fs = require("fs");
const path = process.argv[2];
const cmd = 'sh "$HOME/.claude/skills/potato-start/hooks/session-start.sh" 2>/dev/null || true';
const s = fs.existsSync(path) ? JSON.parse(fs.readFileSync(path, "utf8")) : {};
s.hooks ??= {};
s.hooks.SessionStart ??= [];
const present = s.hooks.SessionStart.some((g) => (g.hooks || []).some((h) => h.command === cmd));
if (present) {
  console.log("hook already present");
} else {
  s.hooks.SessionStart.push({ hooks: [{ type: "command", command: cmd, timeout: 10 }] });
  fs.writeFileSync(path, JSON.stringify(s, null, 2) + "\n");
  console.log("hook added to " + path);
}
EOF
