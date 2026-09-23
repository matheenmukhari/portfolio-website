#!/bin/bash
# Boot the production server, take screenshots, shut it down.
cd "$(dirname "$0")/.." || exit 1
pkill -f "next-server" 2>/dev/null; pkill -f "next start" 2>/dev/null; sleep 1
npx next start -p 3000 >/tmp/next.log 2>&1 &
SERVER=$!
for i in $(seq 1 40); do
  if curl -s -o /dev/null http://localhost:3000/; then break; fi
  sleep 0.5
done
python3 scripts/shoot.py "$@"
STATUS=$?
kill $SERVER 2>/dev/null; pkill -f "next-server" 2>/dev/null
wait $SERVER 2>/dev/null
exit $STATUS
