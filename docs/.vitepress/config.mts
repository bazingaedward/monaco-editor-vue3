import { defineConfig } from 'vitepress';

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: 'Monaco Editor Vue3',
  description: 'A VitePress Site',
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Guide', link: '/guide' },
      { text: 'Examples', link: '/examples' },
      { text: 'Playground', link: 'https://microsoft.github.io/monaco-editor/playground.html' },
      { text: 'API', link: 'https://microsoft.github.io/monaco-editor/docs.html' },
    ],

    sidebar: [
      {
        text: 'Category',
        items: [
          { text: 'Guide', link: '/guide' },
          { text: 'Examples', link: '/examples' },
        ],
      },
    ],

    socialLinks: [{ icon: 'github', link: 'https://github.com/bazingaedward/monaco-editor-vue3' }],
  },
  base: '/monaco-editor-vue3/',
  vite: {
    define: {
      self: 'self',
      navigator: 'navigator',
    },
    build: {
      ssr: false,
      rollupOptions: {
        output: {
          globals: {
            'monaco-editor': 'monaco',
          },
        },
      },
    },
  },
});
