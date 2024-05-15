import { MonacoEditorProps } from './typing';

export const useEditor = (isDiffEditor: boolean, emit: any, monaco: any, props: MonacoEditorProps) => {
  const editor = ref();
  const container = ref();

  onMounted(() => {
    emit('editorWillMount');
    if (isDiffEditor) {
      editor.value = monaco.editor.createDiffEditor();
    } else {
      editor.value = monaco.editor.create();
    }

    emit('editorDidMount');
  });

  return {
    editor,
    container,
  };
};
