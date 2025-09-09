// .vitepress/theme/index.ts
import type { Theme } from 'vitepress';
import DefaultTheme from 'vitepress/theme';
import { defineComponent, h, onMounted, ref } from 'vue';
import './style.css';

// 创建智能的客户端组件
const createSmartEditor = (editorType: 'CodeEditor' | 'DiffEditor') => {
  return defineComponent({
    name: editorType,
    props: {
      value: String,
      original: String,
      language: String,
      theme: String,
      height: [String, Number],
      width: [String, Number],
      options: Object,
    },
    setup(props, { attrs, emit }) {
      const isClient = ref(false);
      const EditorComponent = ref(null);
      const isLoading = ref(false);
      const hasError = ref(false);

      onMounted(async () => {
        isClient.value = true;
        isLoading.value = true;

        try {
          // 开发模式下直接导入源码，生产模式下导入构建产物
          let module: any;
          const isDev = typeof window !== 'undefined' && window.location.hostname === 'localhost';

          if (isDev) {
            // 开发模式：直接导入源码
            module = await import('../../../src/index');
          } else {
            // 生产模式：使用绝对路径或 CDN
            try {
              // 生产模式：根据部署环境使用正确的路径
              const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
              const buildPath = `${baseUrl}/monaco-editor-vue3/dist/index.mjs`;
              module = await import(buildPath);
            } catch (fallbackError) {
              // 方案2：回退到 CDN 或其他绝对 URL
              console.warn('Failed to load from absolute path, trying alternative...', fallbackError);
              // 这里可以添加 CDN 链接作为备选方案
              // module = await import('https://cdn.example.com/monaco-editor-vue3/dist/index.mjs');
              throw new Error('Monaco Editor build not found in production');
            }
          }

          EditorComponent.value = module[editorType];
          console.log('Monaco Editor loaded for', editorType, isDev ? '(dev mode)' : '(prod mode)');
          hasError.value = false;
        } catch (error) {
          console.warn(`Could not load ${editorType}:`, error);
          hasError.value = true;
        } finally {
          isLoading.value = false;
        }
      });

      return () => {
        const style = {
          height: props.height || '400px',
          width: props.width || '100%',
        };

        if (!isClient.value) {
          return h(
            'div',
            {
              class: 'monaco-editor-placeholder',
              style,
            },
            `${editorType} (SSR Mode)`
          );
        }

        if (isLoading.value) {
          return h(
            'div',
            {
              class: 'monaco-editor-placeholder',
              style,
            },
            `${editorType} (Loading...)`
          );
        }

        if (hasError.value || !EditorComponent.value) {
          return h(
            'div',
            {
              class: 'monaco-editor-placeholder',
              style,
            },
            [
              h('div', `${editorType} Demo`),
              h(
                'div',
                { style: { fontSize: '12px', marginTop: '8px', opacity: 0.7 } },
                `Language: ${props.language || 'javascript'} | Theme: ${props.theme || 'vs'}`
              ),
            ]
          );
        }

        // 如果真实组件加载成功，渲染真实组件
        return h(EditorComponent.value, {
          ...props,
          ...attrs,
          onUpdateValue: (value: string) => emit('update:value', value),
          onChange: (...args: any[]) => emit('change', ...args),
          onReady: (...args: any[]) => emit('ready', ...args),
          onError: (...args: any[]) => emit('error', ...args),
        });
      };
    },
  });
};

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    // 注册智能客户端组件
    app.component('CodeEditor', createSmartEditor('CodeEditor'));
    app.component('DiffEditor', createSmartEditor('DiffEditor'));
  },
} satisfies Theme;
