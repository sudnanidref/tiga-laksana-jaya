import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://tigalaksanajaya.com',
  output: 'static',
  outDir: './dist',
  publicDir: './public',
  build: { format: 'directory' },
});
