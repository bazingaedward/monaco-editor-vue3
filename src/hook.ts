import { editor } from 'monaco-editor';
import { CodeEditorProps, MonacoEditorProps } from './typing';
import { warnMsg } from './utils';

export const useCommonEditor = () => {
  // 监听options的变化,同步更新
  // TODO: 未来提取公共逻辑
};

export const useCodeEditor = (props: CodeEditorProps, emit: any) => {
  let editorInstance: editor.IStandaloneCodeEditor | null = null;
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

    editorInstance = editor.create(container.value, options) as editor.IStandaloneCodeEditor;

    // 注册内容变化监听事件
    editorInstance.onDidChangeModelContent((event) => {
      const value = (editorInstance as editor.IStandaloneCodeEditor).getValue();
      if (props.value !== value) {
        emit('change', value, event);
        emit('update:value', value);
      }
    });

    emit('editorDidMount', editorInstance);
  });

  // 监听options的变化,同步更新
  watch(
    () => props.options,
    (opt) => {
      if (!opt) return;
      editorInstance?.updateOptions(opt);
    },
    {
      deep: true,
    },
  );

  // TODO: 默认不监听value变更，后续需要将光标移动到文本末尾
  // watch(
  //   () => props.value,
  //   (v) => {
  //     if (!editorInstance) {
  //       warnMsg('Monaco Editor not inited when props.value change');
  //       return;
  //     }
  //     debugger;
  //     editorInstance.setValue(v);
  //   },
  // );
  // function moveCursorToEnd() {
  //   const model = editor.getModel();
  //   const lineCount = model.getLineCount();
  //   const lastLine = model.getLineContent(lineCount);
  //   const lastColumn = lastLine.length + 1; // 列号从1开始

  //   editor.setPosition({ lineNumber: lineCount, column: lastColumn });
  //   editor.focus();
  // }

  return {
    editorInstance,
    container,
  };
};

export const useDiffEditor = (props: MonacoEditorProps, emit: any) => {
  let editorInstance: editor.IStandaloneDiffEditor | null = null;
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

    editorInstance = editor.createDiffEditor(container.value, options) as editor.IStandaloneDiffEditor;

    // 生成diff对应的model
    const originalModel = editor.createModel(props.original ?? '', props.language);
    const modifiedModel = editor.createModel(props.value ?? '', props.language);
    editorInstance.setModel({
      original: originalModel,
      modified: modifiedModel,
    });

    // TODO: 注册diffEditor内容变化监听事件
    editorInstance.modifiedEditor.onDidChangeModelContent((event) => {
      const value = (editorInstance as editor.IStandaloneCodeEditor).getValue();
      if (props.value !== value) {
        emit('change', value, event);
        emit('update:value', value);
      }
    });

    emit('editorDidMount', editorInstance);
  });

  return {
    editorInstance,
    container,
  };
};
