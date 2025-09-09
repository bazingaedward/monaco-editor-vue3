<template>
  <div class="monaco-loading-container">
    <div class="monaco-loading-content">
      <div class="monaco-loading-spinner">
        <div class="spinner"></div>
      </div>
      <div class="monaco-loading-text">{{ loadingText }}</div>
      <div v-if="showProgress" class="monaco-loading-progress">
        <div class="progress-bar">
          <div 
            class="progress-fill" 
            :style="{ width: `${progress}%` }"
          ></div>
        </div>
        <div class="progress-text">{{ progress }}%</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  loadingText?: string;
  progress?: number;
  showProgress?: boolean;
}

withDefaults(defineProps<Props>(), {
  loadingText: 'Loading Monaco Editor...',
  progress: 0,
  showProgress: true
});
</script>

<style scoped>
.monaco-loading-container {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  min-height: 200px;
  background-color: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 4px;
}

.monaco-loading-content {
  text-align: center;
  color: #6c757d;
}

.monaco-loading-spinner {
  margin-bottom: 16px;
}

.spinner {
  width: 32px;
  height: 32px;
  border: 3px solid #e9ecef;
  border-top: 3px solid #0066cc;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.monaco-loading-text {
  font-size: 14px;
  margin-bottom: 16px;
}

.monaco-loading-progress {
  width: 200px;
  margin: 0 auto;
}

.progress-bar {
  width: 100%;
  height: 4px;
  background-color: #e9ecef;
  border-radius: 2px;
  overflow: hidden;
  margin-bottom: 8px;
}

.progress-fill {
  height: 100%;
  background-color: #0066cc;
  border-radius: 2px;
  transition: width 0.3s ease;
}

.progress-text {
  font-size: 12px;
  color: #868e96;
}
</style>
