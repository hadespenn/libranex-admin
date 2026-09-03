import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath, URL } from 'node:url';
import { resolve } from 'node:path';

const root = fileURLToPath(new URL('.', import.meta.url));

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    port: 8000,
    host: true,
    open: '/admin.html',
  },
  build: {
    rollupOptions: {
      // index.html 是产品原型（参考文档），不作为构建入口
      input: resolve(root, 'admin.html'),
    },
  },
});
