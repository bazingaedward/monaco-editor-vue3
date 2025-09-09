// .vitepress/theme/index.ts
import type { Theme } from 'vitepress';
import DefaultTheme from 'vitepress/theme';
import { CodeEditor, DiffEditor } from '../../../src/index.ts';

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    // 注册客户端安全的组件
    app.component('CodeEditor', CodeEditor);
    app.component('DiffEditor', DiffEditor);

    // 在客户端环境中设置 Monaco Environment
    if (typeof window !== 'undefined') {
      // 设置 Monaco Environment (简化版本，避免 worker 问题)
      (window as unknown as Record<string, unknown>).MonacoEnvironment = {
        getWorkerUrl: (): string => {
          // 返回一个空的 worker，避免加载问题
          return 'data:text/javascript;charset=utf-8,';
        },
      };
    }
  },
} satisfies Theme;
