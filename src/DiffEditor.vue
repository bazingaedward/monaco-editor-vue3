<template>
  <div ref="editorContainer" :style="style">
    <!-- 自定义加载状态插槽 -->
    <slot
      v-if="!isReady && !error"
      name="loading"
      :loading="loading"
      :loading-text="loadingText || loading.loadingText"
      :progress="loading.progress"
      :show-progress="showProgress"
    >
      <!-- 默认加载组件 -->
      <MonacoLoading 
        v-if="useDefaultLoading"
        :loading-text="loadingText || loading.loadingText"
        :progress="loading.progress"
        :show-progress="showProgress"
      />
    </slot>
    
    <!-- 自定义错误状态插槽 -->
    <slot
      v-else-if="error && showErrorBoundary"
      name="error"
      :error="error"
      :retry="handleRetry"
      :retryable="retryable"
    >
      <!-- 默认错误组件 -->
      <MonacoErrorBoundary 
        v-if="useDefaultErrorBoundary"
        :error="error"
        :show-retry="retryable"
        :show-details="true"
        :show-reload="false"
        :show-report="false"
        @retry="handleRetry"
      />
    </slot>
    
    <!-- 编辑器容器 -->
    <div 
      ref="container" 
      :style="{ width: '100%', height: '100%', visibility: isReady && !error ? 'visible' : 'hidden' }"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, toRefs, watch } from 'vue';
import { useDiffEditor } from './hook';
import type { DiffEditorProps, EditorLifecycleHooks } from './typing';
import { formatSize } from './utils';
import MonacoLoading from './components/MonacoLoading.vue';
import MonacoErrorBoundary from './components/MonacoErrorBoundary.vue';

interface Props extends DiffEditorProps {
  loadingText?: string;
  showProgress?: boolean;
  showErrorBoundary?: boolean;
  retryable?: boolean;
  lifecycle?: EditorLifecycleHooks;
  // 允许用户禁用默认组件，完全使用自定义插槽
  useDefaultLoading?: boolean;
  useDefaultErrorBoundary?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  width: '100%',
  height: '100%',
  language: 'javascript',
  theme: 'vs',
  value: '',
  original: '',
  options: () => ({}),
  showProgress: true,
  showErrorBoundary: true,
  retryable: true,
  useDefaultLoading: true,
  useDefaultErrorBoundary: true,
});

const emit = defineEmits(['editorWillMount', 'editorDidMount', 'change', 'update:value', 'error', 'ready', 'loading']);

const { container, loading, error, isReady, retry } = useDiffEditor(props, emit);

const { width, height } = toRefs(props);

const style = computed(() => ({
  width: formatSize(width.value),
  height: formatSize(height.value),
  textAlign: 'left' as const,
  position: 'relative' as const,
}));

const handleRetry = () => {
  retry();
  emit('error', null); // 清除错误状态
};

// 监听状态变化并发射事件
watch(
  loading,
  (newLoading) => {
    emit('loading', newLoading);
  },
  { deep: true }
);

watch(error, (newError) => {
  emit('error', newError);
});

watch(isReady, (ready) => {
  if (ready) {
    emit('ready');
  }
});
</script>
