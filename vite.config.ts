import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { readFileSync } from 'fs';

// 从 package.json 读取版本号
const pkg = JSON.parse(readFileSync('./package.json', 'utf-8'));

export default defineConfig({
  plugins: [sveltekit()],
  define: {
    'import.meta.env.VITE_APP_VERSION': JSON.stringify(pkg.version)
  },
  server: {
    port: 5173,
    host: true
  }
});
