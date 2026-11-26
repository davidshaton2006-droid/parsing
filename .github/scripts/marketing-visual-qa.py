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
                        # Verify the actual artwork declared in the local manifest.
                        # Lazy images are explicitly scrolled into view before checking.
                        art_manifest = json.loads((ROOT / "marketing/assets/reference/manifest.json").read_text())
                        for art in page.locator("[data-ref-art]").all():
                            key = art.get_attribute("data-ref-art")
                            if key in art_manifest:
                                art.scroll_into_view_if_needed()
                                art.locator("img.reference-object-art").wait_for(state="attached", timeout=7000)
                                page.wait_for_function("(key)=>{const e=document.querySelector('[data-ref-art='+key+']');const i=e?.querySelector('img');return e?.classList.contains('has-object-art')&&i?.naturalWidth>0}", arg=key, timeout=7000)
                                if width in (390, 1440):
                                    art.screenshot(path=str(OUT / f"{name}-{width}-art-{key}.png"), animations="disabled")
                        page.evaluate("window.scrollTo(0,0)")

                        page.screenshot(path=str(OUT / f"{name}-{width}.png"), animations="disabled")
                        if width in (390, 1440):
                            page.locator(".hero").screenshot(path=str(OUT / f"{name}-{width}-hero.png"), animations="disabled")
                        # Decode lazy images before asserting resource health; a screenshot alone does not trigger every lazy resource.
                        page.evaluate("""async () => {
                            const imgs=[...document.images].filter(i=>!i.hidden&&!i.closest('[hidden]')&&i.getAttribute('src'));
                            await Promise.all(imgs.map(async i=>{i.loading='eager';try{await i.decode()}catch{}}));
                        }""")
                        result = page.evaluate("""() => ({
                            width: document.documentElement.clientWidth,
                            scroll: document.documentElement.scrollWidth,
                            badImages: [...document.images].filter(i=>!i.classList.contains('reference-object-art')&&!i.hidden&&!i.closest('[hidden]')&&i.getAttribute('src')&&(!i.complete||i.naturalWidth===0)).map(i=>i.src),
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
                                page.locator('[data-ref-step="4"]').click()
                                assert_page(page.locator("#ref-step-title").inner_text() == "Запуск", "project timeline")
                                page.locator('[data-ref-chart="2"]').click()
                                assert_page(page.locator("#ref-auto-out").inner_text() == "85", "chart scenario")
                                page.locator("#ref-chart-board.peak-enhanced [data-peak-chart]").first.wait_for(state="visible",timeout=10000)
                                assert_page(page.locator("#ref-chart-board [data-peak-chart]").count()==2,"two original Peak Chart instances")
                                page.wait_for_function("document.querySelectorAll('#ref-chart-board [data-part=period]')[0]?.textContent==='Интенсивный'",timeout=10000)
                                page.locator("#ref-chart-board [data-peak-chart]").first.locator("button[aria-haspopup=listbox]").click()
                                page.locator("#ref-chart-board [data-peak-chart]").first.get_by_role("option",name="Постепенный").click()
                                assert_page(page.locator("#ref-auto-out").inner_text()=="45","Peak Chart dropdown sync")
                                page.wait_for_function("document.querySelectorAll('#ref-chart-board [data-part=period]')[1]?.textContent==='Постепенный'",timeout=10000)
                                page.locator("#workspace-body [data-peak-chart]").wait_for(state="visible",timeout=10000)
                                assert_page(page.locator("#workspace-body .workspace-chart").is_hidden(),"workspace chart replacement")

                                page.locator(".ref-diag input").first.check()
                                assert_page(page.locator("#ref-score-ring").get_attribute("aria-label") == "1 из 8", "diagnostic score")
                                page.locator("[data-workspace=orders]").click()
                                assert_page("Входящие обращения" in page.locator("#workspace-title").inner_text(), "workspace selector")
                            elif name == "solutions":
                                page.locator("[data-journey='1']").click()
                                assert_page("Доставка к месту" in page.locator(".journey-steps-v5").inner_text(), "journey selector")
                                page.locator('[data-club-add="0"]').click()
                                page.locator('[data-club-add="0"]').click()
                                page.locator('[data-club-add="1"]').click()
                                assert_page("730" in page.locator("#club-total").inner_text(), "club cart total")
                                page.locator("#club-send").click()
                                assert_page("730" in page.locator("#club-admin-order").inner_text(), "club test order")
                                page.locator("#club-accept").click()
                                assert_page("Принят сотрудником" in page.locator("#club-admin-order").inner_text(), "club order accepted")
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
                                page.locator('[data-preset="start"]').click()
                                assert_page("".join(filter(str.isdigit,page.locator("#pc-total").inner_text())) == "36000", "partner start preset")
                                page.locator('[data-preset="active"]').click()
                                assert_page("".join(filter(str.isdigit,page.locator("#pc-total").inner_text())) == "260000", "partner active preset")
                                page.locator('[data-preset="agency"]').click()
                                assert_page("".join(filter(str.isdigit,page.locator("#pc-total").inner_text())) == "790000", "partner agency preset")
                                page.locator("#finder-city").select_option("Ростов-на-Дону")
                                page.locator("#finder-type").select_option("auto")
                                assert_page("Автосервис D" in page.locator("#finder-rows").inner_text(), "finder city/category")
                                page.locator("#finder-site").check()
                                assert_page("Нет тестовых записей" in page.locator("#finder-rows").inner_text(), "finder website filter")
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
            # Motion is exercised with animations enabled on desktop and mobile.
            for width in (390, 1440):
                page = browser.new_page(viewport={"width": width, "height": 900}, reduced_motion="no-preference")
                try:
                    page.goto(base, wait_until="load", timeout=20000)
                    page.wait_for_function("document.documentElement.dataset.marketingMotion === 'motion'", timeout=10000)
                    for scene in page.locator(".service-scene-v6").all():
                        scene.scroll_into_view_if_needed()
                        scene.locator(".scene-window-v6").wait_for(state="visible")
                        page.wait_for_function("(el)=>el.dataset.motionPlayed === 'true'", arg=scene.element_handle(), timeout=7000)
                        assert_page(scene.locator("img.reference-object-art").count()==0, "static art hides animated interface")
                    assert_page(page.locator(".motion-approach").count()==3, "distinct approach scenes")
                    page.locator(".motion-approach").first.screenshot(path=str(OUT / f"motion-approach-{width}.png"), animations="disabled")
                    report.append({"page":"motion","width":width,"status":"passed"})
                except Exception as e:
                    failures.append(f"motion/{width}: {e}")
                    report.append({"page":"motion","width":width,"status":"failed","error":str(e)})
                finally:
                    page.close()
            browser.close()
    finally:
        server.shutdown()
(OUT / "report.json").write_text(json.dumps(report,ensure_ascii=False,indent=2))
print(json.dumps(report,ensure_ascii=False,indent=2))
if failures:
    raise SystemExit("\n".join(failures))
