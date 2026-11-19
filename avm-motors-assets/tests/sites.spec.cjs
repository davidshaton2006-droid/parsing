const {test,expect}=require('@playwright/test');
for(const slug of ['avm-motors-red','avm-motors-heritage']){
  test.describe(slug,()=>{
    test('main sections, facts and 20 services',async({page})=>{
      await page.goto('/'+slug+'/',{waitUntil:'domcontentloaded'});
      await expect(page.locator('h1')).toBeVisible();
      await expect(page.locator('[data-services] [data-cat]')).toHaveCount(20);
      await expect(page.locator('[data-photo]')).toHaveCount(8);
      await expect(page.locator('a[href="tel:+79284112315"]:visible').first()).toBeVisible();
      await expect(page.locator('[data-modal]')).toBeHidden();
      const width=await page.evaluate(()=>({doc:document.documentElement.scrollWidth,win:innerWidth}));
      expect(width.doc).toBeLessThanOrEqual(width.win+2);
    });
    test('filter, search and reset',async({page})=>{
      await page.goto('/'+slug+'/',{waitUntil:'domcontentloaded'});
      await page.locator('[data-filter="care"]').click();
      await expect(page.locator('[data-services] [data-cat]:visible')).not.toHaveCount(20);
      await page.locator('[data-filter="all"]').click();
      await page.locator('[data-search]').fill('DSG');
      await expect(page.locator('[data-services] [data-cat]:visible')).toHaveCount(1);
      await page.locator('[data-search]').fill('');
      await expect(page.locator('[data-services] [data-cat]:visible')).toHaveCount(20);
    });
    test('diagnostic guidance and transparent draft-only form',async({page})=>{
      await page.goto('/'+slug+'/',{waitUntil:'domcontentloaded'});
      await page.locator('[data-symptom="engine"]').click();
      await expect(page.locator('[data-symptom-result]')).toContainText('Двигатель');
      await page.locator('[data-symptom-result] button').click();
      await expect(page.locator('[data-modal]')).toBeVisible();
      await page.locator('[data-name]').fill('Тест');
      await page.locator('[data-car]').fill('Skoda Octavia');
      await page.locator('[data-form] input[type=checkbox]').check();
      await page.locator('[data-form] button[type=submit]').click();
      await expect(page.locator('[data-form-feedback]')).not.toBeEmpty();
      await page.keyboard.press('Escape');
      await expect(page.locator('[data-modal]')).toBeHidden();
    });
    test('gallery lightbox and carousel controls',async({page})=>{
      await page.goto('/'+slug+'/',{waitUntil:'domcontentloaded'});
      await page.locator('[data-photo]').first().click();
      await expect(page.locator('[data-lightbox]')).toBeVisible();
      await page.locator('[data-lightbox-next]').click();
      await expect(page.locator('[data-lightbox-caption]')).toContainText('2 / 8');
      await page.keyboard.press('Escape');
      await expect(page.locator('[data-lightbox]')).toBeHidden();
    });
    test('responsive menu and anchor navigation',async({page},testInfo)=>{
      await page.goto('/'+slug+'/',{waitUntil:'domcontentloaded'});
      if(testInfo.project.name==='mobile-chromium'){
        await page.locator('[data-menu]').click();
        await expect(page.locator('[data-menu]')).toHaveAttribute('aria-expanded','true');
      }
      await page.locator('[data-nav] a[href="#services"]').click();
      await expect(page).toHaveURL(/#services$/);
      if(testInfo.project.name==='mobile-chromium')await expect(page.locator('[data-menu]')).toHaveAttribute('aria-expanded','false');
    });
  });
}
test('core HTML works without JavaScript',async({browser})=>{
  const page=await browser.newPage({javaScriptEnabled:false,viewport:{width:390,height:844}});
  for(const slug of ['avm-motors-red','avm-motors-heritage']){
    await page.goto('http://127.0.0.1:4179/'+slug+'/',{waitUntil:'domcontentloaded'});
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('[data-services] [data-cat]')).toHaveCount(20);
  }
  await page.close();
});
