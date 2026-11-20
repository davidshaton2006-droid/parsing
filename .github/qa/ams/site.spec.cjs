const {test,expect}=require('@playwright/test');
test.describe('AMS Studio premium design',()=>{
 test('business facts, full content and responsive layouts',async({page},testInfo)=>{
   const errors=[];page.on('pageerror',e=>errors.push(e.message));
   await page.goto('/ams-studio/',{waitUntil:'domcontentloaded'});
   await expect(page.locator('h1')).toContainText('ВАШ АВТОМОБИЛЬ');
   await expect(page.locator('.service')).toHaveCount(6);
   await expect(page.locator('.project-card')).toHaveCount(4);
   await expect(page.locator('[data-gallery]')).toHaveCount(6);
   await expect(page.locator('a[href="tel:+79388882122"]:visible').first()).toBeVisible();
   await expect(page.locator('[data-wizard]')).toBeHidden();
   for(const width of [320,360,390,428,768,1024,1440]){
     await page.setViewportSize({width,height:900});
     const v=await page.evaluate(()=>({scroll:document.documentElement.scrollWidth,win:innerWidth}));
     if(v.scroll>v.win+3){const offenders=await page.evaluate(()=>[...document.querySelectorAll('body *')].filter(el=>{const cs=getComputedStyle(el),r=el.getBoundingClientRect();return cs.display!=='none'&&r.width>0&&r.right>innerWidth+3}).slice(0,10).map(el=>({tag:el.tagName,cls:el.className?.baseVal||el.className,text:(el.textContent||'').slice(0,45),right:Math.round(el.getBoundingClientRect().right)})));throw new Error('horizontal overflow at '+width+' '+v.scroll+' '+JSON.stringify(offenders));}
   }
   expect(errors).toEqual([]);
   await page.setViewportSize(testInfo.project.use.viewport);
   await page.screenshot({path:'test-results/ams-'+testInfo.project.name+'-full.png',fullPage:true});
 });
 test('category filter and reset',async({page})=>{
   await page.goto('/ams-studio/');
   await page.locator('[data-filter="media"]').click();
   await expect(page.locator('.service:visible')).toHaveCount(2);
   await page.locator('[data-filter="camera"]').click();
   await expect(page.locator('.service:visible')).toHaveCount(1);
   await page.locator('[data-filter="all"]').click();
   await expect(page.locator('.service:visible')).toHaveCount(6);
 });
 test('wizard validates, builds safe draft and supports restart',async({page})=>{
   await page.goto('/ams-studio/');
   await page.locator('.hero [data-start]').click();
   await expect(page.locator('[data-wizard]')).toBeVisible();
   await page.locator('[data-next]').click();
   await expect(page.locator('[data-step="1"]')).toBeVisible();
   await page.locator('[data-next]').click();
   await expect(page.locator('[data-error]')).toContainText('марку');
   await page.locator('[data-brand]').fill('Mercedes-Benz');
   await page.locator('[data-model]').fill('C200');
   await page.locator('[data-next]').click();
   await expect(page.locator('[data-step="2"]')).toBeVisible();
   await page.locator('[data-next]').click();
   await expect(page.locator('[data-error]')).toContainText('восемью');
   await page.locator('[data-details]').fill('Нужен круговой обзор с сохранением штатного экрана.');
   await page.locator('[data-next]').click();
   await expect(page.locator('[data-step="3"]')).toBeVisible();
   await page.locator('[data-name]').fill('Клиент');
   await page.locator('[data-submit]').click();
   await expect(page.locator('[data-finish]')).toBeVisible();
   await expect(page.locator('[data-copy-preview]')).toHaveValue(/Mercedes-Benz, C200/);
   await expect(page.locator('[data-copy-preview]')).toHaveValue(/Круговой обзор|круговой обзор/);
   await page.locator('[data-copy]').click();
   await expect(page.locator('[data-feedback]')).not.toBeEmpty();
   await page.locator('[data-restart]').click();
   await expect(page.locator('[data-step="0"]')).toBeVisible();
   await page.keyboard.press('Escape');
   await expect(page.locator('[data-wizard]')).toBeHidden();
 });
 test('service CTA selects correct category',async({page})=>{
   await page.goto('/ams-studio/');
   await page.locator('.service').nth(1).locator('[data-start]').click();
   await expect(page.locator('[data-wizard]')).toBeVisible();
   await expect(page.locator('input[name="service"]:checked')).toHaveValue('Камеры и круговой обзор');
 });
 test('gallery lightbox navigation',async({page})=>{
   await page.goto('/ams-studio/');
   await page.locator('[data-gallery]').first().click();
   await expect(page.locator('[data-lightbox]')).toBeVisible();
   await page.locator('[data-lightnext]').click();
   await expect(page.locator('[data-lightcount]')).toHaveText('02 / 06');
   await page.keyboard.press('ArrowLeft');
   await expect(page.locator('[data-lightcount]')).toHaveText('01 / 06');
   await page.keyboard.press('Escape');
   await expect(page.locator('[data-lightbox]')).toBeHidden();
 });
 test('responsive navigation and verified contacts',async({page},info)=>{
   await page.goto('/ams-studio/');
   if(info.project.name==='mobile'){
     await page.locator('[data-toggle]').click();
     await expect(page.locator('[data-toggle]')).toHaveAttribute('aria-expanded','true');
   }
   await page.locator('[data-nav] a[href="#projects"]').click();
   await expect(page).toHaveURL(/#projects$/);
   if(info.project.name==='mobile')await expect(page.locator('[data-toggle]')).toHaveAttribute('aria-expanded','false');
   await expect(page.locator('a[href="mailto:powerlab.krd@gmail.com"]')).toHaveCount(1);
 });
 test('essential company details accessible without JS',async({browser})=>{
   const page=await browser.newPage({javaScriptEnabled:false,viewport:{width:390,height:844}});
   await page.goto('http://127.0.0.1:4181/ams-studio/');
   await expect(page.locator('h1')).toBeVisible();
   await expect(page.locator('.service')).toHaveCount(6);
   await expect(page.locator('.project-card')).toHaveCount(4);
   await page.close();
 });
});