// vite.config.js

import path from 'path'
import vue from '@vitejs/plugin-vue'

/**
 * @type {import('vite').UserConfig}
 */
const config = {
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/main.ts'),
      name: 'monaco-editor-vue3',
      formats: ['es', 'umd']
    },
    rollupOptions: {
      external: ['monaco-editor'],
      output: {
        globals: {
          "monaco-editor": "monaco-editor"
        }
      }
    }
  },
  plugins: [
    vue(),
  ],
}
export default config