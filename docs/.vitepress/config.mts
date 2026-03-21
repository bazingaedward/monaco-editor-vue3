import { defineConfig } from 'vitepress';

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: 'Monaco Editor Vue3',
  description: 'Monaco Editor component for Vue 3 with TypeScript support',

  // 默认语言为英文
  lang: 'en-US',

  // 多语言配置
  locales: {
    root: {
      label: 'English',
      lang: 'en-US',
      title: 'Monaco Editor Vue3',
      description: 'Monaco Editor component for Vue 3 with TypeScript support',
      themeConfig: {
        nav: [
          { text: 'Guide', link: '/guide' },
          {
            text: 'Examples',
            items: [
              { text: 'Examples Overview', link: '/examples/' },
              { text: 'Basic Examples', link: '/examples/basic' },
              { text: 'Loading & Error Boundary', link: '/examples/loading-and-errorboundary' },
            ],
          },
          { text: 'API Reference', link: '/api' },
          { text: 'Playground', link: 'https://microsoft.github.io/monaco-editor/playground.html' },
        ],

        sidebar: [
          {
            text: 'Getting Started',
            items: [
              { text: 'Guide', link: '/guide' },
              { text: 'API Reference', link: '/api' },
            ],
          },
          {
            text: 'Examples',
            items: [
              { text: 'Examples Overview', link: '/examples/' },
              { text: 'Basic Examples', link: '/examples/basic' },
              { text: 'Loading & Error Boundary', link: '/examples/loading-and-errorboundary' },
            ],
          },
        ],

        editLink: {
          pattern: 'https://github.com/bazingaedward/monaco-editor-vue3/edit/main/docs/:path',
          text: 'Edit this page on GitHub',
        },

        footer: {
          message: 'Released under the MIT License.',
          copyright: `Copyright © ${new Date().getFullYear()} Monaco Editor Vue3`,
        },
      },
    },

    zh: {
      label: '简体中文',
      lang: 'zh-CN',
      title: 'Monaco Editor Vue3',
      description: '基于 Vue 3 和 TypeScript 的 Monaco Editor 组件',
      themeConfig: {
        nav: [
          { text: '指南', link: '/zh/guide' },
          {
            text: '示例',
            items: [
              { text: '示例总览', link: '/zh/examples/' },
              { text: '基础示例', link: '/zh/examples/basic' },
              { text: '加载状态和错误边界', link: '/zh/examples/loading-and-errorboundary' },
            ],
          },
          { text: 'API 文档', link: '/zh/api' },
          { text: '在线演示', link: 'https://microsoft.github.io/monaco-editor/playground.html' },
        ],

        sidebar: [
          {
            text: '开始使用',
            items: [
              { text: '完整指南', link: '/zh/guide' },
              { text: 'API 文档', link: '/zh/api' },
            ],
          },
          {
            text: '示例',
            items: [
              { text: '示例总览', link: '/zh/examples/' },
              { text: '基础示例', link: '/zh/examples/basic' },
              { text: '加载状态和错误边界', link: '/zh/examples/loading-and-errorboundary' },
            ],
          },
        ],

        editLink: {
          pattern: 'https://github.com/bazingaedward/monaco-editor-vue3/edit/main/docs/:path',
          text: '在 GitHub 上编辑此页面',
        },

        footer: {
          message: '基于 MIT 许可发布。',
          copyright: `Copyright © ${new Date().getFullYear()} Monaco Editor Vue3`,
        },

        docFooter: {
          prev: '上一页',
          next: '下一页',
        },

        outline: {
          label: '页面导航',
        },

        lastUpdated: {
          text: '最后更新于',
          formatOptions: {
            dateStyle: 'short',
            timeStyle: 'medium',
          },
        },

        langMenuLabel: '多语言',
        returnToTopLabel: '回到顶部',
        sidebarMenuLabel: '菜单',
        darkModeSwitchLabel: '主题',
        lightModeSwitchTitle: '切换到浅色模式',
        darkModeSwitchTitle: '切换到深色模式',
      },
    },
    'zh-hant': {
      label: '繁體中文',
      lang: 'zh-Hant',
      title: 'Monaco Editor Vue3',
      description: '基於 Vue 3 和 TypeScript 的 Monaco Editor 組件',
      themeConfig: {
        nav: [
          { text: '指南', link: '/zh-hant/guide' },
          {
            text: '範例',
            items: [
              { text: '範例總覽', link: '/zh-hant/examples/' },
              { text: '基礎範例', link: '/zh-hant/examples/basic' },
              { text: '載入狀態與錯誤邊界', link: '/zh-hant/examples/loading-and-errorboundary' },
            ],
          },
          { text: 'API 文件', link: '/zh-hant/api' },
          { text: '線上示範', link: 'https://microsoft.github.io/monaco-editor/playground.html' },
        ],

        sidebar: [
          {
            text: '開始使用',
            items: [
              { text: '完整指南', link: '/zh-hant/guide' },
              { text: 'API 文件', link: '/zh-hant/api' },
            ],
          },
          {
            text: '範例',
            items: [
              { text: '範例總覽', link: '/zh-hant/examples/' },
              { text: '基礎範例', link: '/zh-hant/examples/basic' },
              { text: '載入狀態與錯誤邊界', link: '/zh-hant/examples/loading-and-errorboundary' },
            ],
          },
        ],

        editLink: {
          pattern: 'https://github.com/bazingaedward/monaco-editor-vue3/edit/main/docs/:path',
          text: '在 GitHub 上編輯此頁面',
        },

        footer: {
          message: '基於 MIT 授權發布。',
          copyright: `Copyright © ${new Date().getFullYear()} Monaco Editor Vue3`,
        },

        docFooter: {
          prev: '上一頁',
          next: '下一頁',
        },

        outline: {
          label: '頁面導覽',
        },

        lastUpdated: {
          text: '最後更新於',
          formatOptions: {
            dateStyle: 'short',
            timeStyle: 'medium',
          },
        },

        langMenuLabel: '多語言',
        returnToTopLabel: '回到頂部',
        sidebarMenuLabel: '選單',
        darkModeSwitchLabel: '主題',
        lightModeSwitchTitle: '切換到淺色模式',
        darkModeSwitchTitle: '切換到深色模式',
      },
    },
  },

  themeConfig: {
    socialLinks: [{ icon: 'github', link: 'https://github.com/bazingaedward/monaco-editor-vue3' }],

    search: {
      provider: 'local',
      options: {
        locales: {
          zh: {
            translations: {
              button: {
                buttonText: '搜索文档',
                buttonAriaLabel: '搜索文档',
              },
              modal: {
                noResultsText: '无法找到相关结果',
                resetButtonTitle: '清除查询条件',
                footer: {
                  selectText: '选择',
                  navigateText: '切换',
                },
              },
            },
          },
          'zh-hant': {
            translations: {
              button: {
                buttonText: '搜尋文件',
                buttonAriaLabel: '搜尋文件',
              },
              modal: {
                noResultsText: '無法找到相關結果',
                resetButtonTitle: '清除查詢條件',
                footer: {
                  selectText: '選擇',
                  navigateText: '切換',
                },
              },
            },
          },
        },
      },
    },
  },
  base: '/monaco-editor-vue3/',
  vite: {
    define: {
      global: 'globalThis',
    },
    build: {
      target: 'esnext',
      sourcemap: false,
      chunkSizeWarningLimit: 2000,
    },
  },
});
