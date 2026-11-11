#!/bin/bash
# Petra IT booth launcher for macOS: opens index.html full screen with sound autoplay allowed.
cd "$(dirname "$0")"
HERE="$(pwd)"
# Percent-encode the path (spaces, Arabic letters, #) so the browser accepts it
URL="file://$(printf '%s' "$HERE/index.html" | perl -pe 's/([^A-Za-z0-9\/._~-])/sprintf("%%%02X",ord($1))/ge')"
FLAGS=(--user-data-dir="$HERE/.browser-profile" --autoplay-policy=no-user-gesture-required --no-first-run
       --no-default-browser-check --disable-sync --disable-features=Translate --start-fullscreen --app="$URL")
if open -Ra "Google Chrome" 2>/dev/null; then
  open -na "Google Chrome" --args "${FLAGS[@]}"
elif open -Ra "Microsoft Edge" 2>/dev/null; then
  open -na "Microsoft Edge" --args "${FLAGS[@]}"
else
  open "$HERE/index.html"   # Safari: click once on the page to enable sound
fi
