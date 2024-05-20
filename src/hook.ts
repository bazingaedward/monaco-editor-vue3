import { editor } from 'monaco-editor';

import { MonacoEditorProps } from './typing';

export const useEditor = (props: MonacoEditorProps, emit: any) => {
  const editorRef = ref<editor.IStandaloneDiffEditor | editor.IStandaloneCodeEditor>();
  const container = ref<HTMLElement>();

  onMounted(() => {
    if (!container.value) return;

    emit('editorWillMount');

    const options = {
      value: props.value,
      language: props.language,
      theme: props.theme,
      ...props.options,
    };

    if (props.diffEditor) {
      editorRef.value = editor.createDiffEditor(container.value, options) as editor.IStandaloneDiffEditor;

      // 生成diff对应的model
      const originalModel = editor.createModel(props.original, props.language);
      const modifiedModel = editor.createModel(props.value, props.language);
      editorRef.value.setModel({
        original: originalModel,
        modified: modifiedModel,
      });

      // TODO: 注册diffEditor内容变化监听事件
      // editorRef.value.modifiedEditor.onDidChangeModelContent((event) => {
      //   const value = (editorRef.value as editor.IStandaloneCodeEditor).getValue();
      //   if (props.value !== value) {
      //     emit('change', value, event);
      //     emit('update:value', value);
      //   }
      // });
    } else {
      editorRef.value = editor.create(container.value, options) as editor.IStandaloneCodeEditor;

      // 注册内容变化监听事件
      editorRef.value.onDidChangeModelContent((event) => {
        debugger;
        const value = (editorRef.value as editor.IStandaloneCodeEditor).getValue();
        if (props.value !== value) {
          emit('change', value, event);
          emit('update:value', value);
        }
      });
    }

    emit('editorDidMount', editorRef.value);

    // 监听options的变化,同步更新
    watch(
      () => props.options,
      (opt) => {
        if (!opt) return;
        editorRef.value?.updateOptions(opt);
      },
      {
        deep: true,
      },
    );

    // 监听value变更
    watch(
      () => props.value,
      (v) => {
        editorRef.value?.setValue(v);
      },
    );

    // language() {
    //   if (!this.editor) return;
    //   if (this.diffEditor) {
    //     const { original, modified } = this.editor.getModel();
    //     monaco.editor.setModelLanguage(original, this.language);
    //     monaco.editor.setModelLanguage(modified, this.language);
    //   } else monaco.editor.setModelLanguage(this.editor.getModel(), this.language);
    // },
    // theme() {
    //   monaco.editor.setTheme(this.theme);
    // },
  });

  return {
    editorRef,
    container,
  };
};
