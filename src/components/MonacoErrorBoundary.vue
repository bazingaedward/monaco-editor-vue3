<template>
  <div class="monaco-error-boundary">
    <div class="monaco-error-content">
      <div class="monaco-error-icon">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="12" r="10" stroke="#dc3545" stroke-width="2"/>
          <path d="m15 9-6 6" stroke="#dc3545" stroke-width="2"/>
          <path d="m9 9 6 6" stroke="#dc3545" stroke-width="2"/>
        </svg>
      </div>
      
      <div class="monaco-error-title">
        Monaco Editor Error
      </div>
      
      <div class="monaco-error-message">
        {{ error.message }}
      </div>
      
      <div v-if="error.details && showDetails" class="monaco-error-details">
        <details>
          <summary>Error Details</summary>
          <pre>{{ error.details }}</pre>
        </details>
      </div>
      
      <div class="monaco-error-actions">
        <button 
          v-if="error.recoverable && showRetry" 
          @click="handleRetry"
          class="monaco-error-button retry"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M21 3v5h-5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M3 21v-5h5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          Retry
        </button>
        
        <button 
          v-if="showReload"
          @click="handleReload"
          class="monaco-error-button reload"
        >
          Reload Page
        </button>
        
        <button 
          v-if="showReport"
          @click="handleReport"
          class="monaco-error-button report"
        >
          Report Issue
        </button>
      </div>
      
      <div v-if="errorCode" class="monaco-error-code">
        Error Code: {{ errorCode }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { EditorError } from '../typing';

interface Props {
  error: EditorError;
  showDetails?: boolean;
  showRetry?: boolean;
  showReload?: boolean;
  showReport?: boolean;
}

interface Emits {
  retry: [];
  reload: [];
  report: [error: EditorError];
}

const props = withDefaults(defineProps<Props>(), {
  showDetails: true,
  showRetry: true,
  showReload: false,
  showReport: false
});

const emit = defineEmits<Emits>();

const errorCode = computed(() => props.error.code);

const handleRetry = () => {
  emit('retry');
};

const handleReload = () => {
  if (typeof window !== 'undefined') {
    window.location.reload();
  }
  emit('reload');
};

const handleReport = () => {
  emit('report', props.error);
};
</script>

<style scoped>
.monaco-error-boundary {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  min-height: 200px;
  background-color: #fff5f5;
  border: 1px solid #feb2b2;
  border-radius: 4px;
  padding: 20px;
}

.monaco-error-content {
  text-align: center;
  max-width: 500px;
}

.monaco-error-icon {
  margin-bottom: 16px;
}

.monaco-error-title {
  font-size: 18px;
  font-weight: 600;
  color: #c53030;
  margin-bottom: 12px;
}

.monaco-error-message {
  font-size: 14px;
  color: #4a5568;
  margin-bottom: 16px;
  line-height: 1.5;
}

.monaco-error-details {
  margin-bottom: 20px;
  text-align: left;
}

.monaco-error-details summary {
  cursor: pointer;
  font-weight: 500;
  color: #4a5568;
  margin-bottom: 8px;
}

.monaco-error-details pre {
  background-color: #f7fafc;
  border: 1px solid #e2e8f0;
  border-radius: 4px;
  padding: 12px;
  font-size: 12px;
  color: #2d3748;
  overflow-x: auto;
  white-space: pre-wrap;
  word-break: break-word;
}

.monaco-error-actions {
  display: flex;
  gap: 12px;
  justify-content: center;
  flex-wrap: wrap;
  margin-bottom: 16px;
}

.monaco-error-button {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.monaco-error-button.retry {
  background-color: #3182ce;
  color: white;
}

.monaco-error-button.retry:hover {
  background-color: #2c5aa0;
}

.monaco-error-button.reload {
  background-color: #38a169;
  color: white;
}

.monaco-error-button.reload:hover {
  background-color: #2f855a;
}

.monaco-error-button.report {
  background-color: #a0aec0;
  color: white;
}

.monaco-error-button.report:hover {
  background-color: #718096;
}

.monaco-error-code {
  font-size: 12px;
  color: #a0aec0;
  font-family: monospace;
}
</style>
