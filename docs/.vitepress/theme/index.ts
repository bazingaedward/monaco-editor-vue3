// .vitepress/theme/index.ts
import type { Theme } from 'vitepress';
import DefaultTheme from 'vitepress/theme';
import { defineComponent, h, onMounted, ref } from 'vue';
import './style.css';
import '../../../dist/style.css';

// 声明 window.monaco 和 window.require 类型
declare global {
  interface Window {
    monaco?: unknown;
    require?: unknown;
  }
}

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
          const module = await import('../../../dist/index.mjs');
          EditorComponent.value = module[editorType];
          hasError.value = false;
        } catch (error) {
          console.warn(error);
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
          onChange: (...args: unknown[]) => emit('change', ...args),
          onReady: (...args: unknown[]) => emit('ready', ...args),
          onError: (...args: unknown[]) => emit('error', ...args),
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
