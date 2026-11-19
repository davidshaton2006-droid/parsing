import {test,expect} from '@playwright/test';
async function visit(page,section=''){
 await page.goto('/parsing/doctor-car/'+(section?'#'+section:''));
 await expect(page.locator('#root .app')).toBeVisible();
}
test('Hero, authentic business address, technical interactive blueprint',async({page})=>{
 await visit(page);
 await expect(page.getByRole('heading',{level:1})).toContainText('Ремонт начинается');
 await expect(page.locator('.blueprint')).toBeVisible();
 await page.getByRole('button',{name:'Показать: Двигатель'}).click();
 await expect(page.locator('.system-card h3')).toContainText('Двигатель');
 await expect(page.locator('.hero-meta')).toContainText('Жлобы, 24');
});
test('Theme switch toggles whole scheme and persists after reload',async({page})=>{
 await visit(page);
 await page.locator('.theme-toggle').click();
 await expect(page.locator('html')).toHaveAttribute('data-theme','light');
 const light=await page.locator('body').evaluate(el=>getComputedStyle(el).backgroundColor);
 await page.reload();
 await expect(page.locator('html')).toHaveAttribute('data-theme','light');
 await page.locator('.theme-toggle').click();
 await expect(page.locator('html')).toHaveAttribute('data-theme','dark');
 const dark=await page.locator('body').evaluate(el=>getComputedStyle(el).backgroundColor);
 expect(light).not.toEqual(dark);
});
test('Services search and category controls actually work',async({page})=>{
 await visit(page,'/services');
 await expect(page.getByRole('heading',{level:1})).toContainText('По нужной системе');
 await expect(page.locator('.services-grid .service-card')).toHaveCount(8);
 await page.getByRole('searchbox',{name:'Поиск услуг'}).fill('ГРМ');
 await expect(page.locator('.services-grid .service-card')).toHaveCount(1);
 await expect(page.locator('.services-grid .service-card')).toContainText('Двигатель');
 await page.getByRole('searchbox',{name:'Поиск услуг'}).fill('');
 await page.getByRole('button',{name:'Обслуживание',exact:true}).click();
 await expect(page.locator('.services-grid .service-card')).toHaveCount(2);
});
test('Symptom guide provides feedback and opens inquiry',async({page})=>{
 await visit(page);
 await page.getByRole('button',{name:/Двигатель не заводится/}).click();
 await expect(page.locator('.symptom-result h3')).toContainText('Нужна диагностика');
 await page.locator('.symptom-result .btn').click();
 await expect(page.getByRole('dialog')).toBeVisible();
 await page.getByRole('button',{name:'Закрыть окно'}).click();
 await expect(page.getByRole('dialog')).toHaveCount(0);
});
test('Contact map is lazy with direct route fallback',async({page})=>{
 await visit(page,'/contact');
 await expect(page.locator('.map-shell iframe')).toHaveCount(0);
 await page.getByRole('button',{name:/Показать карту/}).click();
 await expect(page.locator('.map-shell iframe')).toHaveAttribute('src',/114732639406/);
 await expect(page.locator('.map-link')).toHaveAttribute('href',/yandex.ru\/maps\/org\/doktor_kar/);
});
test('Inquiry form never fakes booking and allows copy/call',async({page})=>{
 await visit(page);
 await page.getByRole('button',{name:/Обсудить неисправность/}).click();
 const modal=page.getByRole('dialog');
 await expect(modal).toBeVisible();
 await modal.getByPlaceholder('Как к вам обращаться').fill('Тест');
 await modal.getByPlaceholder('+7 999 000-00-00').fill('+7 999 123-45-67');
 await modal.getByRole('button',{name:/Скопировать текст обращения/}).click();
 await expect(modal.locator('.form-result')).not.toBeEmpty();
 await expect(modal).toContainText('не отправляет');
 await page.keyboard.press('Escape');
 await expect(modal).toHaveCount(0);
});
test('No horizontal overflow desktop/tablet/mobile',async({page})=>{
 await visit(page);
 for(const width of [320,375,390,768,1024,1440]){
  await page.setViewportSize({width,height:840});
  const overflow=await page.evaluate(()=>document.documentElement.scrollWidth-window.innerWidth);
  expect(overflow,'overflow at '+width).toBeLessThanOrEqual(3);
 }
});

test('Design QA: screenshot matching dark/light for desktop and mobile',async({page},testInfo)=>{
 await visit(page);
 await page.screenshot({path:testInfo.outputPath('homepage-dark.png'),fullPage:true,animations:'disabled'});
 await page.locator('.theme-toggle').click();
 await expect(page.locator('html')).toHaveAttribute('data-theme','light');
 await page.screenshot({path:testInfo.outputPath('homepage-light.png'),fullPage:true,animations:'disabled'});
 await visit(page,'/services');
 await page.screenshot({path:testInfo.outputPath('services.png'),fullPage:true,animations:'disabled'});
 await visit(page,'/contact');
 await page.screenshot({path:testInfo.outputPath('contacts.png'),fullPage:true,animations:'disabled'});
});
