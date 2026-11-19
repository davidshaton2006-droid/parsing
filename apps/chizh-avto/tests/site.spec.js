import {test,expect} from '@playwright/test';
const home='/parsing/chizh-avto/';
async function route(page,path){await page.goto(home+'#'+path,{waitUntil:'domcontentloaded'});await expect(page.locator('main')).toBeVisible()}

test('Editorial home, authentic images and functional navigation',async({page})=>{
 await route(page,'/');
 await expect(page.getByRole('heading',{level:1})).toContainText('комплектация');
 await expect(page.locator('.sc-nav a')).toHaveCount(6);
 await expect(page.locator('.ticker,.scroll-progress,.marquee')).toHaveCount(0);
 const hero=page.locator('.sc-hero-photo');
 await expect(hero).toHaveAttribute('loading','eager');
 await expect(hero).toHaveAttribute('fetchpriority','high');
 await expect.poll(()=>hero.evaluate(img=>img.naturalWidth),{timeout:12000}).toBeGreaterThan(0);
});

test('Service index is interactive, search and inquiry routing work',async({page})=>{
 await route(page,'/services');
 const search=page.getByRole('searchbox',{name:'Поиск по услугам'});
 await search.fill('автосвет');
 await expect(page.locator('.sc-service-row')).toHaveCount(1);
 await page.locator('.sc-service-row').click();
 await expect(page.locator('.sc-service-detail')).toContainText('Автосвет');
 await page.getByRole('link',{name:/Обсудить услугу/}).click();
 await expect(page.locator('.sc-contact-form select')).toHaveValue('Автосвет');
});

test('Portfolio search and dialog opening/closing',async({page})=>{
 await route(page,'/projects');
 await expect(page.locator('.sc-work-tile').first()).toBeVisible();
 await page.locator('.sc-work-tile').first().click();
 await expect(page.getByRole('dialog')).toBeVisible();
 await page.keyboard.press('Escape');
 await expect(page.getByRole('dialog')).toHaveCount(0);
 const search=page.getByRole('searchbox',{name:'Поиск по проектам'});
 await search.fill('несуществующая-работа-392');
 await expect(page.locator('.sc-empty')).toBeVisible();
 await page.getByRole('button',{name:'Показать все проекты'}).click();
 await expect(page.locator('.sc-work-tile').first()).toBeVisible();
});

test('Price search, offer links and company pages',async({page})=>{
 await route(page,'/prices');
 await expect(page.locator('.sc-price-row').first()).toBeVisible();
 await page.getByRole('searchbox',{name:'Поиск по прайс-листу'}).fill('несуществующая-392');
 await expect(page.locator('.sc-empty')).toBeVisible();
 await page.getByRole('button',{name:'Сбросить поиск'}).click();
 await expect(page.locator('.sc-price-row').first()).toBeVisible();
 await route(page,'/offers');
 await expect(page.locator('.sc-offer')).toHaveCount(3);
 await route(page,'/about');
 await expect(page.getByRole('heading',{level:1})).toContainText('Мастерская');
});

test('Contact form, phone, mail and map are functional and honest',async({page})=>{
 await route(page,'/contacts');
 await expect(page.locator('a[href^="tel:"]').first()).toHaveAttribute('href',/79891990022/);
 await expect(page.locator('.sc-map iframe')).toHaveAttribute('loading','lazy');
 await page.locator('.sc-contact-form input').nth(0).fill('Алексей');
 await page.locator('.sc-contact-form input').nth(1).fill('+79890001122');
 await page.getByRole('button',{name:/Скопировать текст/}).click();
 await expect(page.getByRole('status')).toContainText(/скопирован|удалось/);
 await expect(page.locator('.sc-contact-form')).toContainText('не создаёт запись');
});

test('Official video only loads on explicit request',async({page})=>{
 await route(page,'/');
 await expect(page.locator('iframe[src*="youtube.com"]')).toHaveCount(0);
 await page.getByRole('button',{name:/Смотреть видео/}).click();
 await expect(page.getByRole('dialog')).toBeVisible();
 await expect(page.locator('iframe[src*="youtube.com"]')).toHaveCount(1);
 await page.keyboard.press('Escape');
 await expect(page.getByRole('dialog')).toHaveCount(0);
});

test('Responsive navigation and no overflow',async({page},testInfo)=>{
 await route(page,'/');
 if(testInfo.project.name.includes('mobile')){
  await page.getByRole('button',{name:'Открыть меню'}).click();
  await expect(page.locator('.sc-nav')).toHaveClass(/open/);
  await page.locator('.sc-nav').getByRole('link',{name:'Контакты'}).click();
  await expect(page.getByRole('heading',{level:1})).toContainText('Есть задача');
 }
 expect(await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth)).toBeLessThanOrEqual(2);
});

test('Capture the actual production design for visual QA',async({page},testInfo)=>{
 await route(page,'/');
 await expect.poll(()=>page.locator('.sc-hero-photo').evaluate(img=>img.naturalWidth),{timeout:10000}).toBeGreaterThan(0);
 await page.screenshot({path:testInfo.outputPath('home-full.png'),fullPage:true,animations:'disabled'});
 await route(page,'/services');
 await page.screenshot({path:testInfo.outputPath('services.png'),fullPage:false,animations:'disabled'});
});