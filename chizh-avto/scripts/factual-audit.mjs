import {readFile} from 'node:fs/promises';
import assert from 'node:assert/strict';
const data=await import(new URL('../src/data/catalog.js',import.meta.url).href);
assert.equal(data.groups.length,12,'Official catalogue lists 12 groups');
assert(data.groups.every(g=>g.id&&g.name&&g.slug&&g.photo?.startsWith('https://chizhavto.ru/')),'Only original photos and verified groups');
assert(data.projects.every(p=>p.image?.startsWith('https://chizhavto.ru/')),'No third-party project photos');
assert.equal(new Set(data.groups.map(g=>g.id)).size,data.groups.length,'Duplicate groups');
const snap=JSON.parse(await readFile(new URL('../src/data/snapshot.json',import.meta.url),'utf8'));
assert(Array.isArray(snap.servicePages)&&Array.isArray(snap.priceRows),'Invalid snapshot schema');
if(snap.status==='live-synced'){
 assert(snap.servicePages.every(x=>x.url.startsWith('https://chizhavto.ru/services/')));
 assert(snap.projectRows.every(x=>x.url.startsWith('https://chizhavto.ru/projects/')));
}
console.log('Factual audit passed:',data.groups.length,'service groups;',snap.servicePages.length,'synced service pages;',snap.priceRows.length,'price rows.');
