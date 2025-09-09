# 加载状态和错误边界

本页面展示了 Monaco Editor Vue3 组件的高级功能，包括加载状态管理、错误处理、生命周期钩子等增强特性。

## 概述

Monaco Editor Vue3 提供了完整的状态管理和错误处理机制：

- **加载状态管理**: 显示编辑器加载进度和状态
- **错误边界**: 捕获和处理编辑器运行时错误
- **生命周期钩子**: 在编辑器不同阶段执行自定义逻辑
- **重试机制**: 允许用户在出现错误时重新加载
- **Hook API**: 提供底层 API 用于自定义实现

## 1. 基础使用（带错误处理和加载状态）

### CodeEditor 增强示例

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

### DiffEditor 增强示例

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

## 2. 高级功能示例

### 直接使用 Hook API

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

## 3. 自定义 Loading 和 Error 组件

Monaco Editor Vue3 组件支持用户完全自定义加载状态和错误状态的显示。

### 使用默认组件配置

```vue
<template>
  <CodeEditor
    v-model:value="code"
    :loading-text="'正在加载编辑器...'"
    :show-progress="true"
    :show-error-boundary="true"
    :retryable="true"
  />
</template>
```

### 自定义加载组件

```vue
<template>
  <CodeEditor v-model:value="code">
    <template #loading="{ loading, loadingText, progress, showProgress }">
      <div class="my-custom-loading">
        <div class="custom-spinner">🔄</div>
        <h3>{{ loadingText }}</h3>
        <div v-if="showProgress" class="progress-info">
          <span>进度: {{ progress }}%</span>
          <div class="custom-progress-bar">
            <div 
              class="progress-fill" 
              :style="{ width: `${progress}%` }"
            ></div>
          </div>
        </div>
        <p>状态: {{ loading.stage }}</p>
      </div>
    </template>
  </CodeEditor>
</template>

<style scoped>
.my-custom-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.custom-spinner {
  font-size: 2rem;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.custom-progress-bar {
  width: 200px;
  height: 6px;
  background: rgba(255,255,255,0.3);
  border-radius: 3px;
  overflow: hidden;
  margin-top: 8px;
}

.progress-fill {
  height: 100%;
  background: #4CAF50;
  transition: width 0.3s ease;
}
</style>
```

### 自定义错误组件

```vue
<template>
  <CodeEditor v-model:value="code">
    <template #error="{ error, retry, retryable }">
      <div class="my-custom-error">
        <div class="error-icon">❌</div>
        <h3>编辑器加载失败</h3>
        <p class="error-message">{{ error.message }}</p>
        
        <div v-if="error.details" class="error-details">
          <details>
            <summary>查看详细信息</summary>
            <pre>{{ error.details }}</pre>
          </details>
        </div>
        
        <div class="error-actions">
          <button 
            v-if="retryable" 
            @click="retry" 
            class="retry-btn"
          >
            🔄 重新尝试
          </button>
          <button @click="reportError" class="report-btn">
            📧 报告问题
          </button>
        </div>
        
        <div v-if="error.code" class="error-code">
          错误代码: {{ error.code }}
        </div>
      </div>
    </template>
  </CodeEditor>
</template>

<script setup>
const reportError = () => {
  // 实现错误报告逻辑
  console.log('报告错误...');
};
</script>

<style scoped>
.my-custom-error {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  background: #fff5f5;
  border: 2px dashed #feb2b2;
  padding: 2rem;
  text-align: center;
}

.error-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.error-message {
  color: #c53030;
  margin: 1rem 0;
}

.error-actions {
  display: flex;
  gap: 1rem;
  margin: 1rem 0;
}

.retry-btn, .report-btn {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
}

.retry-btn {
  background: #48bb78;
  color: white;
}

.report-btn {
  background: #4299e1;
  color: white;
}

.error-code {
  font-family: monospace;
  font-size: 0.875rem;
  color: #718096;
  margin-top: 1rem;
}
</style>
```

### 完全禁用默认组件

如果你想完全使用自定义组件而不显示任何默认组件：

```vue
<template>
  <CodeEditor 
    v-model:value="code"
    :use-default-loading="false"
    :use-default-error-boundary="false"
  >
    <template #loading="{ loading }">
      <MyCustomLoadingComponent :loading-state="loading" />
    </template>
    
    <template #error="{ error, retry }">
      <MyCustomErrorComponent :error="error" @retry="retry" />
    </template>
  </CodeEditor>
</template>
```

### 插槽参数说明

#### Loading 插槽参数

- `loading`: 完整的加载状态对象
  - `stage`: 当前加载阶段
  - `progress`: 加载进度 (0-100)
  - `loadingText`: 加载文本
- `loadingText`: 加载文本（props 中的或默认的）
- `progress`: 当前进度
- `showProgress`: 是否显示进度

#### Error 插槽参数

- `error`: 错误对象
  - `message`: 错误消息
  - `details`: 错误详情
  - `code`: 错误代码
  - `recoverable`: 是否可恢复
- `retry`: 重试函数
- `retryable`: 是否可重试

### 配置选项

#### CodeEditor & DiffEditor Props

- `loadingText?: string` - 自定义加载文本
- `showProgress?: boolean` - 是否显示进度条（默认 true）
- `showErrorBoundary?: boolean` - 是否显示错误边界（默认 true）
- `retryable?: boolean` - 是否允许重试（默认 true）
- `useDefaultLoading?: boolean` - 是否使用默认加载组件（默认 true）
- `useDefaultErrorBoundary?: boolean` - 是否使用默认错误组件（默认 true）

#### 相关事件

- `@loading` - 加载状态变化时触发
- `@error` - 错误状态变化时触发
- `@ready` - 编辑器准备就绪时触发

## 4. 工具函数使用示例

以下展示了一些实用的工具函数，可以帮助你更好地处理 Monaco Editor 的各种场景：

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

## 5. 最佳实践

1. **渐进式增强**: 先使用默认组件，再根据需要自定义
2. **状态管理**: 利用插槽参数获取完整的状态信息
3. **错误处理**: 提供用户友好的错误信息和恢复选项
4. **性能考虑**: 自定义组件应该保持轻量级
5. **可访问性**: 确保自定义组件支持键盘导航和屏幕阅读器
