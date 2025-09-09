# 自定义 Loading 和 Error 组件

Monaco Editor Vue3 组件支持用户完全自定义加载状态和错误状态的显示。

## 基本用法

### 使用默认组件

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

## 插槽参数

### Loading 插槽参数

- `loading`: 完整的加载状态对象
  - `stage`: 当前加载阶段
  - `progress`: 加载进度 (0-100)
  - `loadingText`: 加载文本
- `loadingText`: 加载文本（props 中的或默认的）
- `progress`: 当前进度
- `showProgress`: 是否显示进度

### Error 插槽参数

- `error`: 错误对象
  - `message`: 错误消息
  - `details`: 错误详情
  - `code`: 错误代码
  - `recoverable`: 是否可恢复
- `retry`: 重试函数
- `retryable`: 是否可重试

## 配置选项

### CodeEditor & DiffEditor Props

- `loadingText?: string` - 自定义加载文本
- `showProgress?: boolean` - 是否显示进度条（默认 true）
- `showErrorBoundary?: boolean` - 是否显示错误边界（默认 true）
- `retryable?: boolean` - 是否允许重试（默认 true）
- `useDefaultLoading?: boolean` - 是否使用默认加载组件（默认 true）
- `useDefaultErrorBoundary?: boolean` - 是否使用默认错误组件（默认 true）

### 事件

- `@loading` - 加载状态变化时触发
- `@error` - 错误状态变化时触发
- `@ready` - 编辑器准备就绪时触发

## 最佳实践

1. **渐进式增强**: 先使用默认组件，再根据需要自定义
2. **状态管理**: 利用插槽参数获取完整的状态信息
3. **错误处理**: 提供用户友好的错误信息和恢复选项
4. **性能考虑**: 自定义组件应该保持轻量级
5. **可访问性**: 确保自定义组件支持键盘导航和屏幕阅读器
