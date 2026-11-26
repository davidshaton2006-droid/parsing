#!/usr/bin/env bash
set -euo pipefail
target="${1:?marketing output directory}"
scratch="$(mktemp -d)"
trap 'rm -rf "$scratch"' EXIT
npm install --prefix "$scratch" --no-save --no-package-lock --no-audit --no-fund react@18.3.1 react-dom@18.3.1 motion@12.23.24 lucide-react@0.468.0 esbuild@0.25.5 tailwindcss@3.4.17
cp -R marketing/components "$scratch/components"
mkdir -p "$target/vendor"
cat > "$scratch/tailwind.config.cjs" <<'EOF'
module.exports = { content: ['./components/ui/provably.tsx','./components/provably-entry.tsx'], important: '.cv-hero', corePlugins: { preflight: false }, theme: { extend: {} } }
EOF
printf '%s\n' '@tailwind utilities;' > "$scratch/input.css"
out="$(cd "$target/vendor" && pwd)"
(cd "$scratch" && node_modules/.bin/tailwindcss -c tailwind.config.cjs -i input.css -o "$out/provably.css" --minify)
"$scratch/node_modules/.bin/esbuild" "$scratch/components/provably-entry.tsx" --bundle --minify --platform=browser --target=es2022 --format=iife --jsx=automatic --define:process.env.NODE_ENV='"production"' --outfile="$out/provably.js"
test -s "$out/provably.js"
test -s "$out/provably.css"
node --check "$out/provably.js"
