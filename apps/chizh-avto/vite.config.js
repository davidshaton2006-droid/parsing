import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';
import {readFileSync} from 'node:fs';
import {PHOTO} from './src/data/catalog.js';

const base='/parsing/chizh-avto/';

// React mounts its hero after JS: discover the optimized LCP image during HTML parsing.
const heroPreload={
  name:'preload-chizh-original-hero',
  transformIndexHtml(html){
    try{
      const manifest=JSON.parse(readFileSync(new URL('./src/data/optimized-images.json',import.meta.url),'utf8'));
      const hero=manifest[PHOTO.toyota];
      if(!hero)return html;
      const srcset=hero.smallWidth===hero.largeWidth?
        base+hero.large+' '+hero.largeWidth+'w':
        base+hero.small+' '+hero.smallWidth+'w, '+base+hero.large+' '+hero.largeWidth+'w';
      const tag='<link rel="preload" as="image" href="'+base+hero.large+'" imagesrcset="'+srcset+'" imagesizes="100vw" fetchpriority="high">';
      return html.replace('</head>',tag+'</head>');
    }catch{return html}
  }
};
export default defineConfig({
  plugins:[react(),heroPreload],
  base,
  build:{
    outDir:'dist',
    assetsDir:'assets',
    emptyOutDir:true,
    cssCodeSplit:true,
    target:'es2022',
    rollupOptions:{
      output:{
        manualChunks(id){
          if(id.includes('/node_modules/react/')||id.includes('/node_modules/react-dom/')||id.includes('/node_modules/scheduler/')) return 'react-core';
          if(id.includes('/node_modules/motion/')||id.includes('/node_modules/framer-motion/')) return 'motion';
          if(id.includes('/node_modules/embla-carousel')) return 'carousel';
        }
      }
    }
  }
});
