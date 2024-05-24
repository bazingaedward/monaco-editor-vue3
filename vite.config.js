import path from 'path';
import vue from '@vitejs/plugin-vue';
import dts from 'vite-plugin-dts';
import { defineConfig } from 'vite';
import AutoImport from 'unplugin-auto-import/vite';

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
      eslintrc: {
        enabled: true, // <-- this
      },
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
});
