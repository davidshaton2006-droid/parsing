from pathlib import Path
from functools import partial
from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler
from threading import Thread
from tempfile import TemporaryDirectory
import json
from playwright.sync_api import sync_playwright

ROOT = Path.cwd()
OUT = ROOT / "test-results" / "marketing-visual"
OUT.mkdir(parents=True, exist_ok=True)
PAGES = ["", "catalog/", "solutions/", "pricing/", "partners/", "portfolio/"]
WIDTHS = [320, 390, 768, 900, 1024, 1440]
report, failures = [], []

def assert_page(condition, label):
    if not condition:
        raise AssertionError(label)

with TemporaryDirectory() as temp:
    (Path(temp) / "parsing").symlink_to(ROOT, target_is_directory=True)
    server = ThreadingHTTPServer(("127.0.0.1", 0), partial(SimpleHTTPRequestHandler, directory=temp))
    Thread(target=server.serve_forever, daemon=True).start()
    base = f"http://127.0.0.1:{server.server_port}/parsing/marketing/"
    try:
        with sync_playwright() as pw:
            browser = pw.chromium.launch()
            for route in PAGES:
                name = route.strip("/") or "home"
                for width in WIDTHS:
                    page = browser.new_page(viewport={"width": width, "height": 900}, device_scale_factor=1, reduced_motion="reduce")
                    errors, failed_requests = [], []
                    page.on("pageerror", lambda e: errors.append(str(e)))
                    page.on("response", lambda r: failed_requests.append(f"{r.status}: {r.url}") if r.status >= 400 and "/marketing/" in r.url else None)
                    row = {"page": name, "width": width}
                    try:
                        resp = page.goto(base + route, wait_until="load", timeout=20000)
                        assert_page(resp and resp.ok, "page response failed")
                        page.evaluate("document.fonts.ready")
                        page.screenshot(path=str(OUT / f"{name}-{width}.png"), animations="disabled")
                        if width in (390, 1440):
                            page.locator(".hero").screenshot(path=str(OUT / f"{name}-{width}-hero.png"), animations="disabled")
                        result = page.evaluate("""() => ({
                            width: document.documentElement.clientWidth,
                            scroll: document.documentElement.scrollWidth,
                            badImages: [...document.images].filter(i=>!i.complete||i.naturalWidth===0).map(i=>i.src),
                            h1: document.querySelectorAll('h1').length,
                            nav: document.querySelectorAll('#nav > a').length
                        })""")
                        row.update(result)
                        assert_page(result["scroll"] <= result["width"] + 1, f"horizontal overflow: {result['scroll']} > {result['width']}")
                        assert_page(not result["badImages"], "missing images: "+str(result["badImages"]))
                        assert_page(result["h1"] == 1 and result["nav"] == 6, "incorrect headings/navigation")
                        if width <= 1040:
                            page.locator(".menu").click()
                            assert_page(page.locator("#nav").is_visible(), "mobile menu does not open")
                            page.keyboard.press("Escape")
                            assert_page(not page.locator("#nav").is_visible(), "mobile menu does not close")
                        if width == 1440:
                            if name == "home":
                                assert_page(page.locator("#eco-hours").inner_text() == "50 ч", "default economy calculation")
                                page.locator("#eco-saving").evaluate("(e)=>{e.value=0;e.dispatchEvent(new Event('input',{bubbles:true}))}")
                                assert_page("Не покрывается" in page.locator("#eco-payback").inner_text(), "zero saving case")
                                page.locator("[data-workspace=orders]").click()
                                assert_page("Входящие обращения" in page.locator("#workspace-title").inner_text(), "workspace selector")
                            elif name == "solutions":
                                page.locator("[data-journey='1']").click()
                                assert_page("Доставка к месту" in page.locator(".journey-steps-v5").inner_text(), "journey selector")
                            elif name == "pricing":
                                page.locator("#integration-range").evaluate("(e)=>{e.value=3;e.dispatchEvent(new Event('input',{bubbles:true}))}")
                                assert_page(page.locator("#budget-integrations").input_value() == "3", "integration slider")
                                assert_page("30" in page.locator("#cost-extra-label").inner_text(), "integration value")
                            elif name == "partners":
                                for ident, value in [("pc-count",5),("pc-price",100000),("pc-rate",0.35),("pc-clients",10),("pc-support",20000)]:
                                    page.locator("#"+ident).evaluate("(e,v)=>{e.value=String(v);e.dispatchEvent(new Event('input',{bubbles:true}))}",value)
                                page.locator("#pc-bonus").check()
                                assert_page("".join(filter(str.isdigit,page.locator("#pc-total").inner_text())) == "260000", "commission calculation")
                                page.locator("#tier-range").evaluate("(e)=>{e.value=1000000;e.dispatchEvent(new Event('input',{bubbles:true}))}")
                                assert_page(page.locator("#tier-rate").inner_text() == "40%", "commission tier")
                            elif name == "portfolio":
                                page.locator("[data-project='6']").click()
                                assert_page(page.locator("#project-name").inner_text() == "Доктор Кар", "portfolio selection")
                                assert_page(page.locator("#project-link").get_attribute("href") == "/parsing/doctor-car/", "Doctor Car published route")
                                page.locator("[data-device=mobile]").click()
                                assert_page("mobile" in page.locator("#preview-viewport").get_attribute("class"), "mobile preview")
                        assert_page(not errors, "browser exceptions: "+str(errors))
                        assert_page(not failed_requests, "resource errors: "+str(failed_requests))
                        row["status"] = "passed"
                    except Exception as e:
                        row["status"] = "failed"
                        row["error"] = str(e)
                        failures.append(f"{name}/{width}: {e}")
                    finally:
                        report.append(row)
                        page.close()
            browser.close()
    finally:
        server.shutdown()
(OUT / "report.json").write_text(json.dumps(report,ensure_ascii=False,indent=2))
print(json.dumps(report,ensure_ascii=False,indent=2))
if failures:
    raise SystemExit("\n".join(failures))
