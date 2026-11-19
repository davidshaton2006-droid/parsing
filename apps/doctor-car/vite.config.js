import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
export default defineConfig({
  base: '/parsing/doctor-car/',
  plugins: [react()],
  build: { outDir: 'dist', target: 'es2022', cssCodeSplit: true }
});