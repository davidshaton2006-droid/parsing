"""Optional decorative reference artwork for the marketing preview. Original SVG/CSS remains available."""
from pathlib import Path
import json, sys
from urllib.request import Request, urlopen
from concurrent.futures import ThreadPoolExecutor

out = Path(sys.argv[1]) / "marketing" / "assets" / "reference"
out.mkdir(parents=True, exist_ok=True)
sources = {
  "audit": "https://alekseykomarov.pro/img/ill-audit.webp?v=77a2edc1",
  "panel": "https://alekseykomarov.pro/img/ill-panel.webp?v=95e64308",
  "analytics": "https://alekseykomarov.pro/img/more-analytics.webp?v=7aa6e2d0",
  "web": "https://alekseykomarov.pro/img/more-sites.webp?v=4d75826d"
}
def fetch(item):
    key, url = item
    try:
        request = Request(url, headers={"User-Agent":"Mozilla/5.0 (compatible; static-site-preview/1.0)"})
        with urlopen(request, timeout=12) as response:
            data = response.read(2000001)
        if not 32 <= len(data) <= 2000000 or data[:4] != b"RIFF" or data[8:12] != b"WEBP":
            raise ValueError("Invalid or oversized WebP")
        (out / (key + ".webp")).write_bytes(data)
        return key, "/parsing/marketing/assets/reference/" + key + ".webp"
    except Exception as exc:
        print(f"Using local illustration for {key}: {exc}")
        return key, None
with ThreadPoolExecutor(max_workers=4) as pool:
    results = dict(pool.map(fetch, sources.items()))
manifest = {key:path for key,path in results.items() if path}
(out / "manifest.json").write_text(json.dumps(manifest, indent=2))
print("Reference visual assets available:", list(manifest))
