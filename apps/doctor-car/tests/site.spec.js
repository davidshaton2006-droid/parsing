import {test,expect} from '@playwright/test';
const base='http://127.0.0.1:4175/parsing/doctor-car/';
test('hero and real-service contacts with honest demo attribution',async({page})=>{
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto(base,{waitUntil:'domcontentloaded'});
 await expect(page.getByRole('heading',{level:1})).toContainText('Автосервис');
 await expect(page.getByRole('heading',{level:1})).toContainText('ДОКТОР КАР');
 await expect(page.locator('html')).toHaveAttribute('data-theme','dark');
 await expect(page.getByRole('link',{name:/Карточка организации/})).toHaveAttribute('href',/114732639406/);
 await expect(page.getByRole('link',{name:/Позвонить/}).last()).toHaveAttribute('href','tel:+79586092157');
 await expect(page.locator('.hero-car')).toHaveAttribute('alt',/не фото автосервиса/);
 await expect(page.locator('.float-diagnostics')).toBeVisible();
 expect(errors).toEqual([]);
});
test('theme switch persists and mixed light/dark editorial bands exist',async({page})=>{
 await page.goto(base);
 await expect(page.locator('.band-dark')).not.toHaveCount(0);
 await expect(page.locator('.band-light')).not.toHaveCount(0);
 await page.getByRole('button',{name:'Включить светлую тему'}).click();
 await expect(page.locator('html')).toHaveAttribute('data-theme','light');
 await page.reload();
 await expect(page.locator('html')).toHaveAttribute('data-theme','light');
 await page.getByRole('button',{name:'Включить тёмную тему'}).click();
 await expect(page.locator('html')).toHaveAttribute('data-theme','dark');
});
test('12 distinct auto services, filters, search and inquiry',async({page})=>{
 await page.goto(base);
 await expect(page.locator('.service-card')).toHaveCount(12);
 await expect(page.locator('.service-photo img')).toHaveCount(6);
 await page.locator('.service-filters').getByRole('button',{name:'Двигатель',exact:true}).click();
 await expect(page.locator('.service-card')).toHaveCount(2);
 await page.getByRole('button',{name:'Все',exact:true}).click();
 await page.getByRole('searchbox',{name:'Поиск услуги'}).fill('Тормозная система');
 await expect(page.locator('.service-card')).toHaveCount(1);
 await page.locator('.service-card').getByRole('button',{name:/Уточнить/}).click();
 await expect(page.getByRole('dialog')).toBeVisible();
 await expect(page.getByRole('dialog')).toContainText('Заявка не отправляется автоматически');
 await expect(page.getByRole('dialog').locator('select').first()).toHaveValue('brakes');
 await page.getByRole('button',{name:'Закрыть окно'}).click();
 await expect(page.getByRole('dialog')).toHaveCount(0);
});
test('diagnostic symptom finder, car hotspots and FAQs are interactive',async({page})=>{
 await page.goto(base);
 await page.getByRole('button',{name:'Стук или шум на кочках'}).click();
 await expect(page.locator('.diagnostic-result h3')).toContainText('Ремонт подвески');
 await page.getByRole('button',{name:'Выбрать узел: Тормоза'}).click();
 await expect(page.locator('.scan-pin.selected')).toHaveCount(1);
 await page.getByRole('button',{name:/Какие автомобили принимают/}).click();
 await expect(page.getByRole('button',{name:/Какие автомобили принимают/})).toHaveAttribute('aria-expanded','true');
});
test('mobile navigation, visible visuals and no horizontal overflow',async({page},testInfo)=>{
 if(testInfo.project.name!=='mobile')return;
 await page.goto(base);
 await page.getByRole('button',{name:'Открыть меню'}).click();
 await expect(page.getByRole('navigation',{name:'Мобильное меню'})).toBeVisible();
 await page.getByRole('navigation',{name:'Мобильное меню'}).getByRole('link',{name:'Услуги'}).click();
 await expect(page.getByRole('navigation',{name:'Мобильное меню'})).toHaveCount(0);
 await expect(page.locator('.diagnostic-console')).toBeVisible();
 const overflow=await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth);
 expect(overflow).toBeLessThanOrEqual(2);
});
test('desktop and mobile screenshots for visual review',async({page},testInfo)=>{
 await page.goto(base,{waitUntil:'domcontentloaded'});
 await page.evaluate(()=>document.fonts.ready);
 await page.screenshot({path:testInfo.outputPath('doctor-premium-dark.png'),fullPage:true,animations:'disabled'});
 await page.evaluate(()=>localStorage.setItem('doctorcar_theme','light'));
 await page.reload();
 await page.screenshot({path:testInfo.outputPath('doctor-premium-light.png'),fullPage:true,animations:'disabled'});
});
test('essential company information remains accessible without JS',async({browser})=>{
 const page=await browser.newPage({javaScriptEnabled:false});
 await page.goto(base,{waitUntil:'domcontentloaded'});
 await expect(page.getByRole('heading',{level:1})).toContainText('Доктор Кар');
 await expect(page.getByRole('link',{name:/Открыть маршрут/})).toHaveAttribute('href',/114732639406/);
 await page.close();
});

test('car photo is not covered by interactive cards on small screens',async({page},testInfo)=>{
 if(testInfo.project.name!=='mobile')return;
 await page.goto(base);
 const r=await page.evaluate(()=>{
  const car=document.querySelector('.hero-image-wrap').getBoundingClientRect();
  const panel=document.querySelector('.float-diagnostics').getBoundingClientRect();
  const stage=document.querySelector('.hero-stage').getBoundingClientRect();
  return {carBottom:car.bottom,panelTop:panel.top,stageHeight:stage.height};
 });
 expect(r.panelTop).toBeGreaterThanOrEqual(r.carBottom-3);
 expect(r.stageHeight).toBeGreaterThan(400);
 await expect(page.locator('.hero-car')).toBeVisible();
});
