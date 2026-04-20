#!/bin/bash
# Force clean NODE_ENV for Next.js dev server
unset NODE_ENV
export NODE_ENV=development
export PATH="/opt/homebrew/bin:/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin:$HOME/.npm-global/bin"
export HOME="$HOME"
cd "$(dirname "$0")"
echo "Starting Next.js dev server with NODE_ENV=$NODE_ENV"
exec node ./node_modules/.bin/next dev -p 3001
