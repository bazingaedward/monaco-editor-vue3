// vite.config.js

import path from 'path'
import vue from '@vitejs/plugin-vue'
import dts from 'vite-plugin-dts'

/**
 * @type {import('vite').UserConfig}
 */
const config = {
  build: {
    minify: false,
    lib: {
      entry: path.resolve(__dirname, 'src/main.ts'),
      name: 'monaco-editor-vue3',
      formats: ['es', 'umd']
    },
    rollupOptions: {
      external: ['monaco-editor', 'vue'],
      output: {
        globals: {
          "monaco-editor": "monaco-editor",
          "vue": "Vue"
        }
      }
    }
  },
  plugins: [
    vue(),
    dts()
  ],
}
export default config