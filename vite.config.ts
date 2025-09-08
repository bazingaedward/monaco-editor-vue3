/// <reference types="vitest" />
import path from 'node:path';
import vue from '@vitejs/plugin-vue';
import AutoImport from 'unplugin-auto-import/vite';
import dts from 'vite-plugin-dts';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  build: {
    minify: false,
    lib: {
      entry: path.resolve(__dirname, 'src/index.ts'),
      name: 'monaco-editor-vue3',
      fileName: 'index',
    },
    rollupOptions: {
      external: ['monaco-editor', 'vue'],
      output: {
        globals: {
          'monaco-editor': 'monaco-editor',
          vue: 'Vue',
        },
      },
    },
  },
  plugins: [
    vue(),
    dts({ rollupTypes: true }),
    AutoImport({
      dts: true,
      imports: ['vue'],
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      'monaco-editor': path.resolve(__dirname, 'node_modules/monaco-editor/esm/vs/editor/editor.api.js'),
    },
  },
  test: {
    environment: 'jsdom',
  },
});
