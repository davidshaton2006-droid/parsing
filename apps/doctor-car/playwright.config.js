import {defineConfig,devices} from '@playwright/test';
export default defineConfig({
 testDir:'tests',timeout:30000,retries:process.env.CI?1:0,
 projects:[{name:'desktop',use:{...devices['Desktop Chrome'],viewport:{width:1440,height:900}}},{name:'mobile',use:{...devices['iPhone 13'],defaultBrowserType:'chromium'}}],
 webServer:{command:'npm run preview -- --host 127.0.0.1 --port 4175 --strictPort',url:'http://127.0.0.1:4175/parsing/doctor-car/',reuseExistingServer:!process.env.CI,timeout:100000}
});