#!/usr/bin/env bash
set -euo pipefail
target="${1:?marketing output directory}"
scratch="$(mktemp -d)"
trap 'rm -rf "$scratch"' EXIT
npm install --prefix "$scratch" --no-save --no-package-lock --no-audit --no-fund motion@12.23.24 esbuild@0.25.5
mkdir -p "$target/vendor"
# Bundle the documented JS API rather than assuming an npm tarball layout.
# Use an entry inside the temporary dependency directory for deterministic resolution.
printf '%s\n' 'export { animate, inView } from "motion";' > "$scratch/entry.mjs"
"$scratch/node_modules/.bin/esbuild" "$scratch/entry.mjs" --bundle --minify --platform=browser --target=es2020 --format=iife --global-name=Motion --outfile="$target/vendor/motion.js"
test -s "$target/vendor/motion.js"
node --check "$target/vendor/motion.js"
if [ -f "$scratch/node_modules/motion/LICENSE" ]; then cp "$scratch/node_modules/motion/LICENSE" "$target/vendor/MOTION-LICENSE.txt"; fi
