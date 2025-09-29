import { editor } from 'monaco-editor';
import { nextTick, onMounted, onUnmounted, ref, watch } from 'vue';
import type {
  CodeEditorProps,
  MonacoEditorProps,
  UseCodeEditorReturn,
  UseDiffEditorReturn,
  EditorError,
  EditorLoadingState,
  EditorLifecycleHooks,
} from './typing';
import { warnMsg } from './utils';

/**
 * 通用编辑器错误处理和状态管理 Hook
 */
export const useEditorState = () => {
  const loading = ref<EditorLoadingState>({
    isLoading: false,
    loadingText: 'Loading Monaco Editor...',
    progress: 0,
  });

  const error = ref<EditorError | null>(null);
  const isReady = ref(false);

  const setLoading = (state: Partial<EditorLoadingState>) => {
    loading.value = { ...loading.value, ...state };
  };

  const setError = (err: EditorError | null) => {
    error.value = err;
    if (err) {
      warnMsg(`Editor Error [${err.code}]: ${err.message}`);
      if (err.details) {
        console.error('Error details:', err.details);
      }
    }
  };

  const clearError = () => {
    error.value = null;
  };

  const setReady = (ready: boolean) => {
    isReady.value = ready;
    if (ready) {
      setLoading({ isLoading: false, progress: 100 });
    }
  };

  return {
    loading,
    error,
    isReady,
    setLoading,
    setError,
    clearError,
    setReady,
  };
};

/**
 * 生命周期钩子管理
 */
export const useEditorLifecycle = (hooks?: EditorLifecycleHooks) => {
  const executeHook = async (hookName: keyof EditorLifecycleHooks, ...args: any[]) => {
    const hook = hooks?.[hookName];
    if (hook) {
      try {
        await hook(...args);
      } catch (error) {
        hooks?.onError?.({
          code: 'LIFECYCLE_ERROR',
          message: `Error in ${hookName} hook`,
          details: error instanceof Error ? error.message : String(error),
          recoverable: true,
        });
      }
    }
  };

  return { executeHook };
};

export const useCommonEditor = () => {
  // 监听options的变化,同步更新
};

export const useCodeEditor = (
  props: CodeEditorProps & { lifecycle?: EditorLifecycleHooks },
  emit: (event: string, ...args: unknown[]) => void
): UseCodeEditorReturn => {
  let editorInstance: editor.IStandaloneCodeEditor | null = null;
  const container = ref<HTMLElement>();
  const { loading, error, isReady, setLoading, setError, clearError, setReady } = useEditorState();
  const { executeHook } = useEditorLifecycle(props.lifecycle);

  const createEditor = async () => {
    try {
      if (!container.value) {
        throw new Error('Container element not found');
      }

      await executeHook('beforeCreate');
      setLoading({ isLoading: true, progress: 20 });

      await executeHook('onCreating');
      emit('editorWillMount');

      setLoading({ progress: 50 });

      const options = {
        value: props.value,
        language: props.language,
        theme: props.theme,
        ...props.options,
      };

      editorInstance = editor.create(container.value, options) as editor.IStandaloneCodeEditor;

      setLoading({ progress: 80 });
      await executeHook('onCreated', editorInstance);

      // 注册内容变化监听事件
      editorInstance.onDidChangeModelContent((event) => {
        const value = (editorInstance as editor.IStandaloneCodeEditor).getValue();
        if (props.value !== value) {
          emit('change', value, event);
          emit('update:value', value);
        }
      });

      setReady(true);
      await executeHook('onReady', editorInstance);
      emit('editorDidMount', editorInstance);
    } catch (err) {
      const editorError: EditorError = {
        code: 'EDITOR_CREATE_FAILED',
        message: 'Failed to create Monaco editor',
        details: err instanceof Error ? err.message : String(err),
        recoverable: true,
      };
      setError(editorError);
      await executeHook('onError', editorError);
    }
  };

  const destroyEditor = async () => {
    try {
      await executeHook('beforeDestroy');

      if (editorInstance) {
        editorInstance.dispose();
        editorInstance = null;
      }

      setReady(false);
      clearError();
      await executeHook('onDestroyed');
    } catch (err) {
      const editorError: EditorError = {
        code: 'EDITOR_DESTROY_FAILED',
        message: 'Failed to destroy Monaco editor',
        details: err instanceof Error ? err.message : String(err),
        recoverable: false,
      };
      setError(editorError);
    }
  };

  onMounted(() => {
    nextTick(() => {
      createEditor();
    });
  });

  onUnmounted(() => {
    destroyEditor();
  });

  // 监听options的变化,同步更新
  watch(
    () => props.options,
    (opt) => {
      if (!opt || !editorInstance) return;
      try {
        editorInstance.updateOptions(opt);
      } catch (err) {
        const editorError: EditorError = {
          code: 'OPTIONS_UPDATE_FAILED',
          message: 'Failed to update editor options',
          details: err instanceof Error ? err.message : String(err),
          recoverable: true,
        };
        setError(editorError);
      }
    },
    {
      deep: true,
    }
  );

  // 监听 value 变化
  watch(
    () => props.value,
    (newValue) => {
      if (!editorInstance || !newValue) return;
      const currentValue = editorInstance.getValue();
      if (currentValue !== newValue) {
        try {
          editorInstance.setValue(newValue);
        } catch (err) {
          const editorError: EditorError = {
            code: 'VALUE_UPDATE_FAILED',
            message: 'Failed to update editor value',
            details: err instanceof Error ? err.message : String(err),
            recoverable: true,
          };
          setError(editorError);
        }
      }
    }
  );

  const retry = () => {
    clearError();
    createEditor();
  };

  return {
    editorInstance,
    container,
    loading,
    error,
    isReady,
    retry,
    destroy: destroyEditor,
  };
};

export const useDiffEditor = (
  props: MonacoEditorProps & { lifecycle?: EditorLifecycleHooks },
  emit: (event: string, ...args: unknown[]) => void
): UseDiffEditorReturn => {
  let editorInstance: editor.IStandaloneDiffEditor | null = null;
  const container = ref<HTMLElement>();
  const { loading, error, isReady, setLoading, setError, clearError, setReady } = useEditorState();
  const { executeHook } = useEditorLifecycle(props.lifecycle);

  const createEditor = async () => {
    try {
      if (!container.value) {
        throw new Error('Container element not found');
      }

      await executeHook('beforeCreate');
      setLoading({ isLoading: true, progress: 20 });

      await executeHook('onCreating');
      emit('editorWillMount');

      setLoading({ progress: 50 });

      const options = {
        value: props.value,
        language: props.language,
        theme: props.theme,
        ...props.options,
      };

      editorInstance = editor.createDiffEditor(container.value, options) as editor.IStandaloneDiffEditor;

      setLoading({ progress: 70 });

      // 生成diff对应的model
      const originalModel = editor.createModel(props.original ?? '', props.language);
      const modifiedModel = editor.createModel(props.value ?? '', props.language);
      editorInstance.setModel({
        original: originalModel,
        modified: modifiedModel,
      });

      setLoading({ progress: 80 });
      await executeHook('onCreated', editorInstance);

      // 注册diffEditor内容变化监听事件
      editorInstance.getModifiedEditor().onDidChangeModelContent((event) => {
        const value = (editorInstance?.getModifiedEditor() as editor.IStandaloneCodeEditor).getValue();
        if (props.value !== value) {
          emit('change', value, event);
          emit('update:value', value);
        }
      });

      setReady(true);
      await executeHook('onReady', editorInstance);
      emit('editorDidMount', editorInstance);
    } catch (err) {
      const editorError: EditorError = {
        code: 'DIFF_EDITOR_CREATE_FAILED',
        message: 'Failed to create Monaco diff editor',
        details: err instanceof Error ? err.message : String(err),
        recoverable: true,
      };
      setError(editorError);
      await executeHook('onError', editorError);
    }
  };

  const destroyEditor = async () => {
    try {
      await executeHook('beforeDestroy');

      if (editorInstance) {
        editorInstance.dispose();
        editorInstance = null;
      }

      setReady(false);
      clearError();
      await executeHook('onDestroyed');
    } catch (err) {
      const editorError: EditorError = {
        code: 'DIFF_EDITOR_DESTROY_FAILED',
        message: 'Failed to destroy Monaco diff editor',
        details: err instanceof Error ? err.message : String(err),
        recoverable: false,
      };
      setError(editorError);
    }
  };

  onMounted(() => {
    nextTick(() => {
      createEditor();
    });
  });

  onUnmounted(() => {
    destroyEditor();
  });

  // 监听 original 和 value 变化
  watch([() => props.original, () => props.value], ([newOriginal, newValue]) => {
    if (!editorInstance) return;
    try {
      const model = editorInstance.getModel();
      if (model) {
        if (newOriginal !== undefined) {
          model.original.setValue(newOriginal);
        }
        if (newValue !== undefined) {
          model.modified.setValue(newValue);
        }
      }
    } catch (err) {
      const editorError: EditorError = {
        code: 'DIFF_VALUE_UPDATE_FAILED',
        message: 'Failed to update diff editor values',
        details: err instanceof Error ? err.message : String(err),
        recoverable: true,
      };
      setError(editorError);
    }
  });

  const retry = () => {
    clearError();
    createEditor();
  };

  return {
    editorInstance,
    container,
    loading,
    error,
    isReady,
    retry,
    destroy: destroyEditor,
  };
};
