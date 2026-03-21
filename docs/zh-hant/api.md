# API 文档

本页面提供 Monaco Editor Vue3 组件的完整 API 文档。

## CodeEditor 组件

### 属性 (Props)

| 属性 | 类型 | 默认值 | 描述 |
|----------|------|---------|-------------|
| `value` | `string` | `''` | 编辑器的值 |
| `language` | `string` | `'javascript'` | 用于语法高亮的编程语言 |
| `theme` | `string` | `'vs'` | 编辑器主题 (`'vs'`, `'vs-dark'`, `'hc-black'`, `'hc-light'`) |
| `width` | `string \| number` | `'100%'` | 编辑器宽度 |
| `height` | `string \| number` | `'100%'` | 编辑器高度 |
| `options` | `EditorOptions` | `{}` | Monaco 编辑器选项 |
| `loadingText` | `string` | `undefined` | 自定义加载文本 |
| `showProgress` | `boolean` | `true` | 显示加载进度 |
| `showErrorBoundary` | `boolean` | `true` | 显示错误边界 |
| `retryable` | `boolean` | `true` | 允许重试错误 |
| `lifecycle` | `EditorLifecycleHooks` | `undefined` | 生命周期钩子 |
| `useDefaultLoading` | `boolean` | `true` | 使用默认加载组件 |
| `useDefaultErrorBoundary` | `boolean` | `true` | 使用默认错误边界组件 |

### 事件 (Events)

| 事件 | 参数 | 描述 |
|-------|---------|-------------|
| `editorWillMount` | `()` | 编辑器挂载前触发 |
| `editorDidMount` | `(editor: IStandaloneCodeEditor)` | 编辑器挂载后触发 |
| `change` | `(value: string, event: IModelContentChangedEvent)` | 内容变化时触发 |
| `update:value` | `(value: string)` | 用于 v-model 支持 |
| `error` | `(error: EditorError \| null)` | 发生错误时触发 |
| `ready` | `()` | 编辑器准备就绪时触发 |
| `loading` | `(loading: EditorLoadingState)` | 加载状态变化时触发 |

### 插槽 (Slots)

#### `loading`

自定义加载组件插槽。

**插槽属性:**
- `loading: EditorLoadingState` - 完整的加载状态对象
- `loadingText: string` - 加载文本
- `progress: number` - 加载进度 (0-100)
- `showProgress: boolean` - 是否显示进度

#### `error`

自定义错误组件插槽。

**插槽属性:**
- `error: EditorError` - 错误对象
- `retry: () => void` - 重试函数
- `retryable: boolean` - 是否允许重试

## DiffEditor 组件

### 属性 (Props)

| 属性 | 类型 | 默认值 | 描述 |
|----------|------|---------|-------------|
| `value` | `string` | `''` | 修改后的值 |
| `original` | `string` | `''` | 原始值 |
| `language` | `string` | `'javascript'` | 编程语言 |
| `theme` | `string` | `'vs'` | 编辑器主题 |
| `width` | `string \| number` | `'100%'` | 编辑器宽度 |
| `height` | `string \| number` | `'100%'` | 编辑器高度 |
| `options` | `EditorOptions` | `{}` | Monaco 编辑器选项 |
| `loadingText` | `string` | `undefined` | 自定义加载文本 |
| `showProgress` | `boolean` | `true` | 显示加载进度 |
| `showErrorBoundary` | `boolean` | `true` | 显示错误边界 |
| `retryable` | `boolean` | `true` | 允许重试错误 |
| `lifecycle` | `EditorLifecycleHooks` | `undefined` | 生命周期钩子 |
| `useDefaultLoading` | `boolean` | `true` | 使用默认加载组件 |
| `useDefaultErrorBoundary` | `boolean` | `true` | 使用默认错误边界组件 |

### 事件 (Events)

与 CodeEditor 相同，除了：

| 事件 | 参数 | 描述 |
|-------|---------|-------------|
| `editorDidMount` | `(editor: IStandaloneDiffEditor)` | 差异编辑器挂载后触发 |

### 插槽 (Slots)

与 CodeEditor 相同。

## Hooks

### `useCodeEditor`

```typescript
function useCodeEditor(
  props: CodeEditorProps & { lifecycle?: EditorLifecycleHooks },
  emit: (event: string, ...args: unknown[]) => void
): UseCodeEditorReturn
```

用于创建代码编辑器的组合式 API Hook。

**参数:**
- `props` - 编辑器属性和生命周期钩子
- `emit` - Vue 的 emit 函数

**返回值:**
- `editorRef` - 编辑器容器的引用
- `editor` - Monaco 编辑器实例
- `loading` - 加载状态
- `error` - 错误状态
- `retry` - 重试函数

### `useDiffEditor`

```typescript
function useDiffEditor(
  props: DiffEditorProps & { lifecycle?: EditorLifecycleHooks },
  emit: (event: string, ...args: unknown[]) => void
): UseDiffEditorReturn
```

用于创建差异编辑器的组合式 API Hook。

**参数:**
- `props` - 差异编辑器属性和生命周期钩子
- `emit` - Vue 的 emit 函数

**返回值:**
- `editorRef` - 编辑器容器的引用
- `editor` - Monaco 差异编辑器实例
- `loading` - 加载状态
- `error` - 错误状态
- `retry` - 重试函数

## 类型定义

### `EditorOptions`

Monaco 编辑器的选项类型，继承自 `monaco.editor.IStandaloneEditorConstructionOptions`。

### `EditorError`

```typescript
interface EditorError {
  message: string;
  stack?: string;
  code?: string;
  type: 'loading' | 'runtime' | 'initialization';
}
```

### `EditorLoadingState`

```typescript
interface EditorLoadingState {
  loading: boolean;
  progress: number;
  message?: string;
  stage: 'init' | 'loading' | 'mounting' | 'ready';
}
```

### `EditorLifecycleHooks`

```typescript
interface EditorLifecycleHooks {
  onWillMount?: () => void;
  onDidMount?: (editor: IStandaloneCodeEditor | IStandaloneDiffEditor) => void;
  onWillUnmount?: () => void;
  onDidUnmount?: () => void;
  onError?: (error: EditorError) => void;
  onReady?: () => void;
}
```

## 示例

### 基础用法

```vue
<template>
  <CodeEditor
    v-model:value="code"
    language="typescript"
    theme="vs-dark"
    :height="400"
    :options="editorOptions"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { CodeEditor, type EditorOptions } from 'monaco-editor-vue3';

const code = ref('console.log("Hello World!");');

const editorOptions: EditorOptions = {
  fontSize: 14,
  minimap: { enabled: false },
  scrollBeyondLastLine: false,
};
</script>
```

### 自定义加载和错误处理

```vue
<template>
  <CodeEditor
    v-model:value="code"
    language="javascript"
    :use-default-loading="false"
    :use-default-error-boundary="false"
    @loading="handleLoading"
    @error="handleError"
  >
    <template #loading="{ loading, progress }">
      <div class="custom-loading">
        加载中... {{ progress }}%
      </div>
    </template>
    
    <template #error="{ error, retry }">
      <div class="custom-error">
        <p>出错了: {{ error.message }}</p>
        <button @click="retry">重试</button>
      </div>
    </template>
  </CodeEditor>
</template>
```

### 使用 Hooks

```vue
<template>
  <div ref="editorRef"></div>
</template>

<script setup lang="ts">
import { useCodeEditor } from 'monaco-editor-vue3';

const props = {
  value: 'console.log("Hello from hook!");',
  language: 'javascript',
  theme: 'vs-dark',
  height: 400,
};

const emit = defineEmits(['change', 'ready']);

const { editorRef, editor, loading, error, retry } = useCodeEditor(props, emit);
</script>
```
