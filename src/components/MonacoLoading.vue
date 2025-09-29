<template>
  <div>
    <div>
      <div>
        <div></div>
      </div>
      <div>{{ loadingText }}</div>
      <div v-if="showProgress">
        <div>
          <div :style="{ width: `${progress}%` }"></div>
        </div>
        <div>{{ progress }}%</div>
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
