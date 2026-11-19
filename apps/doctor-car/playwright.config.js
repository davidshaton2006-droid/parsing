import {defineConfig,devices} from '@playwright/test';
export default defineConfig({testDir:'./tests',timeout:30000,retries:process.env.CI?1:0,
use:{baseURL:'http://127.0.0.1:4178/parsing/doctor-car/',trace:'retain-on-failure'},
projects:[
 {name:'desktop',use:{...devices['Desktop Chrome'],viewport:{width:1440,height:900}}},
 {name:'mobile',use:{...devices['iPhone 13'],browserName:'chromium'}}
],
webServer:{command:process.env.CI?'npm run preview -- --host 127.0.0.1 --port 4178 --strictPort':'npm run dev -- --host 127.0.0.1 --port 4178 --strictPort',url:'http://127.0.0.1:4178/parsing/doctor-car/',timeout:90000,reuseExistingServer:!process.env.CI}
});
