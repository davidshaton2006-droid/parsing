import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';
export default defineConfig({plugins:[react()],base:'/parsing/chizh-avto/',build:{outDir:'dist',assetsDir:'assets',emptyOutDir:true,cssCodeSplit:true}});
