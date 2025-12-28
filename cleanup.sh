#!/usr/bin/env bash
set -euo pipefail

# Cleanup helper for accidental Desktop / iCloud / Downloads copies inside the repo.
# Run from project root. Interactive prompts before destructive actions.

confirm() {
  # prompt: returns 0 on yes, 1 otherwise
  local prompt="$1"
  read -r -p "$prompt [y/N]: " resp
  case "$resp" in
    [yY][eE][sS]|[yY]) return 0 ;;
    *) return 1 ;;
  esac
}

echo "==================================================================="
echo "ACCIDENTAL FILES CLEANUP SCRIPT"
echo
echo "This script will search for likely-accidental folders in this repository"
echo "(Desktop / iCloud / Downloads copies, Visual Studio Code.app copies, and"
echo "problematic build subtrees). It will present candidates and ask before"
echo "chowning / deleting anything."
echo
echo "Make sure you are running this from the project root: $(pwd)"
echo "If this is NOT the project root, abort now (Ctrl-C) and cd to the correct folder."
echo "==================================================================="

if ! confirm "Continue from $(pwd)?"; then
  echo "Aborted by user."
  exit 0
fi

echo
echo "1) Listing watcher / dev processes that may be running (wrangler, node, etc.)"
pgrep -fl 'wrangler|node' || echo "No wrangler/node processes found (or insufficient privileges)."

if confirm "Kill any running wrangler/node processes shown above?"; then
  # collect PIDs and kill (careful: this will kill *all* node/wrangler instances)
  mapfile -t pids < <(pgrep -f "wrangler|node" || true)
  if [ ${#pids[@]} -gt 0 ]; then
    echo "Killing PIDs: ${pids[*]}"
    # attempt graceful kill then force
    sudo kill "${pids[@]}" || true
    sleep 1
    # wait a bit and force if still present
    mapfile -t still < <(pgrep -f "wrangler|node" || true)
    if [ ${#still[@]} -gt 0 ]; then
      echo "Forcing remaining PIDs: ${still[*]}"
      sudo kill -9 "${still[@]}" || true
    fi
  else
    echo "No matching PIDs found."
  fi
else
  echo "Leaving running processes alone. Note: you may see permission/EMFILE errors until watchers are stopped."
fi

echo
echo "2) Finding candidate paths (this will search for Visual Studio Code copies,"
echo "   any folder with 'iCloud', 'Desktop', or 'Downloads' in its path under the repo,"
echo "   and build subtrees containing those strings)."
echo

declare -a candidates
# explicit candidate paths known from your logs
if [ -d "app/public/Downloads" ]; then
  candidates+=("app/public/Downloads")
fi

# find Visual Studio Code.app copies under repo (limit depth to 6 to avoid scanning entire disk)
while IFS= read -r p; do candidates+=("$p"); done < <(find . -maxdepth 6 -type d -iname "Visual Studio Code.app" -print 2>/dev/null || true)

# find directories under build that contain iCloud/Desktop/Downloads in the name
if [ -d "build" ]; then
  while IFS= read -r p; do candidates+=("$p"); done < <(find build -type d -regextype posix-extended -regex '.*(iCloud|iCloud Drive|Desktop|Downloads).*' -print 2>/dev/null || true)
fi

# find any repo path (below project root) matching patterns (limit reasonable depth)
while IFS= read -r p; do
  # avoid adding "." itself
  if [ "$p" != "." ]; then
    candidates+=("${p#./}")
  fi
done < <(find . -maxdepth 6 -type d \( -iname "*iCloud*" -o -iname "*Desktop*" -o -iname "*Downloads*" \) -print 2>/dev/null || true)

# deduplicate
IFS=$'\n' sorted=($(printf "%s\n" "${candidates[@]}" | awk '!seen[$0]++'))
unset IFS
candidates=("${sorted[@]}")

if [ ${#candidates[@]} -eq 0 ]; then
  echo "No candidate accidental directories found under the repo (limited-depth search)."
  echo "If you know of a specific path, run the script again or inspect it manually."
else
  echo "Found the following candidate directories:"
  for p in "${candidates[@]}"; do
    # show size if possible
    if [ -e "$p" ]; then
      size=$(du -sh "$p" 2>/dev/null | awk '{print $1}' || echo "n/a")
      echo "  - $p (size: $size)"
    else
      echo "  - $p (not present)"
    fi
  done
fi

echo
if ! confirm "Do you want to interactively review and potentially delete any of the above candidates?"; then
  echo "Nothing changed. Exiting."
  exit 0
fi

echo
echo "3) Interactive deletion: review each candidate"
removed=()
for p in "${candidates[@]}"; do
  if [ ! -e "$p" ]; then
    echo "Skipping $p (no longer exists)."
    continue
  fi
  size=$(du -sh "$p" 2>/dev/null | awk '{print $1}' || echo "n/a")
  echo
  echo "---------------------------------------------"
  echo "Candidate: $p"
  echo "Size: $size"
  echo "Listing top-level contents:"
  ls -la "$p" | sed -n '1,40p' || true
  echo "---------------------------------------------"
  if confirm "Delete this path permanently?"; then
    echo "Attempting to chown and remove: $p"
    # try to change owner so deletion won't be blocked
    sudo chown -R "$(id -u):$(id -g)" "$p" 2>/dev/null || true
    # now remove
    rm -rf "$p"
    echo "Removed $p"
    removed+=("$p")
    # if it was tracked by git, remove from index
    if git ls-files --error-unmatch "$p" >/dev/null 2>&1; then
      echo "Removing $p from git index (cached)"
      git rm -r --cached --ignore-unmatch "$p" || true
    fi
  else
    echo "Keeping $p (not removed)."
  fi
done

echo
echo "Removed the following paths (if any):"
printf '%s\n' "${removed[@]:-<none>}"

echo
if [ ${#removed[@]} -gt 0 ]; then
  if confirm "Commit the git index changes (remove tracked paths) with a safe message?"; then
    git add -A || true
    git commit -m "Remove accidental desktop/downloads copies from repo" || echo "Nothing to commit or commit failed"
  else
    echo "Skipping git commit. Remember to commit or cleanup the index manually if needed."
  fi
fi

echo
echo "4) .gitignore & VS Code watcher suggestions"
if confirm "Append safe ignore patterns to .gitignore in project root?"; then
  cat >> .gitignore <<'GITIGNORE'

# Ignore accidental user folders and build output
app/public/Downloads/
build/
**/*iCloud*
**/*iCloud\ Drive*
**/*Desktop*
**/*Downloads*
GITIGNORE
  echo "Appended patterns to .gitignore"
  git add .gitignore || true
  if confirm "Commit the .gitignore change?"; then
    git commit -m "Ignore accidental user folders and build output" || echo "Commit failed"
  fi
else
  echo ".gitignore not changed."
fi

echo
echo "5) Optionally, remove build and node_modules and rebuild"
if confirm "Remove build/ and node_modules/ and run npm install && npm run build?"; then
  echo "Removing build/ and node_modules/"
  rm -rf build node_modules
  echo "Running npm install (this may take a few minutes)..."
  npm install
  echo "Running npm run build..."
  if npm run build; then
    echo "Build finished (npm run build returned success)"
  else
    echo "Build failed — capture the first 80 lines of output and paste them here for analysis."
  fi
else
  echo "Skipping rebuild step."
fi

echo
echo "6) VS Code settings suggestion (manual)"
echo "It is recommended to add watcher exclusions to VS Code user settings so VS Code won't watch Desktop/iCloud in future."
echo "Open your VS Code settings (User settings.json) and add under top-level object:"
cat <<'JSON'
"files.watcherExclude": {
  "**/app/public/Downloads/**": true,
  "**/build/**": true,
  "**/*iCloud*": true,
  "**/*iCloud Drive*": true,
  "**/*Desktop*": true,
  "**/*Downloads*": true
}
JSON
echo
echo "If you want, I can also append these to your settings.json, but I prefer you review and paste them in to avoid changing your editor config unexpectedly."

echo
echo "Cleanup script finished."
echo "If you still see EMFILE / permission / tsconfig errors after this, paste the exact new log (first ~80 lines) and the output of 'ls -la app/public/Downloads' (if it exists) and I will continue debugging."
