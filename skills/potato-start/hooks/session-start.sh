#!/bin/sh
skill="$HOME/.claude/skills/potato-start"
current=$(cat "$skill/VERSION" 2>/dev/null || echo 0)
root=$(git rev-parse --show-toplevel 2>/dev/null) || exit 0
[ "$root" = "$HOME" ] && exit 0
md="$root/CLAUDE.md"
if [ ! -f "$md" ]; then
  echo "potato-start: this project has no CLAUDE.md yet. Tell the user they can set it up with /potato-start hackathon, /potato-start product or /potato-start large."
  exit 0
fi
line=$(grep -m1 -o 'potato-start:begin mode=[a-z]* version=[0-9]*' "$md") || exit 0
mode=$(echo "$line" | sed -E 's/.*mode=([a-z]+).*/\1/')
have=$(echo "$line" | sed -E 's/.*version=([0-9]+).*/\1/')
if [ "$have" -lt "$current" ]; then
  echo "potato-start: this project's rules are version $have (mode $mode); version $current is available. Tell the user /potato-start $mode updates them."
fi
exit 0
