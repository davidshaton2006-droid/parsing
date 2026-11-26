#!/usr/bin/env bash
set -euo pipefail
target="${1:?marketing output directory}"
scratch="$(mktemp -d)"
trap 'rm -rf "$scratch"' EXIT
npm pack motion@12.23.24 --pack-destination "$scratch" --silent
tar -xzf "$scratch"/motion-12.23.24.tgz -C "$scratch"
test -s "$scratch/package/dist/motion.js"
mkdir -p "$target/vendor"
cp "$scratch/package/dist/motion.js" "$target/vendor/motion.js"
if [ -f "$scratch/package/LICENSE" ]; then cp "$scratch/package/LICENSE" "$target/vendor/MOTION-LICENSE.txt"; fi
