import {defineConfig,devices} from '@playwright/test';
export default defineConfig({
  testDir:'./tests',
  timeout:30_000,
  expect:{timeout:9_000},
  fullyParallel:false,
  reporter:[['list'],['html',{outputFolder:'playwright-report',open:'never'}]],
  use:{baseURL:'http://127.0.0.1:4173',trace:'retain-on-failure',screenshot:'only-on-failure'},
  projects:[{name:'chromium-desktop',use:{...devices['Desktop Chrome'],viewport:{width:1440,height:900}}},{name:'chromium-mobile',use:{...devices['iPhone 13'],browserName:'chromium'}}],
  webServer:{command:process.env.CI?'npm run preview -- --host 127.0.0.1 --port 4173 --strictPort':'npm run dev -- --host 127.0.0.1 --port 4173 --strictPort',url:'http://127.0.0.1:4173/parsing/chizh-avto/',reuseExistingServer:!process.env.CI,timeout:60_000}
});
