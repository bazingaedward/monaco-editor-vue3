<template>
  <div ref="container" :style="style"></div>
</template>

<script setup lang="ts">
import { MonacoEditorProps } from './typing';
import { useEditor } from './hook';

const props = withDefaults(defineProps<MonacoEditorProps>(), {
  diffEditor: false,
  width: '100%',
  height: '100%',
  language: 'javascript',
  theme: 'vs',
  value: '',
  options: () => ({}),
});

const emit = defineEmits(['editorWillMount', 'editorDidMount', 'change', 'update:value']);

const { editor, container } = useEditor(props, emit);

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
