# Monaco Editor Vue3

Monaco Editor Vue3 是一个基于微软 Monaco Editor（为 Visual Studio Code 提供动力的编辑器）构建的功能强大的 Vue 3 代码编辑器组件。

## 特性

- 🎯 **完整的 TypeScript 支持** - 使用 TypeScript 构建，提供更好的开发体验
- 🎨 **丰富的代码编辑功能** - 语法高亮、自动完成和智能感知
- 🌍 **多语言支持** - 支持 20+ 种编程语言
- 🎭 **主题定制** - 内置主题（VS、VS Dark、高对比度）
- 🔄 **双向绑定** - 完整的 v-model 支持
- 📦 **轻量级** - 可摇树优化，生产环境优化
- 🛠 **开发者友好** - 全面的错误处理和加载状态
- 🎪 **高级功能** - 差异编辑器、自定义组件、生命周期钩子

## 快速开始

### 安装

```bash
npm install monaco-editor-vue3
# 或
yarn add monaco-editor-vue3
# 或
pnpm add monaco-editor-vue3
```

### 基础用法

```vue
<template>
  <div>
    <CodeEditor
      v-model:value="code"
      language="javascript"
      theme="vs-dark"
      :height="400"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { CodeEditor } from 'monaco-editor-vue3';

const code = ref(`function hello() {
  console.log('Hello Monaco Editor Vue3!');
}`);
</script>
```

### 差异编辑器

```vue
<template>
  <DiffEditor
    :original="originalCode"
    v-model:value="modifiedCode"
    language="typescript"
    :height="400"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { DiffEditor } from 'monaco-editor-vue3';

const originalCode = ref('const x = 1;');
const modifiedCode = ref('const x = 2;');
</script>
```

## 为什么选择 Monaco Editor Vue3？

### 🚀 性能优化

- Monaco Editor 懒加载
- Web Workers 进行语法处理
- 最小的包体积影响
- 高效的内存管理

### 🛡️ 强大的错误处理

- 全面的错误边界
- 优雅的降级处理
- 重试机制
- 用户友好的错误消息

### 🎨 高度可定制

- 自定义加载组件
- 自定义错误组件
- 灵活的主题系统
- 通过钩子扩展

### 📚 开发体验

- 完整的 TypeScript 定义
- 全面的文档
- 丰富的示例和指南
- 活跃的社区支持

## 示例

探索我们的全面示例，了解 Monaco Editor Vue3 的实际应用：

- [基础示例](/zh/examples/basic) - 常见用例入门
- [加载和错误处理](/zh/examples/loading-and-errorboundary) - 高级状态管理
- [API 文档](/zh/api) - 完整的 API 文档

## 浏览器支持

Monaco Editor Vue3 支持所有现代浏览器：

- Chrome >= 63
- Firefox >= 78
- Safari >= 12
- Edge >= 79

## 许可证

MIT 许可证 - 查看 [LICENSE](https://github.com/bazingaedward/monaco-editor-vue3/blob/main/LICENSE) 了解详情。

## 贡献

我们欢迎贡献！请查看我们的[贡献指南](https://github.com/bazingaedward/monaco-editor-vue3/blob/main/CONTRIBUTING.md)了解详情。
