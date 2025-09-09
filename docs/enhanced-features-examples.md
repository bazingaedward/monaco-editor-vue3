# Monaco Editor Vue3 - 增强功能示例

## 基础使用（带错误处理和加载状态）

### CodeEditor 示例

```vue
<template>
  <div>
    <h3>Code Editor with Enhanced Features</h3>
    
    <!-- 基础使用 -->
    <CodeEditor
      v-model:value="code"
      language="javascript"
      theme="vs-dark"
      :height="400"
      :lifecycle="lifecycleHooks"
      @error="handleError"
      @ready="handleReady"
      @loading="handleLoading"
    />
    
    <!-- 显示状态 -->
    <div v-if="editorError" class="error-info">
      <h4>Error: {{ editorError.code }}</h4>
      <p>{{ editorError.message }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { CodeEditor, type EditorLifecycleHooks, type EditorError } from 'monaco-editor-vue3';

const code = ref(`function hello() {
  console.log('Hello Monaco Editor Vue3!');
  return 'Welcome to enhanced editor!';
}`);

const editorError = ref<EditorError | null>(null);

// 生命周期钩子
const lifecycleHooks: EditorLifecycleHooks = {
  beforeCreate: async () => {
    console.log('Editor will be created...');
  },
  onCreated: (editor) => {
    console.log('Editor created:', editor);
  },
  onReady: (editor) => {
    console.log('Editor is ready:', editor);
  },
  onError: (error) => {
    console.error('Lifecycle error:', error);
  }
};

const handleError = (error: EditorError | null) => {
  editorError.value = error;
  if (error) {
    console.error('Editor error:', error);
  }
};

const handleReady = () => {
  console.log('Editor is ready for use');
};

const handleLoading = (loadingState: any) => {
  console.log('Loading state:', loadingState);
};
</script>
```

### DiffEditor 示例

```vue
<template>
  <div>
    <h3>Diff Editor with Enhanced Features</h3>
    
    <DiffEditor
      v-model:value="modifiedCode"
      :original="originalCode"
      language="typescript"
      theme="vs"
      :height="400"
      :lifecycle="lifecycleHooks"
      loading-text="Loading diff editor..."
      :show-progress="true"
      @error="handleDiffError"
      @ready="handleDiffReady"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { DiffEditor, type EditorLifecycleHooks } from 'monaco-editor-vue3';

const originalCode = ref(`interface User {
  id: number;
  name: string;
}`);

const modifiedCode = ref(`interface User {
  id: number;
  name: string;
  email: string;
  createdAt: Date;
}`);

const lifecycleHooks: EditorLifecycleHooks = {
  onReady: (editor) => {
    console.log('Diff editor ready');
  }
};

const handleDiffError = (error: any) => {
  console.error('Diff editor error:', error);
};

const handleDiffReady = () => {
  console.log('Diff editor is ready');
};
</script>
```

## 高级功能示例

### 使用 Hooks

```vue
<template>
  <div>
    <div ref="container" style="height: 400px; border: 1px solid #ccc;"></div>
    
    <div v-if="loading.isLoading" class="loading">
      Loading: {{ loading.progress }}%
    </div>
    
    <div v-if="error" class="error">
      Error: {{ error.message }}
      <button @click="retry">Retry</button>
    </div>
    
    <button v-if="isReady" @click="destroy">Destroy Editor</button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useCodeEditor, type EditorLifecycleHooks } from 'monaco-editor-vue3';

const container = ref<HTMLElement>();

const props = {
  value: 'console.log("Hello from hook!");',
  language: 'javascript',
  theme: 'vs-dark',
  lifecycle: {
    onReady: (editor: any) => {
      console.log('Hook: Editor ready', editor);
    }
  } as EditorLifecycleHooks
};

const emit = (event: string, ...args: any[]) => {
  console.log('Event:', event, args);
};

const { loading, error, isReady, retry, destroy } = useCodeEditor(props, emit);
</script>
```

### 错误处理组件单独使用

```vue
<template>
  <div>
    <MonacoErrorBoundary
      :error="sampleError"
      @retry="handleRetry"
      @report="handleReport"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { MonacoErrorBoundary, createEditorError } from 'monaco-editor-vue3';

const sampleError = ref(createEditorError(
  'DEMO_ERROR',
  'This is a demonstration error',
  'Stack trace would appear here...',
  true
));

const handleRetry = () => {
  console.log('User clicked retry');
  sampleError.value = null;
};

const handleReport = (error: any) => {
  console.log('Report error:', error);
};
</script>
```

## 工具函数使用

```typescript
import { 
  createEditorError,
  safeAsyncExecution,
  isMonacoAvailable,
  waitForMonaco,
  validateEditorOptions 
} from 'monaco-editor-vue3';

// 创建标准错误
const error = createEditorError(
  'CUSTOM_ERROR',
  'Something went wrong',
  'Additional details here'
);

// 安全执行异步操作
const { success, data, error: execError } = await safeAsyncExecution(
  async () => {
    // 一些可能失败的异步操作
    return await fetch('/api/editor-config');
  },
  'CONFIG_LOAD_ERROR',
  'Failed to load editor configuration'
);

// 检查 Monaco 可用性
if (isMonacoAvailable()) {
  console.log('Monaco is ready');
} else {
  await waitForMonaco(5000); // 等待最多5秒
}

// 验证编辑器选项
const options = { value: 'test', language: 'javascript' };
const validationError = validateEditorOptions(options);
if (validationError) {
  console.error('Invalid options:', validationError);
}
```
