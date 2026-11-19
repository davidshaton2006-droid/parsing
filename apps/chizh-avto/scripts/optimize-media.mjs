/**
 * Build-time image optimizer for Chizh-Avto's OWN media only.
 * - Never downloads arbitrary third-party photos.
 * - Makes small/large WebP variants and a URL -> local asset manifest.
 * - Reuses files restored by GitHub Actions cache.
 * - Failing original server NEVER breaks the site: React Frame falls back
 *   to the original verified company image URL.
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';
import sharp from 'sharp';

const cwd=path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const imageDir=path.join(cwd,'public','media');
const manifestPath=path.join(cwd,'src','data','optimized-images.json');
const companyHost='chizhavto.ru';
const maxImages=Number(process.env.CHIZH_MEDIA_LIMIT||100);
const requestTimeout=12000;

function isCompanyPhoto(raw){
  try{
    const url=new URL(raw);
    return url.protocol==='https:' && url.hostname===companyHost &&
      url.pathname.startsWith('/upload/') &&
      /\.(?:png|jpe?g|webp)$/i.test(url.pathname);
  }catch{return false}
}
function keyFor(url){return createHash('sha256').update(url).digest('hex').slice(0,14)}
async function have(file){try{await fs.access(file);return true}catch{return false}}
async function photoUrls(){
  const catalog=await fs.readFile(path.join(cwd,'src','data','catalog.js'),'utf8');
  const originals=[...catalog.matchAll(/https:\/\/chizhavto\.ru\/upload\/[^\s'"\\]+?\.(?:png|jpe?g|webp)/ig)].map(x=>x[0]);
  const hero=originals.find(url=>url.includes('mtdza80sjtcz8bzte902fpm0eaamaysa'));
  // Preserve hero as top priority regardless of number of synced projects.
  const sources=[...(hero?[hero]:[]),...originals];
  try{
    const snapshot=JSON.parse(await fs.readFile(path.join(cwd,'src','data','snapshot.json'),'utf8'));
    for(const item of snapshot.projectRows||[])if(typeof item.photo==='string')sources.push(item.photo);
  }catch{}
  return [...new Set(sources.filter(isCompanyPhoto))].slice(0,maxImages);
}
async function fetchBuffer(url){
  const response=await fetch(url,{
    signal:AbortSignal.timeout(requestTimeout),
    headers:{'User-Agent':'Mozilla/5.0 (compatible; Chizh-Avto demo media optimizer/1.0)','Accept':'image/avif,image/webp,image/*;q=0.8'}
  });
  if(!response.ok)throw Error('HTTP '+response.status);
  const length=Number(response.headers.get('content-length')||0);
  if(length>18000000)throw Error('image too large');
  const buffer=Buffer.from(await response.arrayBuffer());
  if(buffer.length>18000000)throw Error('image too large');
  return buffer;
}
async function processImage(url){
  const key=keyFor(url);
  const small='media/'+key+'-520.webp';
  const large='media/'+key+'-1100.webp';
  const smallFile=path.join(cwd,'public',small);
  const largeFile=path.join(cwd,'public',large);
  if(!await have(smallFile) || !await have(largeFile)){
    const bytes=await fetchBuffer(url);
    const metadata=await sharp(bytes).metadata();
    if(!metadata.width||!metadata.height)throw Error('no image dimensions');
    const common={withoutEnlargement:true};
    await Promise.all([
      sharp(bytes).rotate().resize({width:520,...common}).webp({quality:73,effort:4}).toFile(smallFile),
      sharp(bytes).rotate().resize({width:1100,...common}).webp({quality:78,effort:4}).toFile(largeFile)
    ]);
  }
  const smallMeta=await sharp(smallFile).metadata();
  const largeMeta=await sharp(largeFile).metadata();
  return {small,large,smallWidth:smallMeta.width,largeWidth:largeMeta.width,
    largeHeight:largeMeta.height};
}
await fs.mkdir(imageDir,{recursive:true});
const urls=await photoUrls();
const manifest={};
let finished=0,failures=0,bytes=0;
let offset=0;
async function worker(){
  while(offset<urls.length){
    const url=urls[offset++];
    try{
      const entry=await processImage(url);
      manifest[url]=entry;
      bytes+=(await fs.stat(path.join(cwd,'public',entry.large))).size+
        (await fs.stat(path.join(cwd,'public',entry.small))).size;
      finished++;
    }catch(error){
      failures++;
      console.warn('PHOTO FALLBACK',new URL(url).pathname, String(error.message||error));
    }
  }
}
await Promise.all(Array.from({length:Math.min(5,urls.length)},()=>worker()));
await fs.writeFile(manifestPath,JSON.stringify(manifest,null,2)+'\n','utf8');
console.log('CHIZH MEDIA',JSON.stringify({images:urls.length,optimized:finished,fallback:failures,bytes,manifest:manifestPath}));
