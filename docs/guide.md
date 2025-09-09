# Monaco Editor Vue3 完整指南

欢迎使用 Monaco Editor Vue3！这是一个为 Vue 3 应用程序提供 Monaco Editor 集成的强大库。

## 主要特性

### 🚀 Vue 3 原生支持
- 完全基于 Vue 3 Composition API
- TypeScript 类型支持
- 响应式状态管理

### 📝 双编辑器支持
- **CodeEditor**: 单文件代码编辑器
- **DiffEditor**: 代码差异对比编辑器

### 🎨 高度可定制
- 自定义主题和样式
- 可配置的加载和错误组件
- 插槽支持用户完全自定义UI

### 🔧 强大的功能
- 智能代码补全
- 语法高亮
- 错误检测和自动修复
- 多语言支持
- 实时协作功能

### 📱 响应式设计
- 自适应布局
- 移动设备支持
- 灵活的尺寸配置

## 快速开始

### 安装

```bash
# 使用 npm
npm install monaco-editor-vue3 monaco-editor

# 使用 yarn
yarn add monaco-editor-vue3 monaco-editor

# 使用 pnpm
pnpm add monaco-editor-vue3 monaco-editor
```

### 基础使用

```vue
<template>
  <div style="height: 400px;">
    <CodeEditor
      v-model:value="code"
      language="javascript"
      theme="vs-dark"
      :options="editorOptions"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { CodeEditor } from 'monaco-editor-vue3';

const code = ref(`function hello() {
  console.log('Hello, Monaco Editor!');
}`);

const editorOptions = {
  fontSize: 14,
  minimap: { enabled: false },
  automaticLayout: true
};
</script>
```

## 核心概念

### 组件架构

```
Monaco Editor Vue3
├── CodeEditor          # 单文件编辑器
├── DiffEditor          # 差异对比编辑器
├── MonacoLoading       # 加载状态组件
├── MonacoErrorBoundary # 错误边界组件
└── Hooks
    ├── useCodeEditor   # 代码编辑器 Hook
    ├── useDiffEditor   # 差异编辑器 Hook
    ├── useEditorState  # 状态管理 Hook
    └── useEditorLifecycle # 生命周期 Hook
```

### 状态管理

编辑器具有以下状态：

- **Loading**: 编辑器正在加载
- **Ready**: 编辑器已准备就绪
- **Error**: 编辑器遇到错误
- **Destroyed**: 编辑器已销毁

### 事件系统

编辑器支持丰富的事件系统：

```typescript
interface EditorEvents {
  // 生命周期事件
  editorWillMount: () => void;
  editorDidMount: (editor) => void;
  
  // 内容变化事件
  change: (value: string, event) => void;
  'update:value': (value: string) => void;
  
  // 状态事件
  loading: (state: LoadingState) => void;
  error: (error: EditorError) => void;
  ready: () => void;
}
```

## 项目结构

```
monaco-editor-vue3/
├── src/
│   ├── CodeEditor.vue      # 代码编辑器组件
│   ├── DiffEditor.vue      # 差异编辑器组件
│   ├── hook.ts             # 核心 Hooks
│   ├── typing.ts           # TypeScript 类型定义
│   ├── utils.ts            # 工具函数
│   ├── index.ts            # 主入口文件
│   └── components/
│       ├── MonacoLoading.vue     # 加载组件
│       └── MonacoErrorBoundary.vue # 错误边界组件
├── docs/                   # 文档
├── examples/              # 示例
└── tests/                # 测试文件
```

## 下一步

- 查看 [安装指南](./guide/installation.md) 了解详细的安装步骤
- 阅读 [基础使用](./guide/basic-usage.md) 学习基本用法
- 探索 [API 参考](./api/index.md) 了解所有可用的 API
- 查看 [示例集合](./examples/index.md) 获取实用的代码示例

## 社区与支持

- [GitHub 仓库](https://github.com/bazingaedward/monaco-editor-vue3)
- [问题反馈](https://github.com/bazingaedward/monaco-editor-vue3/issues)
- [讨论区](https://github.com/bazingaedward/monaco-editor-vue3/discussions)

---

欢迎为这个项目做出贡献！如果您发现任何问题或有改进建议，请随时提交 issue 或 pull request。
