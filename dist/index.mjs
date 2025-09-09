import { ref, onMounted, nextTick, onUnmounted, watch, defineComponent, openBlock, createElementBlock, createElementVNode, toDisplayString, normalizeStyle, createCommentVNode, pushScopeId, popScopeId, computed, createTextVNode, createStaticVNode, toRefs, unref, renderSlot, createBlock, withDirectives, vShow } from "vue";
import { editor } from "monaco-editor";
const warnMsg = (msg) => {
  console.warn(`[MonacoEditorVue3]: ${msg}`);
};
const formatSize = (value) => {
  if (typeof value === "number") {
    return `${value}px`;
  }
  if (typeof value === "string") {
    if (value.includes("%") || value.includes("px") || value.includes("rem") || value.includes("em")) {
      return value;
    }
    return `${value}px`;
  }
  return "100%";
};
const deepMerge = (target, source) => {
  const result = { ...target };
  for (const key in source) {
    if (Object.hasOwn(source, key)) {
      const sourceValue = source[key];
      const targetValue = result[key];
      if (typeof sourceValue === "object" && sourceValue !== null && !Array.isArray(sourceValue) && typeof targetValue === "object" && targetValue !== null && !Array.isArray(targetValue)) {
        result[key] = deepMerge(
          targetValue,
          sourceValue
        );
      } else {
        result[key] = sourceValue;
      }
    }
  }
  return result;
};
const createDefaultOptions = (language = "javascript") => ({
  language,
  theme: "vs",
  automaticLayout: true,
  minimap: { enabled: false },
  scrollBeyondLastLine: false,
  fontSize: 14,
  lineHeight: 24,
  tabSize: 2,
  wordWrap: "on",
  contextmenu: true,
  selectOnLineNumbers: true
});
const isSupportedLanguage = (language) => {
  const supportedLanguages = [
    "javascript",
    "typescript",
    "json",
    "html",
    "css",
    "scss",
    "less",
    "python",
    "java",
    "csharp",
    "cpp",
    "php",
    "ruby",
    "go",
    "rust",
    "sql",
    "markdown",
    "xml",
    "yaml",
    "dockerfile",
    "shell",
    "powershell"
  ];
  return supportedLanguages.includes(language.toLowerCase());
};
const useEditorState = () => {
  const loading = ref({
    isLoading: false,
    loadingText: "Loading Monaco Editor...",
    progress: 0
  });
  const error = ref(null);
  const isReady = ref(false);
  const setLoading = (state) => {
    loading.value = { ...loading.value, ...state };
  };
  const setError = (err) => {
    error.value = err;
    if (err) {
      warnMsg(`Editor Error [${err.code}]: ${err.message}`);
      if (err.details) {
        console.error("Error details:", err.details);
      }
    }
  };
  const clearError = () => {
    error.value = null;
  };
  const setReady = (ready) => {
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
    setReady
  };
};
const useEditorLifecycle = (hooks) => {
  const executeHook = async (hookName, ...args) => {
    var _a;
    const hook = hooks == null ? void 0 : hooks[hookName];
    if (hook) {
      try {
        await hook(...args);
      } catch (error) {
        (_a = hooks == null ? void 0 : hooks.onError) == null ? void 0 : _a.call(hooks, {
          code: "LIFECYCLE_ERROR",
          message: `Error in ${hookName} hook`,
          details: error instanceof Error ? error.message : String(error),
          recoverable: true
        });
      }
    }
  };
  return { executeHook };
};
const useCommonEditor = () => {
};
const useCodeEditor = (props, emit) => {
  let editorInstance = null;
  const container = ref();
  const { loading, error, isReady, setLoading, setError, clearError, setReady } = useEditorState();
  const { executeHook } = useEditorLifecycle(props.lifecycle);
  const createEditor = async () => {
    try {
      if (!container.value) {
        throw new Error("Container element not found");
      }
      await executeHook("beforeCreate");
      setLoading({ isLoading: true, progress: 20 });
      await executeHook("onCreating");
      emit("editorWillMount");
      setLoading({ progress: 50 });
      const options = {
        value: props.value,
        language: props.language,
        theme: props.theme,
        ...props.options
      };
      editorInstance = editor.create(container.value, options);
      setLoading({ progress: 80 });
      await executeHook("onCreated", editorInstance);
      editorInstance.onDidChangeModelContent((event) => {
        const value = editorInstance.getValue();
        if (props.value !== value) {
          emit("change", value, event);
          emit("update:value", value);
        }
      });
      setReady(true);
      await executeHook("onReady", editorInstance);
      emit("editorDidMount", editorInstance);
    } catch (err) {
      const editorError = {
        code: "EDITOR_CREATE_FAILED",
        message: "Failed to create Monaco editor",
        details: err instanceof Error ? err.message : String(err),
        recoverable: true
      };
      setError(editorError);
      await executeHook("onError", editorError);
    }
  };
  const destroyEditor = async () => {
    try {
      await executeHook("beforeDestroy");
      if (editorInstance) {
        editorInstance.dispose();
        editorInstance = null;
      }
      setReady(false);
      clearError();
      await executeHook("onDestroyed");
    } catch (err) {
      const editorError = {
        code: "EDITOR_DESTROY_FAILED",
        message: "Failed to destroy Monaco editor",
        details: err instanceof Error ? err.message : String(err),
        recoverable: false
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
  watch(
    () => props.options,
    (opt) => {
      if (!opt || !editorInstance)
        return;
      try {
        editorInstance.updateOptions(opt);
      } catch (err) {
        const editorError = {
          code: "OPTIONS_UPDATE_FAILED",
          message: "Failed to update editor options",
          details: err instanceof Error ? err.message : String(err),
          recoverable: true
        };
        setError(editorError);
      }
    },
    {
      deep: true
    }
  );
  watch(
    () => props.value,
    (newValue) => {
      if (!editorInstance || !newValue)
        return;
      const currentValue = editorInstance.getValue();
      if (currentValue !== newValue) {
        try {
          editorInstance.setValue(newValue);
        } catch (err) {
          const editorError = {
            code: "VALUE_UPDATE_FAILED",
            message: "Failed to update editor value",
            details: err instanceof Error ? err.message : String(err),
            recoverable: true
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
    destroy: destroyEditor
  };
};
const useDiffEditor = (props, emit) => {
  let editorInstance = null;
  const container = ref();
  const { loading, error, isReady, setLoading, setError, clearError, setReady } = useEditorState();
  const { executeHook } = useEditorLifecycle(props.lifecycle);
  const createEditor = async () => {
    try {
      if (!container.value) {
        throw new Error("Container element not found");
      }
      await executeHook("beforeCreate");
      setLoading({ isLoading: true, progress: 20 });
      await executeHook("onCreating");
      emit("editorWillMount");
      setLoading({ progress: 50 });
      const options = {
        value: props.value,
        language: props.language,
        theme: props.theme,
        ...props.options
      };
      editorInstance = editor.createDiffEditor(container.value, options);
      setLoading({ progress: 70 });
      const originalModel = editor.createModel(props.original ?? "", props.language);
      const modifiedModel = editor.createModel(props.value ?? "", props.language);
      editorInstance.setModel({
        original: originalModel,
        modified: modifiedModel
      });
      setLoading({ progress: 80 });
      await executeHook("onCreated", editorInstance);
      editorInstance.getModifiedEditor().onDidChangeModelContent((event) => {
        const value = (editorInstance == null ? void 0 : editorInstance.getModifiedEditor()).getValue();
        if (props.value !== value) {
          emit("change", value, event);
          emit("update:value", value);
        }
      });
      setReady(true);
      await executeHook("onReady", editorInstance);
      emit("editorDidMount", editorInstance);
    } catch (err) {
      const editorError = {
        code: "DIFF_EDITOR_CREATE_FAILED",
        message: "Failed to create Monaco diff editor",
        details: err instanceof Error ? err.message : String(err),
        recoverable: true
      };
      setError(editorError);
      await executeHook("onError", editorError);
    }
  };
  const destroyEditor = async () => {
    try {
      await executeHook("beforeDestroy");
      if (editorInstance) {
        editorInstance.dispose();
        editorInstance = null;
      }
      setReady(false);
      clearError();
      await executeHook("onDestroyed");
    } catch (err) {
      const editorError = {
        code: "DIFF_EDITOR_DESTROY_FAILED",
        message: "Failed to destroy Monaco diff editor",
        details: err instanceof Error ? err.message : String(err),
        recoverable: false
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
  watch([() => props.original, () => props.value], ([newOriginal, newValue]) => {
    if (!editorInstance)
      return;
    try {
      const model = editorInstance.getModel();
      if (model) {
        if (newOriginal !== void 0) {
          model.original.setValue(newOriginal);
        }
        if (newValue !== void 0) {
          model.modified.setValue(newValue);
        }
      }
    } catch (err) {
      const editorError = {
        code: "DIFF_VALUE_UPDATE_FAILED",
        message: "Failed to update diff editor values",
        details: err instanceof Error ? err.message : String(err),
        recoverable: true
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
    destroy: destroyEditor
  };
};
const _withScopeId$1 = (n) => (pushScopeId("data-v-5ca71790"), n = n(), popScopeId(), n);
const _hoisted_1$1 = { class: "monaco-loading-container" };
const _hoisted_2$1 = { class: "monaco-loading-content" };
const _hoisted_3$1 = /* @__PURE__ */ _withScopeId$1(() => /* @__PURE__ */ createElementVNode("div", { class: "monaco-loading-spinner" }, [
  /* @__PURE__ */ createElementVNode("div", { class: "spinner" })
], -1));
const _hoisted_4 = { class: "monaco-loading-text" };
const _hoisted_5$1 = {
  key: 0,
  class: "monaco-loading-progress"
};
const _hoisted_6$1 = { class: "progress-bar" };
const _hoisted_7$1 = { class: "progress-text" };
const _sfc_main$3 = /* @__PURE__ */ defineComponent({
  __name: "MonacoLoading",
  props: {
    loadingText: { default: "Loading Monaco Editor..." },
    progress: { default: 0 },
    showProgress: { type: Boolean, default: true }
  },
  setup(__props) {
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", _hoisted_1$1, [
        createElementVNode("div", _hoisted_2$1, [
          _hoisted_3$1,
          createElementVNode("div", _hoisted_4, toDisplayString(_ctx.loadingText), 1),
          _ctx.showProgress ? (openBlock(), createElementBlock("div", _hoisted_5$1, [
            createElementVNode("div", _hoisted_6$1, [
              createElementVNode("div", {
                class: "progress-fill",
                style: normalizeStyle({ width: `${_ctx.progress}%` })
              }, null, 4)
            ]),
            createElementVNode("div", _hoisted_7$1, toDisplayString(_ctx.progress) + "%", 1)
          ])) : createCommentVNode("", true)
        ])
      ]);
    };
  }
});
const _export_sfc = (sfc, props) => {
  const target = sfc.__vccOpts || sfc;
  for (const [key, val] of props) {
    target[key] = val;
  }
  return target;
};
const MonacoLoading = /* @__PURE__ */ _export_sfc(_sfc_main$3, [["__scopeId", "data-v-5ca71790"]]);
const _withScopeId = (n) => (pushScopeId("data-v-885d6cf3"), n = n(), popScopeId(), n);
const _hoisted_1 = { class: "monaco-error-boundary" };
const _hoisted_2 = { class: "monaco-error-content" };
const _hoisted_3 = /* @__PURE__ */ createStaticVNode('<div class="monaco-error-icon" data-v-885d6cf3><svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" data-v-885d6cf3><circle cx="12" cy="12" r="10" stroke="#dc3545" stroke-width="2" data-v-885d6cf3></circle><path d="m15 9-6 6" stroke="#dc3545" stroke-width="2" data-v-885d6cf3></path><path d="m9 9 6 6" stroke="#dc3545" stroke-width="2" data-v-885d6cf3></path></svg></div><div class="monaco-error-title" data-v-885d6cf3> Monaco Editor Error </div>', 2);
const _hoisted_5 = { class: "monaco-error-message" };
const _hoisted_6 = {
  key: 0,
  class: "monaco-error-details"
};
const _hoisted_7 = /* @__PURE__ */ _withScopeId(() => /* @__PURE__ */ createElementVNode("summary", null, "Error Details", -1));
const _hoisted_8 = { class: "monaco-error-actions" };
const _hoisted_9 = /* @__PURE__ */ createStaticVNode('<svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" data-v-885d6cf3><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-v-885d6cf3></path><path d="M21 3v5h-5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-v-885d6cf3></path><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-v-885d6cf3></path><path d="M3 21v-5h5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-v-885d6cf3></path></svg>', 1);
const _hoisted_10 = {
  key: 1,
  class: "monaco-error-code"
};
const _sfc_main$2 = /* @__PURE__ */ defineComponent({
  __name: "MonacoErrorBoundary",
  props: {
    error: {},
    showDetails: { type: Boolean, default: true },
    showRetry: { type: Boolean, default: true },
    showReload: { type: Boolean, default: false },
    showReport: { type: Boolean, default: false }
  },
  emits: ["retry", "reload", "report"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const errorCode = computed(() => props.error.code);
    const handleRetry = () => {
      emit("retry");
    };
    const handleReload = () => {
      if (typeof window !== "undefined") {
        window.location.reload();
      }
      emit("reload");
    };
    const handleReport = () => {
      emit("report", props.error);
    };
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", _hoisted_1, [
        createElementVNode("div", _hoisted_2, [
          _hoisted_3,
          createElementVNode("div", _hoisted_5, toDisplayString(_ctx.error.message), 1),
          _ctx.error.details && _ctx.showDetails ? (openBlock(), createElementBlock("div", _hoisted_6, [
            createElementVNode("details", null, [
              _hoisted_7,
              createElementVNode("pre", null, toDisplayString(_ctx.error.details), 1)
            ])
          ])) : createCommentVNode("", true),
          createElementVNode("div", _hoisted_8, [
            _ctx.error.recoverable && _ctx.showRetry ? (openBlock(), createElementBlock("button", {
              key: 0,
              onClick: handleRetry,
              class: "monaco-error-button retry"
            }, [
              _hoisted_9,
              createTextVNode(" Retry ")
            ])) : createCommentVNode("", true),
            _ctx.showReload ? (openBlock(), createElementBlock("button", {
              key: 1,
              onClick: handleReload,
              class: "monaco-error-button reload"
            }, " Reload Page ")) : createCommentVNode("", true),
            _ctx.showReport ? (openBlock(), createElementBlock("button", {
              key: 2,
              onClick: handleReport,
              class: "monaco-error-button report"
            }, " Report Issue ")) : createCommentVNode("", true)
          ]),
          errorCode.value ? (openBlock(), createElementBlock("div", _hoisted_10, " Error Code: " + toDisplayString(errorCode.value), 1)) : createCommentVNode("", true)
        ])
      ]);
    };
  }
});
const MonacoErrorBoundary = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["__scopeId", "data-v-885d6cf3"]]);
const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "CodeEditor",
  props: {
    loadingText: {},
    showProgress: { type: Boolean, default: true },
    showErrorBoundary: { type: Boolean, default: true },
    retryable: { type: Boolean, default: true },
    lifecycle: {},
    useDefaultLoading: { type: Boolean, default: true },
    useDefaultErrorBoundary: { type: Boolean, default: true },
    value: { default: "" },
    width: { default: "100%" },
    height: { default: "100%" },
    theme: { default: "vs" },
    language: { default: "javascript" },
    options: { default: () => ({}) }
  },
  emits: ["editorWillMount", "editorDidMount", "change", "update:value", "error", "ready", "loading"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const { container, loading, error, isReady, retry } = useCodeEditor(props, emit);
    const { width, height } = toRefs(props);
    const style = computed(() => ({
      width: formatSize(width.value),
      height: formatSize(height.value),
      textAlign: "left",
      position: "relative"
    }));
    const handleRetry = () => {
      retry();
      emit("error", null);
    };
    watch(
      loading,
      (newLoading) => {
        emit("loading", newLoading);
      },
      { deep: true }
    );
    watch(error, (newError) => {
      emit("error", newError);
    });
    watch(isReady, (ready) => {
      if (ready) {
        emit("ready");
      }
    });
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", {
        ref: "editorContainer",
        style: normalizeStyle(style.value),
        class: "monaco-code-editor"
      }, [
        !unref(isReady) && !unref(error) ? renderSlot(_ctx.$slots, "loading", {
          key: 0,
          loading: unref(loading),
          loadingText: _ctx.loadingText || unref(loading).loadingText,
          progress: unref(loading).progress,
          showProgress: _ctx.showProgress
        }, () => [
          _ctx.useDefaultLoading ? (openBlock(), createBlock(MonacoLoading, {
            key: 0,
            "loading-text": _ctx.loadingText || unref(loading).loadingText,
            progress: unref(loading).progress,
            "show-progress": _ctx.showProgress
          }, null, 8, ["loading-text", "progress", "show-progress"])) : createCommentVNode("", true)
        ], true) : unref(error) && _ctx.showErrorBoundary ? renderSlot(_ctx.$slots, "error", {
          key: 1,
          error: unref(error),
          retry: handleRetry,
          retryable: _ctx.retryable
        }, () => [
          _ctx.useDefaultErrorBoundary ? (openBlock(), createBlock(MonacoErrorBoundary, {
            key: 0,
            error: unref(error),
            "show-retry": _ctx.retryable,
            "show-details": true,
            "show-reload": false,
            "show-report": false,
            onRetry: handleRetry
          }, null, 8, ["error", "show-retry"])) : createCommentVNode("", true)
        ], true) : createCommentVNode("", true),
        withDirectives(createElementVNode("div", {
          ref_key: "container",
          ref: container,
          class: "monaco-editor-container"
        }, null, 512), [
          [vShow, unref(isReady) && !unref(error)]
        ])
      ], 4);
    };
  }
});
const CodeEditor = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["__scopeId", "data-v-591a3846"]]);
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "DiffEditor",
  props: {
    loadingText: {},
    showProgress: { type: Boolean, default: true },
    showErrorBoundary: { type: Boolean, default: true },
    retryable: { type: Boolean, default: true },
    lifecycle: {},
    useDefaultLoading: { type: Boolean, default: true },
    useDefaultErrorBoundary: { type: Boolean, default: true },
    value: { default: "" },
    original: { default: "" },
    width: { default: "100%" },
    height: { default: "100%" },
    theme: { default: "vs" },
    language: { default: "javascript" },
    options: { default: () => ({}) }
  },
  emits: ["editorWillMount", "editorDidMount", "change", "update:value", "error", "ready", "loading"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const { container, loading, error, isReady, retry } = useDiffEditor(props, emit);
    const { width, height } = toRefs(props);
    const style = computed(() => ({
      width: formatSize(width.value),
      height: formatSize(height.value),
      textAlign: "left",
      position: "relative"
    }));
    const handleRetry = () => {
      retry();
      emit("error", null);
    };
    watch(
      loading,
      (newLoading) => {
        emit("loading", newLoading);
      },
      { deep: true }
    );
    watch(error, (newError) => {
      emit("error", newError);
    });
    watch(isReady, (ready) => {
      if (ready) {
        emit("ready");
      }
    });
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", {
        ref: "editorContainer",
        style: normalizeStyle(style.value),
        class: "monaco-diff-editor"
      }, [
        !unref(isReady) && !unref(error) ? renderSlot(_ctx.$slots, "loading", {
          key: 0,
          loading: unref(loading),
          loadingText: _ctx.loadingText || unref(loading).loadingText,
          progress: unref(loading).progress,
          showProgress: _ctx.showProgress
        }, () => [
          _ctx.useDefaultLoading ? (openBlock(), createBlock(MonacoLoading, {
            key: 0,
            "loading-text": _ctx.loadingText || unref(loading).loadingText,
            progress: unref(loading).progress,
            "show-progress": _ctx.showProgress
          }, null, 8, ["loading-text", "progress", "show-progress"])) : createCommentVNode("", true)
        ], true) : unref(error) && _ctx.showErrorBoundary ? renderSlot(_ctx.$slots, "error", {
          key: 1,
          error: unref(error),
          retry: handleRetry,
          retryable: _ctx.retryable
        }, () => [
          _ctx.useDefaultErrorBoundary ? (openBlock(), createBlock(MonacoErrorBoundary, {
            key: 0,
            error: unref(error),
            "show-retry": _ctx.retryable,
            "show-details": true,
            "show-reload": false,
            "show-report": false,
            onRetry: handleRetry
          }, null, 8, ["error", "show-retry"])) : createCommentVNode("", true)
        ], true) : createCommentVNode("", true),
        withDirectives(createElementVNode("div", {
          ref_key: "container",
          ref: container,
          class: "monaco-editor-container"
        }, null, 512), [
          [vShow, unref(isReady) && !unref(error)]
        ])
      ], 4);
    };
  }
});
const DiffEditor = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-9eb8d5bc"]]);
export {
  CodeEditor,
  DiffEditor,
  createDefaultOptions,
  deepMerge,
  CodeEditor as default,
  formatSize,
  isSupportedLanguage,
  useCodeEditor,
  useCommonEditor,
  useDiffEditor,
  useEditorLifecycle,
  useEditorState,
  warnMsg
};
