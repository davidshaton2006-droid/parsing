const {test,expect}=require('@playwright/test');
const slug='/avm-motors-red/';
test.describe('AVM Motors — flagship redline redesign',()=>{
  test('content, original imagery and responsive geometry',async({page},info)=>{
    const errors=[];page.on('pageerror',e=>errors.push(e.message));
    await page.goto(slug,{waitUntil:'domcontentloaded'});
    await expect(page.locator('.hero h1')).toContainText('НЕТ МЕЛОЧЕЙ');
    await expect(page.locator('[data-services] [data-cat]')).toHaveCount(20);
    await expect(page.locator('[data-photo]')).toHaveCount(4);
    await expect(page.locator('[data-progress]')).toHaveCount(0);
    await expect(page.locator('.hero img')).toHaveCount(2);
    await expect(page.locator('a[href^="tel:"]:visible').first()).toBeVisible();
    for(const width of [320,360,390,428,768,1024,1440,1920]){
      await page.setViewportSize({width,height:900});
      await page.waitForTimeout(70);
      const widths=await page.evaluate(()=>{
        const s=document.documentElement,h=document.querySelector('.hero h1'),box=h.getBoundingClientRect();
        return {scroll:s.scrollWidth,inner:innerWidth,headlineRight:box.right,headlineLeft:box.left};
      });
      expect(widths.scroll,'horizontal overflow at '+width).toBeLessThanOrEqual(width+3);
      expect(widths.headlineRight,'headline cut off at '+width).toBeLessThanOrEqual(width+3);
      expect(widths.headlineLeft,'headline starts offscreen at '+width).toBeGreaterThanOrEqual(-3);
    }
    expect(errors).toEqual([]);
    await page.setViewportSize(info.project.use.viewport);
    await page.screenshot({path:'test-results/previews/'+info.project.name+'-hero.png'});
    await page.screenshot({path:'test-results/previews/'+info.project.name+'-full.png',fullPage:true});
  });
  test('service filters, text search, preview and CTA',async({page})=>{
    await page.goto(slug);
    await page.locator('[data-filter="trans"]').click();
    await expect(page.locator('[data-services] .service-row:visible')).toHaveCount(1);
    await page.locator('[data-filter="all"]').click();
    await page.locator('[data-search]').fill('Сход-развал 3D');
    await expect(page.locator('[data-services] .service-row:visible')).toHaveCount(1);
    await page.locator('[data-search]').fill('');
    await expect(page.locator('[data-services] .service-row:visible')).toHaveCount(20);
    const first=page.locator('[data-services] .service-row').first();
    await first.hover();
    await expect(page.locator('[data-preview-title]')).toContainText('Компьютерная диагностика');
    await first.locator('[data-open-form]').click();
    await expect(page.locator('[data-wizard]')).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(page.locator('[data-wizard]')).toBeHidden();
  });
  test('four-step inquiry, inline validation, copy outcome and restart',async({page})=>{
    await page.goto(slug);
    await page.locator('.hero [data-open-form]').click();
    await expect(page.locator('[data-wizard]')).toBeVisible();
    await page.locator('[data-next]').click();
    await expect(page.locator('[data-step="1"]')).toBeVisible();
    await page.locator('[data-next]').click();
    await expect(page.locator('[data-error]')).toContainText('марку');
    await page.locator('[data-brand="Audi"]').click();
    await page.locator('[data-car]').fill('A4');
    await page.locator('[data-next]').click();
    await expect(page.locator('[data-step="2"]')).toBeVisible();
    await page.locator('[data-next]').click();
    await expect(page.locator('[data-error]')).toContainText('8 символов');
    await page.locator('[data-message]').fill('Слышен стук при повороте направо, хочу диагностику.');
    await page.locator('[data-next]').click();
    await expect(page.locator('[data-step="3"]')).toBeVisible();
    await page.locator('[data-name]').fill('Тестовый клиент');
    await expect(page.locator('[data-summary]')).toContainText('Audi');
    await page.locator('[data-submit]').click();
    await expect(page.locator('[data-finish]')).toBeVisible();
    await expect(page.locator('[data-copy-preview]')).toHaveValue(/Audi, A4/);
    await page.locator('[data-copy]').click();
    await expect(page.locator('[data-feedback]')).not.toBeEmpty();
    await page.locator('[data-restart]').click();
    await expect(page.locator('[data-step="0"]')).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(page.locator('[data-wizard]')).toBeHidden();
  });
  test('intent chip preselects service in inquiry',async({page})=>{
    await page.goto(slug);
    await page.locator('[data-intent="trans"]').click();
    await expect(page.locator('[data-wizard]')).toBeVisible();
    await expect(page.locator('[data-service-choice]')).toHaveValue(/DSG/);
  });
  test('search command Ctrl+K and escape',async({page})=>{
    await page.goto(slug);
    await page.keyboard.press('Control+k');
    await expect(page.locator('[data-search-dialog]')).toBeVisible();
    await page.locator('[data-command-input]').fill('DSG');
    await expect(page.locator('.result-button')).toHaveCount(1);
    await page.locator('.result-button').click();
    await expect(page.locator('[data-search-dialog]')).toBeHidden();
    await expect(page.locator('[data-wizard]')).toBeVisible();
    await expect(page.locator('[data-service-choice]')).toHaveValue(/DSG/);
    await page.keyboard.press('Escape');
  });
  test('photo lightbox, next, previous, keyboard and close',async({page})=>{
    await page.goto(slug);
    await page.locator('[data-photo]').first().click();
    await expect(page.locator('[data-lightbox]')).toBeVisible();
    await page.locator('[data-lightbox-next]').click();
    await expect(page.locator('[data-lightbox-count]')).toContainText('02 / 04');
    await page.keyboard.press('ArrowLeft');
    await expect(page.locator('[data-lightbox-count]')).toContainText('01 / 04');
    await page.keyboard.press('Escape');
    await expect(page.locator('[data-lightbox]')).toBeHidden();
  });
  test('nav and real map/phone links',async({page},info)=>{
    await page.goto(slug);
    if(info.project.name.includes('mobile')){
      await page.locator('[data-menu]').click();
      await expect(page.locator('[data-menu]')).toHaveAttribute('aria-expanded','true');
    }
    await page.locator('[data-nav] a[href="#services"]').click();
    await expect(page).toHaveURL(/#services$/);
    if(info.project.name.includes('mobile')) await expect(page.locator('[data-menu]')).toHaveAttribute('aria-expanded','false');
    expect(await page.locator('iframe[src*="yandex.ru/map-widget"]').count()).toBe(1);
  });
  test('essential business data accessible without JavaScript',async({browser})=>{
    const page=await browser.newPage({javaScriptEnabled:false,viewport:{width:390,height:844}});
    await page.goto('http://127.0.0.1:4179/avm-motors-red/');
    await expect(page.locator('.hero h1')).toBeVisible();
    await expect(page.locator('[data-services] .service-row')).toHaveCount(20);
    await expect(page.locator('[data-photo]')).toHaveCount(4);
    await page.close();
  });
});
