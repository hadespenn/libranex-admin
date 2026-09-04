import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { fileURLToPath, URL } from 'node:url';
import { resolve } from 'node:path';

const root = fileURLToPath(new URL('.', import.meta.url));

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    port: 8000,
    host: true,
    open: '/index.html',
  },
  build: {
    // antd 单包约 575kB（gzip 约 188kB），已通过 manualChunks 与业务代码分离并长期缓存，
    // 这里放宽告警阈值，避免每次构建都输出无意义的体积提示。
    chunkSizeWarningLimit: 700,
    rollupOptions: {
      // 应用入口是 index.html；prototype.html 是产品原型参考文档，不参与构建。
      // 注意：此处若不显式指定，Vite 会尝试把根目录所有 html 当作入口。
      input: {
        main: resolve(root, 'index.html'),
      },
      output: {
        // antd 体积较大且很少变动，单独分包可让业务代码的改动不影响其长期缓存。
        manualChunks: {
          react: ['react', 'react-dom', 'react-router-dom'],
          // 图标包为 ESM，会被 tree-shake 后并入使用方，单独分包只会产生空 chunk。
          antd: ['antd', '@ant-design/icons'],
        },
      },
    },
  },
});
