#!/usr/bin/env bash
set -euo pipefail
target="${1:?marketing output directory}"
scratch="$(mktemp -d)"
trap 'rm -rf "$scratch"' EXIT
npm install --prefix "$scratch" --no-save --no-package-lock --no-audit --no-fund react@18.3.1 react-dom@18.3.1 esbuild@0.25.5
mkdir -p "$target/vendor"
NODE_PATH="$scratch/node_modules" "$scratch/node_modules/.bin/esbuild" marketing/components/peak-chart-entry.tsx --bundle --minify --platform=browser --target=es2020 --format=iife --define:process.env.NODE_ENV='"production"' --outfile="$target/vendor/peak-chart.js"
test -s "$target/vendor/peak-chart.js"
