import { defineAsyncComponent } from 'vue';

// 客户端组件，仅在浏览器环境中加载
export const CodeEditor = defineAsyncComponent(async () => {
  if (typeof window === 'undefined') {
    // SSR 环境，返回一个占位符组件
    return {
      template: '<div class="monaco-editor-placeholder">Monaco Editor (Client Only)</div>',
    };
  }

  // 浏览器环境，动态导入打包产物
  const { CodeEditor } = await import('../../../dist/index.mjs');
  return CodeEditor;
});

export const DiffEditor = defineAsyncComponent(async () => {
  if (typeof window === 'undefined') {
    return {
      template: '<div class="monaco-editor-placeholder">Monaco Diff Editor (Client Only)</div>',
    };
  }

  const { DiffEditor } = await import('../../../dist/index.mjs');
  return DiffEditor;
});
