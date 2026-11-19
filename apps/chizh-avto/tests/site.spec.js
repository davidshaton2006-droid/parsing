import {test,expect} from '@playwright/test';
const root='/parsing/chizh-avto/';
async function route(page,path='/'){await page.goto(root+'#'+path,{waitUntil:'domcontentloaded'});await expect(page.locator('main')).toBeVisible()}

test('Approved showroom concept: authentic hero, actual brand and no filler ticker',async({page})=>{
 await route(page);
 await expect(page.getByRole('heading',{level:1})).toContainText('ДООСНАЩЕНИЕ');
 await expect(page.locator('.sv5-header')).toBeVisible();
 await expect(page.locator('.sv5-services')).toBeVisible();
 await expect(page.locator('.sv5-service-card')).toHaveCount(10);
 await expect(page.locator('.ticker,.scroll-progress,.marquee')).toHaveCount(0);
 const hero=page.locator('.sv5-hero-media img').first();
 await expect(hero).toHaveAttribute('loading','eager');
 await expect(hero).toHaveAttribute('fetchpriority','high');
 await expect.poll(()=>hero.evaluate(n=>n.naturalWidth),{timeout:15000}).toBeGreaterThan(0);
 await expect(page.locator('.sv5-nav a')).toHaveCount(6);
});

test('Hero gallery, service carousel and deep-linked category are functional',async({page})=>{
 await route(page);
 await page.locator('.sv5-hero-dots button').nth(1).evaluate(n=>n.click());
 await expect(page.locator('.sv5-hero-dots button').nth(1)).toHaveAttribute('aria-pressed','true');
 await page.locator('.sv5-services').scrollIntoViewIfNeeded();
 await expect(page.locator('.sv5-service-card').first()).toBeVisible();
 await page.locator('.sv5-service-card').first().click();
 await expect(page.locator('.sc-service-detail')).toContainText('Мультимедиа');
 await page.getByRole('searchbox',{name:'Поиск по услугам'}).fill('автосвет');
 await expect(page.locator('.sc-service-row')).toHaveCount(1);
});

test('Projects filter, project detail and photography comparison work',async({page},testInfo)=>{
 await route(page);
 await page.locator('.sv5-projects').scrollIntoViewIfNeeded();
 const filter=page.getByRole('group',{name:'Фильтр проектов'});
 await filter.getByRole('button',{name:'Мультимедиа'}).click();
 await expect(filter.getByRole('button',{name:'Мультимедиа'})).toHaveAttribute('aria-pressed','true');
 await page.locator('.sv5-project-lead').click();
 await expect(page.getByRole('dialog')).toBeVisible();
 await page.keyboard.press('Escape');
 await expect(page.getByRole('dialog')).toHaveCount(0);
 if(testInfo.project.name.includes('desktop')){
  const slider=page.getByRole('slider',{name:/Сравнить два кадра/});
  await slider.fill('70');
  await expect(slider).toHaveValue('70');
 }
});

test('Video is on-demand, not a heavy iframe on first load',async({page})=>{
 await route(page);
 await expect(page.locator('iframe[src*="youtube.com"]')).toHaveCount(0);
 await page.getByRole('button',{name:/Смотреть видео.*Чиж-Авто/}).click();
 await expect(page.getByRole('dialog')).toBeVisible();
 await expect(page.locator('iframe[src*="youtube.com"]')).toHaveCount(1);
 await page.getByRole('button',{name:'Закрыть видео'}).click();
 await expect(page.getByRole('dialog')).toHaveCount(0);
});

test('Preferred date and time reach contact request, never confirm a reservation',async({page})=>{
 await route(page);
 await page.locator('.sv5-booking').scrollIntoViewIfNeeded();
 await page.getByLabel('Желаемая дата').fill('2027-01-19');
 await page.getByLabel('Желаемое время').selectOption('14:00');
 await page.getByRole('link',{name:/Подготовить запрос/}).click();
 await expect(page.getByRole('heading',{level:1})).toContainText('Приезжайте в Чиж-Авто');
 await expect(page.locator('.sc-contact-form input[type="date"]')).toHaveValue('2027-01-19');
 await expect(page.locator('.sc-contact-form select').last()).toHaveValue('14:00');
 await expect(page.locator('.sc-contact-form')).toContainText('не создаёт запись');
});

test('Full catalog, prices, official portfolio, offers and phone are preserved',async({page})=>{
 await route(page,'/services');await expect(page.locator('.sc-service-row')).toHaveCount(12);
 await route(page,'/projects');await expect(page.locator('.sc-work-tile').first()).toBeVisible();
 await route(page,'/prices');await expect(page.locator('.sc-price-row').first()).toBeVisible();
 await route(page,'/offers');await expect(page.locator('.sc-offer')).toHaveCount(3);
 await route(page,'/contacts');await expect(page.locator('a[href^="tel:"]').first()).toHaveAttribute('href',/79891990022/);
});

test('Mobile navigation is usable and page has no horizontal overflow',async({page},testInfo)=>{
 await route(page);
 if(testInfo.project.name.includes('mobile')){
  await page.getByRole('button',{name:'Открыть меню'}).click();
  await expect(page.locator('.sv5-nav')).toHaveClass(/sv5-nav-open/);
  await page.locator('.sv5-nav').getByRole('link',{name:'Контакты'}).click();
  await expect(page.getByRole('heading',{level:1})).toContainText('Приезжайте в Чиж-Авто');
  await expect(page.locator('.sv5-mobile-bottom')).toBeVisible();
 }
 const overflow=await page.evaluate(()=>document.documentElement.scrollWidth-window.innerWidth);
 expect(overflow).toBeLessThanOrEqual(2);
});

test('Review real screenshot of concept 5 across breakpoints',async({page},testInfo)=>{
 await route(page);
 await expect.poll(()=>page.locator('.sv5-hero-media img').first().evaluate(n=>n.naturalWidth),{timeout:15000}).toBeGreaterThan(0);
 // Walk viewport to trigger lazy images before taking the full document screenshot.
 await page.evaluate(async()=>{const items=[...document.querySelectorAll('.sv5-services,.sv5-projects,.sv5-booking,.sv5-contact-preview')];for(const item of items){item.scrollIntoView({block:'center'});await new Promise(r=>setTimeout(r,350))}window.scrollTo(0,0)});
 await page.waitForTimeout(700);
 await page.screenshot({path:testInfo.outputPath('showroom-home-full.png'),fullPage:true,animations:'disabled'});
 await page.locator('.sv5-projects').scrollIntoViewIfNeeded();
 await page.screenshot({path:testInfo.outputPath('showroom-projects.png'),animations:'disabled'});
});


test('Prices: labeled values, car class control, search, and no header rows passed as services',async({page},testInfo)=>{
 await route(page,'/prices');
 await expect(page.getByRole('heading',{level:1})).toContainText('Цены на услуги');
 await expect(page.locator('.sv5-price-entry').first()).toBeVisible();
 await expect(page.locator('.sv5-price-entry').first().locator('.sv5-price-value strong').first()).not.toBeEmpty();
 await expect(page.getByLabel('Класс автомобиля для отображения стоимости')).toBeVisible();
 await expect(page.locator('.sv5-price-entry h2',{hasText:/^(Услуга|Стоимость)$/i})).toHaveCount(0);
 await page.getByLabel('Класс автомобиля для отображения стоимости').selectOption('1');
 await page.getByLabel('Класс автомобиля для отображения стоимости').selectOption('all');
 await page.getByRole('searchbox',{name:'Поиск по прайс-листу'}).fill('откровенно_несуществующая_позиция_34982');
 await expect(page.locator('.sv5-price-entry')).toHaveCount(0);
 await page.getByRole('button',{name:'Очистить поиск'}).click();
 await expect(page.locator('.sv5-price-entry').first()).toBeVisible();
 await page.evaluate(()=>window.scrollTo(0,0));
 await page.screenshot({path:testInfo.outputPath('prices-page.png'),fullPage:true,animations:'disabled'});
});

test('Contacts: both branches, route, same verified phone, and inquiry',async({page},testInfo)=>{
 await route(page,'/contacts');
 const cards=page.getByRole('group',{name:'Выбор филиала Чиж-Авто'});
 await expect(cards.getByRole('button')).toHaveCount(2);
 await expect(cards.getByRole('button').nth(0)).toHaveAttribute('aria-pressed','true');
 await cards.getByRole('button').nth(1).click();
 await expect(cards.getByRole('button').nth(1)).toHaveAttribute('aria-pressed','true');
 await expect(page.locator('.sv5-office-address-line')).toContainText('Каляева, 89');
 await expect(page.getByRole('link',{name:/Построить маршрут/})).toHaveAttribute('href',/Каляева|%D0%9A%D0%B0%D0%BB%D1%8F%D0%B5%D0%B2%D0%B0/i);
 await expect(page.getByLabel('Предпочтительный филиал')).toHaveValue('kalyaeva');
 await page.getByLabel('Предпочтительный филиал').selectOption('zhloby');
 await expect(cards.getByRole('button').nth(0)).toHaveAttribute('aria-pressed','true');
 await page.getByRole('button',{name:/Показать карту/}).click();
 await expect(page.locator('.sv5-office-map iframe')).toHaveAttribute('src',/oid=1266081535/);
 await expect(page.locator('.sv5-office-links a[href^="tel:"]')).toHaveAttribute('href','tel:+79891990022');
 await page.getByPlaceholder('Ваше имя').fill('Тестовый посетитель');
 await page.getByPlaceholder('+7 (999) 000-00-00').fill('+7 999 111-22-33');
 await page.getByRole('button',{name:/Скопировать текст/}).click();
 await expect(page.locator('.sc-form-status')).not.toBeEmpty();
 await page.evaluate(()=>window.scrollTo(0,0));
 await page.screenshot({path:testInfo.outputPath('contacts-page.png'),fullPage:true,animations:'disabled'});
 const overflow=await page.evaluate(()=>document.documentElement.scrollWidth-window.innerWidth);
 expect(overflow).toBeLessThanOrEqual(2);
});
