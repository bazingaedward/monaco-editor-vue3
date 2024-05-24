<template>
  <div ref="container" :style="style"></div>
</template>

<script setup lang="ts">
import { CodeEditorProps } from './typing';
import { useCodeEditor } from './hook';

const props = withDefaults(defineProps<CodeEditorProps>(), {
  width: '100%',
  height: '100%',
  language: 'javascript',
  theme: 'vs',
  value: '',
  options: () => ({}),
});

const emit = defineEmits(['editorWillMount', 'editorDidMount', 'change', 'update:value']);

const { container } = useCodeEditor(props, emit);

const { width, height } = toRefs(props);

const style = computed(() => {
  const fixedWidth = width.value.toString().includes('%') ? width.value : `${width.value}px`;
  const fixedHeight = height.value.toString().includes('%') ? height.value : `${height.value}px`;
  return {
    width: fixedWidth,
    height: fixedHeight,
    textAlign: 'left',
  };
});
</script>
