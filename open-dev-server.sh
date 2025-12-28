#!/usr/bin/env bash
PORT=$(lsof -nP -iTCP -sTCP:LISTEN | egrep -i "node|wrangler|vite|webpack|next|python|serve|http-server" | head -n1 | sed -E 's/.*:([0-9]+) \(LISTEN\).*/\1/')
if [ -n "$PORT" ]; then
  echo "Opening http://localhost:$PORT"
  open "http://localhost:$PORT"
else
  echo "No dev server found. Start your dev server (e.g. npm run dev / wrangler dev), then try again."
fi
