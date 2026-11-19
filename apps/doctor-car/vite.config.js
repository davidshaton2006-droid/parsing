import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins:[react()],
  base:'/parsing/doctor-car/',
  build:{outDir:'dist',assetsDir:'assets',emptyOutDir:true,target:'es2022',cssCodeSplit:true}
});
