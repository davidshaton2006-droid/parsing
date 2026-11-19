const {defineConfig,devices}=require('@playwright/test');
module.exports=defineConfig({
  testDir:'./tests',
  timeout:30000,
  expect:{timeout:8000},
  retries:process.env.CI?1:0,
  workers:2,
  reporter:process.env.CI?[['list'],['html',{open:'never'}]]:'list',
  use:{baseURL:'http://127.0.0.1:4179',trace:'retain-on-failure',screenshot:'only-on-failure'},
  projects:[
    {name:'desktop-chromium',use:{...devices['Desktop Chrome'],viewport:{width:1440,height:900}}},
    {name:'mobile-chromium',use:{...devices['Desktop Chrome'],viewport:{width:390,height:844},isMobile:true,hasTouch:true}}
  ],
  webServer:{
    command:'python3 -m http.server 4179 --bind 127.0.0.1 --directory ..',
    url:'http://127.0.0.1:4179/avm-motors-red/',
    reuseExistingServer:!process.env.CI,
    timeout:45000
  }
});
