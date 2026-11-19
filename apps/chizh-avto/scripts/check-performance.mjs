// Run against the PRODUCTION Vite output. No fake Lighthouse scores:
// report actual shipped asset bytes so regressions are visible in Actions logs.
import fs from 'node:fs/promises';
import path from 'node:path';
import {gzipSync} from 'node:zlib';
import assert from 'node:assert/strict';

const dist=new URL('../dist/',import.meta.url);
const list=[];
async function walk(folder){
  for(const e of await fs.readdir(folder,{withFileTypes:true})){
    const full=path.join(folder,e.name);
    if(e.isDirectory())await walk(full);
    else if(e.isFile()){
      const bytes=await fs.readFile(full);
      const rel=path.relative(dist.pathname,full).replaceAll(path.sep,'/');
      list.push({file:rel,size:bytes.length,gzip:/\.(?:js|css|html|json)$/i.test(e.name)?gzipSync(bytes).length:0});
    }
  }
}
await walk(dist.pathname);
const js=list.filter(x=>x.file.endsWith('.js'));
const css=list.filter(x=>x.file.endsWith('.css'));
const photos=list.filter(x=>/\.(?:avif|webp|png|jpe?g)$/i.test(x.file));
const kilobytes=n=>Math.round(n/1024);
const totals={
 jsGzipKB:kilobytes(js.reduce((n,x)=>n+x.gzip,0)),
 cssGzipKB:kilobytes(css.reduce((n,x)=>n+x.gzip,0)),
 imageFiles:photos.length,
 imageKB:kilobytes(photos.reduce((n,x)=>n+x.size,0)),
 largestImageKB:kilobytes(Math.max(0,...photos.map(x=>x.size))),
 jsChunks:js.length,
 cssFiles:css.length
};
console.log('CHIZH PRODUCTION PERFORMANCE BUDGET',JSON.stringify(totals));
console.log('Largest JS files (gzip KiB):',js.sort((a,b)=>b.gzip-a.gzip).slice(0,8).map(x=>[x.file,kilobytes(x.gzip)]));
console.log('Largest photos (KiB):',photos.sort((a,b)=>b.size-a.size).slice(0,5).map(x=>[x.file,kilobytes(x.size)]));
assert(js.length>0,'Vite emitted no JS');
assert(css.length>0,'Vite emitted no CSS');
assert(totals.jsGzipKB<850,'JS bundle unreasonably large: investigate code-splitting');
assert(totals.cssGzipKB<170,'CSS bundle unreasonably large');
assert(totals.largestImageKB<1300,'Unexpectedly huge media asset in Pages artifact');
