// .vitepress/theme/index.ts
import type { Theme } from 'vitepress';
import DefaultTheme from 'vitepress/theme';
import { setupMonacoWorkers } from '../workers';
import { CodeEditor, DiffEditor} from '../../../src/index'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    // 注册客户端安全的组件 - 使用 ClientOnly 包装
    app.component('CodeEditor', CodeEditor);

    app.component('DiffEditor', DiffEditor);

    // 设置 Monaco Editor Workers
    setupMonacoWorkers();
  },
} satisfies Theme;
