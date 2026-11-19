import {test,expect} from '@playwright/test';
const url=new URL('../../../st-car/index.html',import.meta.url).href;
async function load(page){
  await page.goto(url,{waitUntil:'domcontentloaded'});
  await expect(page.getByRole('heading',{level:1})).toContainText('Профессиональный');
}

test('ST CAR: approved concept structure, services and source accuracy',async({page})=>{
  await load(page);
  await expect(page.locator('.service-card')).toHaveCount(8);
  await expect(page.locator('.quick')).toHaveCount(4);
  await expect(page.locator('.demo-banner')).toContainText('Неофициальный');
  await expect(page.locator('.rating')).toContainText('5,0');
  await expect(page.locator('a[href="tel:+79186549999"]').first()).toBeAttached();
  await expect(page.locator('a[href*="25853057069"]').first()).toBeAttached();
  await page.getByRole('button',{name:'Ремонт',exact:true}).click();
  await expect(page.locator('.service-card:visible')).toHaveCount(3);
  await page.getByRole('button',{name:'Все услуги'}).click();
  await expect(page.locator('.service-card:visible')).toHaveCount(8);
});

test('ST CAR: demo inquiry creates text but never confirms a booking',async({page})=>{
  await load(page);
  await page.locator('[data-open-request="Компьютерная диагностика"]').click();
  await expect(page.locator('#request-dialog')).toBeVisible();
  await expect(page.locator('#service-select')).toHaveValue('Компьютерная диагностика');
  await page.locator('input[name="car"]').fill('Toyota Corolla 2017');
  await page.locator('textarea[name="problem"]').fill('Горит Check Engine');
  await page.getByRole('button',{name:/Подготовить и скопировать/}).click();
  await expect(page.locator('#form-result')).toBeVisible();
  await expect(page.locator('#form-result')).toHaveValue(/Toyota Corolla 2017/);
  await expect(page.locator('#form-status')).not.toBeEmpty();
  await page.getByRole('button',{name:'Закрыть окно'}).click();
  await expect(page.locator('#request-dialog')).not.toBeVisible();
});

test('ST CAR: desktop and mobile navigation, layout and screenshots',async({page},testInfo)=>{
  await load(page);
  if(testInfo.project.name.includes('mobile')){
    await page.getByRole('button',{name:'Открыть меню'}).click();
    await expect(page.locator('#mobile-menu')).toBeVisible();
    await page.locator('#mobile-menu').getByRole('link',{name:'Контакты'}).click();
    await expect(page.locator('#mobile-menu')).not.toBeVisible();
    await expect(page.locator('.mobile-bar')).toBeVisible();
  } else {
    await expect(page.locator('.desktop-nav')).toBeVisible();
  }
  const overflow=await page.evaluate(()=>document.documentElement.scrollWidth-window.innerWidth);
  expect(overflow).toBeLessThanOrEqual(2);
  await page.screenshot({path:testInfo.outputPath('stcar-home-full.png'),fullPage:true,animations:'disabled'});
});

test('ST CAR: core content is available with JavaScript disabled',async({browser})=>{
  const context=await browser.newContext({javaScriptEnabled:false,viewport:{width:390,height:844}});
  try{
    const page=await context.newPage();
    await load(page);
    await expect(page.locator('.service-card')).toHaveCount(8);
    await expect(page.locator('#contacts')).toBeVisible();
    await expect(page.locator('.hero-actions a[href="#services"]')).toBeVisible();
    const overflow=await page.evaluate(()=>document.documentElement.scrollWidth-window.innerWidth);
    expect(overflow).toBeLessThanOrEqual(2);
  }finally{await context.close()}
});
