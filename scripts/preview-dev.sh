#!/bin/bash
# Same as preview.sh but runs `next dev`, so React StrictMode double-invokes
# effects — the condition that exposes gsap.from() baking in start values.
cd "$(dirname "$0")/.." || exit 1
pkill -f "next dev" 2>/dev/null; pkill -f "next-server" 2>/dev/null; sleep 1
npx next dev -p 3000 >/tmp/dev.log 2>&1 &
SERVER=$!
for i in $(seq 1 60); do
  if curl -s -o /dev/null http://localhost:3000/; then break; fi
  sleep 1
done
sleep 4
python3 scripts/shoot.py "$@"
STATUS=$?
kill $SERVER 2>/dev/null
pkill -f "next dev" 2>/dev/null
pkill -f "next-server" 2>/dev/null
exit $STATUS
