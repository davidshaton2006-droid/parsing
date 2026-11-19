import {readFile} from 'node:fs/promises';
import assert from 'node:assert/strict';
const src=new URL('../src/data/catalog.js',import.meta.url);
const data=await import(src.href);
const groups=data.groups;
assert(groups.length===12,'The original Chizh-Avto website currently lists 12 service groups');
assert(groups.every(g=>g.id&&g.name&&g.slug&&g.photo?.startsWith('https://chizhavto.ru/')),'Only company images and verified groups are allowed');
assert(data.projects.every(p=>p.image?.startsWith('https://chizhavto.ru/')),'All project images must originate from Chizh-Avto');
assert(new Set(groups.map(g=>g.id)).size===groups.length,'Duplicate category IDs');
const snapshot=JSON.parse(await readFile(new URL('../src/data/snapshot.json',import.meta.url),'utf8'));
assert(Array.isArray(snapshot.servicePages)&&Array.isArray(snapshot.priceRows),'Snapshot schema missing');
if(snapshot.status==='live-synced'){
 assert(snapshot.servicePages.every(x=>x.url.startsWith('https://chizhavto.ru/services/')),'External service source detected');
 assert(snapshot.projectRows.every(x=>x.url.startsWith('https://chizhavto.ru/projects/')),'External project source detected');
}
console.log(`Factual audit passed: ${groups.length} service groups, ${data.projects.length} reviewed projects, ${snapshot.servicePages.length} official pages, ${snapshot.priceRows.length} priced rows`);
