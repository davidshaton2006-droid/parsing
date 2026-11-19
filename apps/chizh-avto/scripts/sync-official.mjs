/**
 * Build-time index of factual public information, not a mirror of articles.
 * Follows only chizhavto.ru. Every indexed source has a clickable canonical URL.
 * All long marketing copy remains on the official site. Builds fall back to
 * reviewed static data if network access is denied.
 */
import {load} from 'cheerio';
import {readFile,writeFile} from 'node:fs/promises';
const DOMAIN='https://chizhavto.ru';
const OUT=new URL('../src/data/snapshot.json',import.meta.url);
const seed=JSON.parse(await readFile(OUT,'utf8'));
const roots=['/','/services/','/projects/','/prices/','/shares/','/reviews/','/company/','/contacts/'];
const MAX_PAGES=Math.min(500,Math.max(20,Number(process.env.CHIZH_MAX_PAGES)||150));
const WORKERS=3;
const TIMEOUT=8500;
const clean=s=>String(s||'').replace(/\s+/g,' ').trim().slice(0,230);
function canonical(href){try {const u=new URL(href,DOMAIN);if(u.origin!==DOMAIN||!/^\/(services|projects|shares|reviews|company|contacts|prices)(\/|$)/.test(u.pathname))return null;if(/\.(pdf|jpg|jpeg|png|webp|gif|zip|docx?|xlsx?)$/i.test(u.pathname))return null;u.hash='';u.search='';return u.href.endsWith('/')?u.href:u.href+'/'}catch{return null}}
async function pageHTML(url){const abort=new AbortController();const id=setTimeout(()=>abort.abort(),TIMEOUT);try{const r=await fetch(url,{signal:abort.signal,headers:{'User-Agent':'Mozilla/5.0 (compatible; ChizhAutoPreviewIndexer/1.0; source facts directory)','Accept':'text/html'}});if(!r.ok)throw Error('HTTP '+r.status);return load(await r.text())}finally{clearTimeout(id)}}
function parse($,url){const main=$('main').first().length?$('main').first():$('.page-content').first().length?$('.page-content').first():$('body');
const title=clean($('h1').first().text()||$('title').text());const headings=[];main.find('h1,h2,h3,h4').each((_,node)=>{const s=clean($(node).text());if(s&&s.length>1&&!headings.includes(s))headings.push(s)});
const links=[];$('a[href]').each((_,node)=>{const uri=canonical($(node).attr('href'));if(uri)links.push({url:uri,title:clean($(node).text()||$(node).attr('title'))})});
const tables=[];main.find('table').each((_,table)=>{const rows=[];$(table).find('tr').each((_,tr)=>{const cells=$(tr).find('th,td').map((_,el)=>clean($(el).text())).get();if(cells.filter(Boolean).length>=2)rows.push(cells)});if(rows.length)tables.push(rows)});
const media=[];main.find('img').each((_,node)=>{const raw=$(node).attr('data-src')||$(node).attr('src')||$(node).attr('data-lazy-src');try{const uri=new URL(raw,DOMAIN);if(uri.origin===DOMAIN&&uri.pathname.includes('/upload/')&&!media.some(x=>x.url===uri.href)&&media.length<35)media.push({url:uri.href,alt:clean($(node).attr('alt'))})}catch{}});
return {url,title,headings:headings.slice(0,100),links:links.filter((x,i,a)=>a.findIndex(y=>y.url===x.url)===i),tables,media};}
async function run(){const pending=[...roots.map(p=>DOMAIN+p)],visited=new Set();const records=[];const errors=[];
async function worker(){while(pending.length&&visited.size<MAX_PAGES){const url=pending.shift();if(!url||visited.has(url))continue;visited.add(url);try{const record=parse(await pageHTML(url),url);records.push(record);for(const link of record.links){if(!visited.has(link.url)&&!pending.includes(link.url)&&pending.length<5000)pending.push(link.url)}}catch(e){errors.push({url,error:String(e.message||e)})}}}
await Promise.all(Array.from({length:WORKERS},()=>worker()));
if(records.length<5){console.warn('Official source currently inaccessible. Keeping reviewed fallback.',errors.slice(0,6));return}
const sorted=records.sort((a,b)=>a.url.localeCompare(b.url));const pricing=sorted.find(x=>x.url===DOMAIN+'/prices/');
const output={syncedAt:new Date().toISOString(),status:(visited.size>=MAX_PAGES||errors.length?'partial-synced':'live-synced'),pages:sorted.map(({url,title,headings,media})=>({url,title,headings,media:media.slice(0,12)})),priceRows:pricing?.tables.flat()||[],projectRows:sorted.filter(x=>x.url.startsWith(DOMAIN+'/projects/')&&x.url!==DOMAIN+'/projects/').map(x=>({url:x.url,title:x.title,photo:x.media[0]?.url||'',facts:x.headings.slice(0,12)})),servicePages:sorted.filter(x=>x.url.startsWith(DOMAIN+'/services/')&&x.url!==DOMAIN+'/services/').map(x=>({url:x.url,title:x.title,headings:x.headings.slice(0,12),media:x.media.slice(0,5)})),news:[],sourceUrls:sorted.map(x=>x.url),errors};
await writeFile(OUT,JSON.stringify(output,null,2));console.log(`Indexed ${sorted.length} official pages, ${output.priceRows.length} price rows, ${output.projectRows.length} projects, ${output.servicePages.length} detailed service pages; ${errors.length} unavailable.`);
}
await run();
