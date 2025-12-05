<template>
  <div ref="editorContainer" :style="editorWrapperStyle" class="monaco-code-editor">
    <!-- Custom loading state slot -->
    <slot
      v-if="!isReady && !error"
      name="loading"
      :loading="loading"
      :loading-text="loadingText || loading.loadingText"
      :progress="loading.progress"
      :show-progress="showProgress"
    >
      <!-- Default loading component -->
      <MonacoLoading 
        v-if="useDefaultLoading"
        :loading-text="loadingText || loading.loadingText"
        :progress="loading.progress"
        :show-progress="showProgress"
      />
    </slot>
    
    <!-- Custom error state slot -->
    <slot
      v-else-if="error && showErrorBoundary"
      name="error"
      :error="error"
      :retry="handleRetry"
      :retryable="retryable"
    >
      <!-- Default error component -->
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
    <!-- Editor container -->
    <div 
      ref="container" 
      :style="editorContainerStyle"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, toRefs, watch } from 'vue';
import { useCodeEditor } from './hook';
import type { CodeEditorProps, EditorLifecycleHooks } from './typing';
import { formatSize } from './utils';
import MonacoLoading from './components/MonacoLoading.vue';
import MonacoErrorBoundary from './components/MonacoErrorBoundary.vue';

interface Props extends CodeEditorProps {
  loadingText?: string;
  showProgress?: boolean;
  showErrorBoundary?: boolean;
  retryable?: boolean;
  lifecycle?: EditorLifecycleHooks;
  // Allow users to disable default components and use custom slots completely
  useDefaultLoading?: boolean;
  useDefaultErrorBoundary?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  width: '100%',
  height: '100%',
  language: 'javascript',
  theme: 'vs',
  value: '',
  options: () => ({}),
  showProgress: true,
  showErrorBoundary: true,
  retryable: true,
  useDefaultLoading: true,
  useDefaultErrorBoundary: true,
});

const emit = defineEmits(['editorWillMount', 'editorDidMount', 'change', 'update:value', 'error', 'ready', 'loading']);

const { container, loading, error, isReady, retry } = useCodeEditor(props, emit);

const { width, height } = toRefs(props);

const editorWrapperStyle = computed(() => ({
  width: formatSize(width.value),
  height: formatSize(height.value),
  textAlign: 'left' as const,
  position: 'relative' as const,
}));

const editorContainerStyle = computed(() => ({
  width: '100%',
  height: '100%',
  visibility: isReady.value && !error.value ? 'visible' : 'hidden',
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
