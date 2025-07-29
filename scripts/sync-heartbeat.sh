#!/usr/bin/env bash
set -euo pipefail
msg="${1:-ok}"
now="$(date -u +"%Y-%m-%dT%H:%M:%SZ")"
branch="$(git rev-parse --abbrev-ref HEAD 2>/dev/null || echo main)"
mkdir -p .codex
# roll a small task counter
cnt_file=".codex/count"
[ -f "$cnt_file" ] || echo 0 > "$cnt_file"
cnt=$(( $(cat "$cnt_file") + 1 ))
echo "$cnt" > "$cnt_file"

# STATUS.md (human)
touch STATUS.md
printf "## Status\n\n- Timestamp (UTC): %s\n- Branch: %s\n- Task #: %s\n- Message: %s\n\n" "$now" "$branch" "$cnt" "$msg" > STATUS.md

# TASKS_LOG.md (append)
touch TASKS_LOG.md
printf "%s  |  #%s  |  %s\n" "$now" "$cnt" "$msg" >> TASKS_LOG.md

# heartbeat.json (machine)
cat > .codex/heartbeat.json <<JSON
{ "timestamp":"$now", "branch":"$branch", "task":$cnt, "message":$(printf '%s' "$msg" | python3 -c 'import json,sys; print(json.dumps(sys.stdin.read()))') }
JSON

git add STATUS.md TASKS_LOG.md .codex/heartbeat.json .codex/count || true
git commit -m "chore(sync): heartbeat #$cnt — $msg" 2>/dev/null || true
