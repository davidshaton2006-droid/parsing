import { createRequire } from 'node:module';
import { spawn } from 'node:child_process';
import { mkdtemp, mkdir, symlink, writeFile, rm, stat } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { resolve, join } from 'node:path';
const require = createRequire(resolve('apps/chizh-avto/package.json'));
const { chromium } = require('playwright');
const pages = resolve(process.argv[2]);
const out = join(pages, 'marketing/assets/previews');
await mkdir(out,{recursive:true});
const temp=await mkdtemp(join(tmpdir(),'marketing-preview-'));
await symlink(pages,join(temp,'parsing'),'dir');
const port=18743;
const server=spawn('python3',['-m','http.server',String(port),'--bind','127.0.0.1','--directory',temp],{stdio:'ignore'});
let browser;
const manifest={};
try {
  let ready=false;
  for(let i=0;i<30;i++){
    try{const r=await fetch('http://127.0.0.1:'+port+'/parsing/marketing/');if(r.ok){ready=true;break;}}catch{}
    await new Promise(r=>setTimeout(r,250));
  }
  if(!ready)throw Error('Preview server unavailable');
  browser=await chromium.launch({headless:true});
  for(const slug of ["gt-service","alfa-auto","ria-service","chizh-avto","st-car","avm-motors-red","doctor-car","ams-studio"]){
    for(const [device,width,height] of [['desktop',1280,820],['mobile',390,844]]){
      const page=await browser.newPage({viewport:{width,height},deviceScaleFactor:1,reducedMotion:'reduce'});
      try{
        const response=await page.goto('http://127.0.0.1:'+port+'/parsing/'+slug+'/',{waitUntil:'domcontentloaded',timeout:20000});
        if(!response?.ok())throw Error('HTTP '+response?.status());
        await page.waitForFunction(()=>document.body?.innerText.trim().length>60,{timeout:8000});
        await page.evaluate(()=>Promise.race([document.fonts.ready,new Promise(r=>setTimeout(r,2000))]));
        await page.waitForTimeout(850);
        const file=slug+'-'+device+'.jpg';
        await page.screenshot({path:join(out,file),type:'jpeg',quality:77,animations:'disabled',timeout:10000});
        if((await stat(join(out,file))).size<5000)throw Error('Screenshot too small');
        (manifest[slug]??={})[device]='/parsing/marketing/assets/previews/'+file;
      }catch(e){console.warn(slug,device,String(e));}
      finally{await page.close();}
    }
  }
}finally{
  await browser?.close();
  server.kill();
  await rm(temp,{recursive:true,force:true});
  await writeFile(join(pages,'marketing/assets/previews.json'),JSON.stringify(manifest,null,2));
}
console.log('Generated project previews',JSON.stringify(manifest));
