import {readFile} from 'node:fs/promises';
import assert from 'node:assert/strict';
const main=await readFile(new URL('../src/main.jsx',import.meta.url),'utf8');
const showroom=await readFile(new URL('../src/showroom.jsx',import.meta.url),'utf8');
const css=await readFile(new URL('../src/showroom.css',import.meta.url),'utf8');
const oldcss=await readFile(new URL('../src/studio.css',import.meta.url),'utf8');
const catalog=await readFile(new URL('../src/data/catalog.js',import.meta.url),'utf8');
for(const name of ['ShowroomHeader','ShowroomHome','ShowroomFooter','ShowroomMobileNav','ServiceRail','ProjectsShowcase','ComparePhotos','BookingStrip'])assert(showroom.includes('function '+name+'(')||showroom.includes('export function '+name+'('),'Missing component '+name);
for(const x of ['useEmblaCarousel','AnimatePresence','useReducedMotion','aria-pressed','onClick','onChange','type="range"','type="date"','select','mailto','tel:'])assert((main+showroom).includes(x),'Missing interaction '+x);
for(const url of [...showroom.matchAll(/https:\/\/[^'"\s)]+/g)].map(m=>m[0])){
 if(/\.(?:png|jpe?g|webp)/.test(url))assert(url.startsWith('https://chizhavto.ru/'),'Third-party imagery '+url);
}
assert(main.includes('<ShowroomHome/>'),'Concept 5 homepage not connected');
assert(!css.includes('scroll-progress')&&!css.includes('marquee'),'No ticker or progress decoration');
assert(!css.includes('content-visibility:auto'),'Avoid blank offscreen sections');
assert(css.includes('prefers-reduced-motion'),'Reduced-motion needed');
assert(!catalog.includes('unsplash.com')&&!catalog.includes('pexels.com'),'Only authentic photography');
assert(catalog.includes('export const SHOWROOM_PHOTOS='),'Verified showroom photo mapping missing');
assert(main.includes("import('./data/snapshot.json')"),'Lazy original facts index must remain');
for(const path of ['ServicesPage','ProjectsPage','PricesPage','OffersPage','ContactsPage'])assert(main.includes('function '+path+'('),'Original data route missing: '+path);
console.log('Showroom concept 5 static checks passed');
