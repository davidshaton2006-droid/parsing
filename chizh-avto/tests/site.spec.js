import {test,expect} from '@playwright/test';
const home='/parsing/chizh-avto/';
async function route(page,path){await page.goto(home+'#'+path,{waitUntil:'domcontentloaded'});await expect(page.locator('main')).toBeVisible()}
test('Navigation, official imagery, complete core menu and no filler strips',async({page})=>{
  await route(page,'/');
  await expect(page.getByRole('heading',{level:1})).toContainText('Ваш автомобиль');
  await expect(page.locator('.hero-photo img')).toHaveAttribute('src',/chizhavto\.ru/);
  await expect(page.locator('.ticker,.scroll-progress,.marquee')).toHaveCount(0);
  await expect(page.locator('.site-nav a')).toHaveCount(6);
  await expect(page.locator('a[href^="tel:"]').first()).toHaveAttribute('href',/79891990022/);
});
test('Directory search, category expansion, official links and prefilled enquiry',async({page})=>{
  await route(page,'/services');
  const search=page.getByRole('searchbox',{name:'Поиск по каталогу услуг'});
  await search.fill('автосвет');
  await expect(page.locator('.directory-item')).toHaveCount(1);
  await page.locator('.directory-item>button').click();
  await expect(page.locator('.directory-expanded')).toBeVisible();
  await expect(page.locator('.directory-expanded a[href^="https://chizhavto.ru/"]').first()).toHaveAttribute('target','_blank');
  await page.getByRole('link',{name:/Уточнить услугу/}).click();
  await expect(page.locator('select')).toHaveValue('Автосвет');
});
test('Search has working reset, gallery modal closes with Escape',async({page})=>{
  await route(page,'/projects');
  const search=page.getByRole('searchbox',{name:'Поиск по проектам'});
  await search.fill('модель-нет-такой-3434');
  await expect(page.locator('.empty-state')).toBeVisible();
  await page.getByRole('button',{name:'Показать все проекты'}).click();
  await expect(page.locator('.project-gallery').first()).toBeVisible();
  await page.locator('.project-gallery').first().click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).toHaveCount(0);
});
test('Price search and reset work',async({page})=>{
  await route(page,'/prices');
  const search=page.getByRole('searchbox',{name:'Поиск по прайс-листу'});
  await search.fill('никакой-такой-услуги-123');
  await expect(page.locator('.empty-state')).toBeVisible();
  await page.getByRole('button',{name:'Сбросить поиск'}).click();
  await expect(page.locator('.price-entry').first()).toBeVisible();
});
test('Enquiry validates data, copy responds and never claims a booking',async({page})=>{
  await route(page,'/contacts');
  const form=page.locator('form').last();
  await form.getByLabel('Ваше имя *').fill('Алексей');
  await form.getByLabel('Номер телефона *').fill('+79890001122');
  await form.getByLabel('Услуга').selectOption({label:'Мультимедиа'});
  await page.getByRole('button',{name:/Скопировать/}).click();
  await expect(page.getByRole('status')).toContainText(/скопирован|не удалось/);
  await expect(page.locator('.footer-disclosure')).toContainText('Запись через форму здесь не подтверждается');
});
test('Video opens, closes, and offers official-channel fallback',async({page})=>{
  await route(page,'/');
  await page.getByRole('button',{name:/Смотреть видео Чиж-Авто/}).click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await expect(page.locator('.video-fallback')).toHaveAttribute('href',/youtube.com/);
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).toHaveCount(0);
});
test('Mobile navigation, all routes, and horizontal overflow',async({page},testInfo)=>{
  await route(page,'/');
  if(testInfo.project.name.includes('mobile')){
    await page.getByRole('button',{name:'Открыть меню'}).click();
    await expect(page.locator('.site-nav')).toHaveClass(/open/);
    await page.locator('.site-nav').getByRole('link',{name:'Контакты'}).click();
    await expect(page.getByRole('heading',{level:1})).toContainText('Приезжайте');
  }
  const overflow=await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth);
  expect(overflow).toBeLessThanOrEqual(2);
});