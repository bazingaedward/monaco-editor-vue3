// vite.config.js
const path = require('path')
const vue = require('@vitejs/plugin-vue')
const monaco = require('rollup-plugin-monaco-editor')

module.exports = {
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/main.js'),
      name: 'monaco-editor-vue3',
      formats: ['es', 'cjs', 'umd']
    },
    rollupOptions: {
      external: ['monaco-editor']
    }
  },

  plugins: [
    vue(),
    monaco({
      languages: ['javascript']
    })
  ]
}