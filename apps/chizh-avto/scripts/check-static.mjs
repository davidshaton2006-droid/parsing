import {readFile} from 'node:fs/promises';
import assert from 'node:assert/strict';
const js=await readFile(new URL('../src/main.jsx',import.meta.url),'utf8');
const css=await readFile(new URL('../src/studio.css',import.meta.url),'utf8');
const html=await readFile(new URL('../index.html',import.meta.url),'utf8');
const catalog=await readFile(new URL('../src/data/catalog.js',import.meta.url),'utf8');
for(const name of ['Home','Hero','ServiceIndex','Portfolio','Reel','ServicesPage','ProjectsPage','PricesPage','ContactsPage','OffersPage','AboutPage'])
  assert(js.includes('function '+name+'('),name+' is missing');
for(const fragment of ['tel:','mailto:','navigator.clipboard','onSubmit={','setFilter','setSelected','setOpen','aria-expanded','onChange','onClick'])
  assert(js.includes(fragment),fragment+' missing');
assert(js.includes('facts.youtube')&&js.includes('facts.video'),'official video source and fallback must be available');
assert(js.includes("import('./data/snapshot.json')"),'large factual data must not block homepage');
assert(js.includes('optimizedImages'),'verified company-only optimized photos missing');
assert(js.includes('loading={hero?'),'lazy image loading missing');
assert(!css.includes('scroll-progress'),'decorative progress bar must not return');
assert(!css.includes('marquee'),'decorative ticker must not return');
assert(!css.includes('content-visibility:auto'),'full-page rendering must not leave blank sections');
assert(css.includes('prefers-reduced-motion'),'reduced motion support missing');
assert(html.includes('<noscript>'),'no-JS fallback missing');
assert(html.includes('src="/src/main.jsx"'),'canonical entrypoint not wired');
assert(catalog.includes('chizhavto.ru/upload/'),'company-only photos missing');
assert(!catalog.includes('unsplash.com')&&!catalog.includes('pexels.com'),'unapproved stock photos');
console.log('Editorial production static checks passed.');
