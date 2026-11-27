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
WIDTHS = [320, 375, 390, 768, 900, 1024, 1440, 1920]
report, failures = [], []

def assert_page(condition, label):
    if not condition:
        raise AssertionError(label)

def assert_step_icon_centers(page):
    # Check the actual visible SVG/number, not merely the outer button.
    stats=page.locator('[data-steps-path]').evaluate("""root => {
        const center=r=>[r.left+r.width/2,r.top+r.height/2];
        return [...root.querySelectorAll('.sp-center')].filter(el=>{
          const b=el.getBoundingClientRect();
          return b.width>0&&b.height>0&&!el.closest('li[aria-hidden=true]')&&
            !el.querySelector('.sp-center')&&(el.querySelector('svg')||el.textContent.trim());
        }).map(el=>{
          const b=el.getBoundingClientRect(), svg=el.querySelector('svg');
          const range=document.createRange();range.selectNodeContents(el);
          const r=svg?svg.getBoundingClientRect():range.getBoundingClientRect();
          const [x,y]=center(b),[ix,iy]=center(r);
          return {label:el.getAttribute('aria-label')||el.textContent.trim()||'svg',
             dx:Math.abs(x-ix),dy:Math.abs(y-iy),columns:getComputedStyle(el).gridTemplateColumns};
        });
    }""")
    assert_page(len(stats)>=10,"icon centering checks cover all controls")
    assert_page(all(x["dx"]<=1.5 and x["dy"]<=1.5 for x in stats),"icon center offsets: "+str(stats))

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
                        page.wait_for_function("document.documentElement.dataset.provably==='ready'",timeout=12000)
                        page.evaluate("document.fonts.ready")
                        if name == "home":
                            page.wait_for_selector('[data-steps-ready="true"]', timeout=12000)
                            assert_step_icon_centers(page)
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
                            nav: document.querySelectorAll('#nav .lgt-track > a').length,
                            tabs: document.querySelectorAll('#nav .lgt-item').length,
                            active: document.querySelectorAll('#nav .lgt-item.lgt-on').length
                        })""")
                        row.update(result)
                        if result["scroll"] > result["width"] + 1:
                            row["overflow_elements"]=page.evaluate("""()=>[...document.querySelectorAll('main *')].filter(e=>{const b=e.getBoundingClientRect();return b.right>innerWidth+1&& !e.closest('.table-wrap')}).slice(0,20).map(e=>({tag:e.tagName,cls:String(e.className).slice(0,90),right:Math.round(e.getBoundingClientRect().right),text:e.textContent.trim().slice(0,60)}))""")
                        assert_page(result["scroll"] <= result["width"] + 1, f"horizontal overflow: {result['scroll']} > {result['width']}")
                        assert_page(not result["badImages"], "missing images: "+str(result["badImages"]))
                        assert_page(result["h1"] == 1 and result["nav"] == 6 and result["tabs"] == 7 and result["active"] == 1, "incorrect headings/navigation")
                        scale = page.evaluate("""() => {
                            const style = (s) => getComputedStyle(document.querySelector(s));
                            return {body:parseFloat(style('body').fontSize), title:parseFloat(style('h1').fontSize),
                                titleWeight:parseInt(style('h1').fontWeight), heading:parseFloat(style('.section-head h2').fontSize),
                                icon:parseFloat(style('#nav .lgt-icon').width), button:parseFloat(style('.cv-actions a').minHeight),
                                container:document.querySelector('main.wrap').getBoundingClientRect().width}
                        }""")
                        row["expanded_scale"] = scale
                        assert_page(scale["body"] >= 17 and scale["title"] >= 29 and scale["heading"] >= 30 and scale["titleWeight"] >= 700, "expanded typography")
                        assert_page(scale["icon"] >= 25 and scale["button"] >= 52, "expanded navigation and CTA")
                        if width == 1920:
                            assert_page(scale["container"] >= 1500, "wide desktop container")

                        bar = page.locator("#nav .lgt-track")
                        assert_page(bar.is_visible(), "liquid glass navigation not visible")
                        assert_page(page.locator("html").get_attribute("data-spotlight")=="ready","Spotlight controller not ready")
                        assert_page(page.locator("[data-glow]").count()>=8,"missing page-wide spotlight surfaces")
                        assert_page(page.locator(".tile:not([data-glow]),.story-tile-v5:not([data-glow]),.ref-project:not([data-glow])").count()==0,"uncovered card")
                        assert_page(page.locator(".hero[data-glow]").count()==1,"hero spotlight")
                        expected_notes=4 if name=="home" else 4 if name in ("catalog","pricing") else 3
                        pinned=page.locator("section[data-pinned-approach]")
                        assert_page(pinned.count()==1,"pinned style must target only the requested section")
                        assert_page(pinned.locator(".section-head .eyebrow").text_content().strip()==("Возможности развития." if name=="home" else "Практический подход"),"wrong section modified")
                        assert_page(pinned.locator(".pinned-note").count()==expected_notes,"incorrect pinned card count")
                        assert_page(pinned.locator(".pinned-note-frame .pinned-pin").count()==expected_notes,"pin icons missing")
                        assert_page(pinned.locator(".pinned-note-body h3").count()==expected_notes and pinned.locator(".pinned-note-body p").count()>=expected_notes,"card content missing")
                        assert_page(page.locator(".pinned-note").count()==expected_notes,"unrelated cards modified")
                        assert_page(pinned.locator(".pinned-connector").is_visible()==(width>=768),"connector responsive state")
                        assert_page(pinned.locator(".pinned-connector path").evaluate("(e)=>getComputedStyle(e).animationName")=="none","reduced motion connector")
                        if width in (390,1440):
                            pinned.screenshot(path=str(OUT / f"{name}-{width}-pinned-approach.png"),animations="disabled")

                        assert_page(page.locator("[data-slot=provably]").count()==1,"missing shared Provably hero")
                        expected_title={"home":"Где ваш бизнес теряет клиентов, время и деньги?","catalog":"Разработка под задачи вашего бизнеса","solutions":"Что можно создать для бизнеса в вашей отрасли?","pricing":"Понятный бюджет до начала разработки","partners":"Зарабатывайте больше на своих клиентах","portfolio":"Посмотрите, что можно разработать для вашего бизнеса"}[name]
                        assert_page(page.locator("h1").evaluate("(e)=>e.getAttribute('aria-label')")==expected_title,"exact approved hero headline")
                        assert_page(page.locator("#request input[name=business]").count()==1,"inquiry business context")

                        assert_page(page.locator(".cv-cert").count()==3,"missing page-specific stack")
                        switch=page.locator(".cv-toggle")
                        assert_page(switch.is_visible(),"color switch not visible")
                        before=switch.get_attribute("aria-checked")
                        switch.click()
                        page.wait_for_function("(before)=>document.querySelector('.cv-toggle').getAttribute('aria-checked')!==before",arg=before,timeout=3000)
                        page.wait_for_function("document.querySelector('.cv-wave').dataset.state==='clear'",timeout=3000)
                        page.locator(".cv-cert[tabindex='0']").click()
                        page.locator(".cv-dialog [role=dialog]").wait_for(state="visible",timeout=3000)
                        page.locator(".cv-dialog button[aria-label='Закрыть карточку']").click()
                        page.locator(".cv-dialog [role=dialog]").wait_for(state="hidden",timeout=4000)
                        page.evaluate("window.scrollTo(0,0)")
                        if width in (390,1440):
                            page.locator(".hero").screenshot(path=str(OUT / f"{name}-{width}-provably-color.png"),animations="disabled")
                        assert_page(page.locator(".hero").evaluate("(e)=>getComputedStyle(e,'::after').opacity")== "0","reduced motion must suppress spotlight")

                        assert_page(bar.locator("a[aria-current=page]").evaluate("(e)=>e.classList.contains('lgt-on')"), "current route not selected")
                        assert_page(bar.locator(".lgt-item svg").count()==7, "missing navigation icons")
                        assert_page(bar.evaluate("""e=>[...e.querySelectorAll('.lgt-item')].every(i=>{
                            const r=i.getBoundingClientRect();return r.width>=33&&r.height>=44&&r.left>=0&&r.right<=innerWidth+1
                        })"""), "navigation hit areas or overflow")
                        directions=bar.locator("button.mega-toggle")
                        directions.click()
                        assert_page(page.locator("#liquid-glass-directions").is_visible(), "directions menu does not open")
                        assert_page(directions.get_attribute("aria-expanded")=="true", "directions expanded state")
                        assert_page(page.locator("#liquid-glass-directions a").count()==8, "missing directions")
                        assert_page(bar.get_attribute("data-active")=="6", "glass did not move to directions")
                        page.keyboard.press("Escape")
                        assert_page(not page.locator("#liquid-glass-directions").is_visible(), "directions menu does not close")
                        assert_page(bar.locator("a[aria-current=page]").evaluate("(e)=>e.classList.contains('lgt-on')"), "glass did not return to current route")
                        if width in (320,390,1440):
                            page.locator("#nav").screenshot(path=str(OUT / f"{name}-{width}-tabbar.png"), animations="disabled")
                        if width == 1440:
                            if name == "home":
                                assert_page(page.locator("#eco-hours").inner_text() == "50 ч", "default economy calculation")
                                assert_page(page.locator("#business-scenarios [data-business-scenario]").count()==5,"five business scenarios")
                                page.locator('[data-business-scenario="3"]').click()
                                assert_page("индивидуальным ценам" in page.locator("#business-scenario-content").inner_text(),"wholesale scenario")
                                page.locator("#diag-industry").select_option("3")
                                page.locator("#diag-goal").select_option("2")
                                assert_page("B2B-портал" in page.locator("#business-recommendations").inner_text(),"diagnostic matrix")
                                page.locator("#business-diagnosis-request").click()
                                assert_page("B2B-портал" in page.locator('#request textarea[name=message]').input_value(),"diagnosis context in inquiry")
                                assert_page("60000" in "".join(filter(str.isdigit,page.locator("#sales-result").inner_text())),"own sales economics")
                                assert_page("60000" in "".join(filter(str.isdigit,page.locator("#product-result").inner_text())),"product economics")
                                assert_page(pinned.locator(".pinned-note-body a").count()==4,"all problem CTAs preserved")

                                page.locator("#eco-saving").evaluate("(e)=>{e.value=0;e.dispatchEvent(new Event('input',{bubbles:true}))}")
                                assert_page("Не покрывается" in page.locator("#eco-payback").inner_text(), "zero saving case")
                                path = page.locator('[data-steps-path]')
                                slider = path.get_by_role("slider")
                                assert_page(path.locator('button[aria-label^="Перейти к этапу"]').count()==6, "six project steps")
                                assert_page(not path.evaluate("(e)=>e.classList.contains('dark')"),"light default")
                                path.get_by_role("button",name="Перейти к этапу 5: Запуск").click()
                                page.wait_for_function("document.querySelector('[data-steps-path] [role=slider]').getAttribute('aria-valuenow')==='5'")
                                assert_page(path.locator('li[aria-hidden=false] h3').inner_text()=="Запуск","project timeline")
                                slider.focus()
                                slider.press("End")
                                page.wait_for_function("document.querySelector('[data-steps-path] [role=slider]').getAttribute('aria-valuenow')==='6'")
                                assert_page(path.locator('li[aria-hidden=false] h3').inner_text()=="Развитие","sixth stage")
                                assert_step_icon_centers(page)
                                path.get_by_role("button",name="Сначала").click()
                                page.wait_for_function("document.querySelector('[data-steps-path] [role=slider]').getAttribute('aria-valuenow')==='1'")
                                path.get_by_role("button",name="Тёмная тема").click()
                                assert_page(path.evaluate("(e)=>e.classList.contains('dark')"),"theme toggle")
                                path.get_by_role("button",name="Тёмная тема").click()
                                path.get_by_role("button",name="Включить автопрокрутку").click()
                                assert_page(path.get_by_role("button",name="Приостановить автопрокрутку").get_attribute("aria-pressed")=="true","autoplay control")
                                path.get_by_role("button",name="Приостановить автопрокрутку").click()
                                path.screenshot(path=str(OUT / f"home-{width}-steps-path.png"),animations="disabled")
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
                                page.locator(".journey-steps-v5 .pinned-note").last.wait_for(state="visible")
                                assert_page(page.locator(".journey-steps-v5 .pinned-note").count()==3,"scenario changes retain pinned layout")
                                assert_page(page.locator(".journey-steps-v5 .pinned-connector").count()==1,"scenario connector preserved")

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
                            elif name == "catalog":
                                page.locator("#category").select_option("ai")
                                assert_page(page.locator("#filter-grid #ai").is_visible(), "AI commercial need")
                                assert_page(page.locator("#filter-grid #web").is_hidden(), "unrelated service filtered")
                                page.locator("#search").fill("RAG")
                                assert_page(page.locator("#filter-grid #ai").is_visible(), "search and commercial need combine")
                                page.locator("#search").fill("")
                                page.locator("#category").select_option("")
                                assert_page(page.locator("#filter-grid .filter-item:visible").count()==8,"reset all service directions")
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
                                assert_page("Ростов-на-Дону" in page.locator("#finder-rows").inner_text() and "Компания Б" in page.locator("#finder-rows").inner_text(), "finder city/category")
                                page.locator("#finder-service").select_option("ai")
                                assert_page("ИИ-ассистента" in page.locator("#finder-detail").inner_text(), "finder service hypothesis")
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
                    page.wait_for_function("document.documentElement.dataset.provably==='ready'",timeout=12000)
                    for scene in page.locator(".service-scene-v6").all():
                        scene.scroll_into_view_if_needed()
                        scene.locator(".scene-window-v6").wait_for(state="visible")
                        page.wait_for_function("(el)=>el.dataset.motionPlayed === 'true'", arg=scene.element_handle(), timeout=7000)
                        assert_page(scene.locator("img.reference-object-art").count()==0, "static art hides animated interface")
                    assert_page(page.locator(".motion-approach").count()==3, "distinct approach scenes")
                    page.locator(".motion-approach").first.screenshot(path=str(OUT / f"motion-approach-{width}.png"), animations="disabled")
                    path=page.locator('[data-steps-path]')
                    path.scroll_into_view_if_needed()
                    assert_step_icon_centers(page)
                    # The supplied 3D carousel must retain its visible next card.
                    neighbor=path.locator('li[aria-roledescription=slide]').nth(1)
                    assert_page(neighbor.evaluate("(e)=>parseFloat(getComputedStyle(e).opacity)>0.1 && getComputedStyle(e).transform!=='none'"),"next step preview preserved")
                    path.get_by_role("button",name="Перейти к этапу 3: Прототип").click()
                    page.wait_for_function("document.querySelector('[data-steps-path] [role=slider]').getAttribute('aria-valuenow')==='3'")
                    page.wait_for_timeout(1000)
                    assert_step_icon_centers(page)
                    path.screenshot(path=str(OUT/f"steps-icons-motion-{width}.png"),animations="disabled")
                    # Test pointer light and the independently rendered border without intercepting input.
                    if width==1440:
                        card=page.locator(".service-bento > .tile").first
                        card.scroll_into_view_if_needed()
                        box=card.bounding_box()
                        assert_page(box is not None,"spotlight card has no layout")
                        x0=box["x"]+min(40,box["width"]/4)
                        y0=max(100,box["y"]+min(40,box["height"]/4))
                        page.mouse.move(x0,y0)
                        page.wait_for_function("(el)=>el.classList.contains('spotlight-active')",arg=card.element_handle(),timeout=2500)
                        page.wait_for_function("(el)=>getComputedStyle(el,'::after').opacity==='1'",arg=card.element_handle(),timeout=2500)
                        first=card.evaluate("(e)=>parseFloat(e.style.getPropertyValue('--spot-x'))")
                        page.mouse.move(x0+60,y0)
                        page.wait_for_function("({el,first})=>Math.abs(parseFloat(el.style.getPropertyValue('--spot-x'))-first)>25",arg={"el":card.element_handle(),"first":first},timeout=2500)
                        assert_page(card.evaluate("(e)=>getComputedStyle(e,'::after').pointerEvents")=="none","spotlight blocks controls")
                        assert_page(card.evaluate("(e)=>{const s=getComputedStyle(e,'::after');return s.maskImage.includes('linear-gradient') && /exclude|xor/.test(s.maskComposite+' '+s.webkitMaskComposite)}"),"border mask is missing")
                        page.locator(".service-bento").screenshot(path=str(OUT/"spotlight-desktop.png"),animations="disabled")
                        page.mouse.move(1,1)
                    if width==1440:
                        connector=page.locator("[data-pinned-approach] .pinned-connector path")
                        assert_page(connector.evaluate("(e)=>e.getTotalLength()>0"),"pinned connector geometry")
                        assert_page(connector.evaluate("(e)=>getComputedStyle(e).animationName")=="pinned-connector-motion","animated dashed connector")
                        dash=connector.evaluate("(e)=>getComputedStyle(e).strokeDashoffset")
                        page.wait_for_function("({e,dash})=>getComputedStyle(e).strokeDashoffset!==dash",arg={"e":connector.element_handle(),"dash":dash},timeout=2500)
                    # Test the actual spring, including interruption, and navigation to another page.
                    page.evaluate("window.scrollTo({top:0,behavior:'instant'})")
                    bar=page.locator("#nav .lgt-track")
                    lens=bar.locator(".lgt-lens")
                    before=lens.evaluate("(e)=>e.getBoundingClientRect().left")
                    bar.locator("button.mega-toggle").click()
                    page.wait_for_function("(before)=>Math.abs(document.querySelector('.lgt-lens').getBoundingClientRect().left-before)>15",arg=before,timeout=2500)
                    page.keyboard.press("Escape")
                    page.wait_for_function("(before)=>Math.abs(document.querySelector('.lgt-lens').getBoundingClientRect().left-before)<2",arg=before,timeout=2500)
                    bar.locator('a[href$="/catalog/"]').click()
                    page.wait_for_url(base+"catalog/",timeout=10000)
                    assert_page(page.locator("#nav .lgt-item.lgt-on").get_attribute("aria-label")=="Услуги","selected tab on destination")
                    page.go_back(wait_until="load")
                    page.locator("#nav .lgt-item.lgt-on").wait_for(state="visible")
                    assert_page(page.locator("#nav .lgt-item.lgt-on").get_attribute("aria-label")=="Главная","selected tab after browser back")
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
