<template>
  <div>
    <div>
      <div>
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="12" r="10" stroke="#dc3545" stroke-width="2"/>
          <path d="m15 9-6 6" stroke="#dc3545" stroke-width="2"/>
          <path d="m9 9 6 6" stroke="#dc3545" stroke-width="2"/>
        </svg>
      </div>
      <div>Monaco Editor Error</div>
      <div>{{ error.message }}</div>
      <div v-if="error.details && showDetails">
        <details>
          <summary>Error Details</summary>
          <pre>{{ error.details }}</pre>
        </details>
      </div>
      <div>
        <button v-if="error.recoverable && showRetry" @click="handleRetry">Retry</button>
        <button v-if="showReload" @click="handleReload">Reload Page</button>
        <button v-if="showReport" @click="handleReport">Report Issue</button>
      </div>
      <div v-if="errorCode">Error Code: {{ errorCode }}</div>
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
