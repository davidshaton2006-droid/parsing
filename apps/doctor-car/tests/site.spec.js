import {test,expect} from '@playwright/test';
const base='http://127.0.0.1:4175/parsing/doctor-car/';
test('dark theme, brand, contacts and hero', async({page})=>{
 await page.goto(base);
 await expect(page.getByRole('heading',{level:1})).toContainText('Сложности с машиной');
 await expect(page.locator('html')).toHaveAttribute('data-theme','dark');
 await expect(page.getByRole('link',{name:/Карточка организации/})).toHaveAttribute('href',/114732639406/);
 await expect(page.getByRole('link',{name:/Позвонить/}).last()).toHaveAttribute('href','tel:+79184534100');
});
test('light and dark theme switch', async({page})=>{
 await page.goto(base);
 await page.getByRole('button',{name:'Включить светлую тему'}).click();
 await expect(page.locator('html')).toHaveAttribute('data-theme','light');
 await page.reload();
 await expect(page.locator('html')).toHaveAttribute('data-theme','light');
 await page.getByRole('button',{name:'Включить тёмную тему'}).click();
 await expect(page.locator('html')).toHaveAttribute('data-theme','dark');
});
test('service filters, search and booking modal function', async({page})=>{
 await page.goto(base);
 await page.getByRole('button',{name:'Двигатель',exact:true}).click();
 await expect(page.locator('.service-card')).toHaveCount(2);
 await page.getByRole('button',{name:'Все',exact:true}).click();
 await expect(page.locator('.service-card')).toHaveCount(12);
 await page.getByRole('searchbox',{name:'Поиск услуги'}).fill('Тормозная система');
 await expect(page.locator('.service-card').filter({has:page.getByRole('heading',{name:'Тормозная система',exact:true})})).toHaveCount(1);
 await page.locator('.service-card').filter({has:page.getByRole('heading',{name:'Тормозная система',exact:true})}).locator('.service-arrow').click();
 await expect(page.getByRole('dialog')).toBeVisible();
 await expect(page.getByRole('dialog').locator('select').first()).toHaveValue('brakes');
 await page.getByRole('button',{name:'Закрыть окно'}).click();
 await expect(page.getByRole('dialog')).toHaveCount(0);
});
test('symptom finder and FAQ work', async({page})=>{
 await page.goto(base);
 await page.getByRole('button',{name:/Стук или шум/}).click();
 await expect(page.locator('.diagnostic-result h3')).toContainText('подвески');
 await page.getByRole('button',{name:/Какие автомобили принимают/}).click();
 await expect(page.getByRole('button',{name:/Какие автомобили принимают/})).toHaveAttribute('aria-expanded','true');
});
test('mobile navigation and no horizontal overflow', async({page},testInfo)=>{
 await page.goto(base);
 if(testInfo.project.name!=='mobile')return;
 await page.getByRole('button',{name:'Открыть меню'}).click();
 await expect(page.getByRole('navigation',{name:'Мобильное меню'})).toBeVisible();
 await page.getByRole('navigation',{name:'Мобильное меню'}).getByRole('link',{name:/Услуги/}).click();
 await expect(page.getByRole('navigation',{name:'Мобильное меню'})).toHaveCount(0);
 const overflow=await page.evaluate(()=>document.documentElement.scrollWidth-window.innerWidth);
 expect(overflow).toBeLessThanOrEqual(2);
});
test('real screenshots of approved dark and light visual', async({page},testInfo)=>{
 await page.goto(base);await page.screenshot({path:testInfo.outputPath('doctor-dark.png'),fullPage:true,animations:'disabled'});
 await page.evaluate(()=>localStorage.setItem('doctorcar_theme','light'));
 await page.reload();
 await page.screenshot({path:testInfo.outputPath('doctor-light.png'),fullPage:true,animations:'disabled'});
});