(function(global, factory) {
  typeof exports === "object" && typeof module !== "undefined" ? factory(exports, require("vue"), require("monaco-editor")) : typeof define === "function" && define.amd ? define(["exports", "vue", "monaco-editor"], factory) : (global = typeof globalThis !== "undefined" ? globalThis : global || self, factory(global["monaco-editor-vue3"] = {}, global.Vue, global["monaco-editor"]));
})(this, function(exports2, vue, monacoEditor) {
  "use strict";
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
    const loading = vue.ref({
      isLoading: false,
      loadingText: "Loading Monaco Editor...",
      progress: 0
    });
    const error = vue.ref(null);
    const isReady = vue.ref(false);
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
    const container = vue.ref();
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
        editorInstance = monacoEditor.editor.create(container.value, options);
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
    vue.onMounted(() => {
      vue.nextTick(() => {
        createEditor();
      });
    });
    vue.onUnmounted(() => {
      destroyEditor();
    });
    vue.watch(
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
    vue.watch(
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
    const container = vue.ref();
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
        editorInstance = monacoEditor.editor.createDiffEditor(container.value, options);
        setLoading({ progress: 70 });
        const originalModel = monacoEditor.editor.createModel(props.original ?? "", props.language);
        const modifiedModel = monacoEditor.editor.createModel(props.value ?? "", props.language);
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
    vue.onMounted(() => {
      vue.nextTick(() => {
        createEditor();
      });
    });
    vue.onUnmounted(() => {
      destroyEditor();
    });
    vue.watch([() => props.original, () => props.value], ([newOriginal, newValue]) => {
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
  const _withScopeId$1 = (n) => (vue.pushScopeId("data-v-5ca71790"), n = n(), vue.popScopeId(), n);
  const _hoisted_1$1 = { class: "monaco-loading-container" };
  const _hoisted_2$1 = { class: "monaco-loading-content" };
  const _hoisted_3$1 = /* @__PURE__ */ _withScopeId$1(() => /* @__PURE__ */ vue.createElementVNode("div", { class: "monaco-loading-spinner" }, [
    /* @__PURE__ */ vue.createElementVNode("div", { class: "spinner" })
  ], -1));
  const _hoisted_4 = { class: "monaco-loading-text" };
  const _hoisted_5$1 = {
    key: 0,
    class: "monaco-loading-progress"
  };
  const _hoisted_6$1 = { class: "progress-bar" };
  const _hoisted_7$1 = { class: "progress-text" };
  const _sfc_main$3 = /* @__PURE__ */ vue.defineComponent({
    __name: "MonacoLoading",
    props: {
      loadingText: { default: "Loading Monaco Editor..." },
      progress: { default: 0 },
      showProgress: { type: Boolean, default: true }
    },
    setup(__props) {
      return (_ctx, _cache) => {
        return vue.openBlock(), vue.createElementBlock("div", _hoisted_1$1, [
          vue.createElementVNode("div", _hoisted_2$1, [
            _hoisted_3$1,
            vue.createElementVNode("div", _hoisted_4, vue.toDisplayString(_ctx.loadingText), 1),
            _ctx.showProgress ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_5$1, [
              vue.createElementVNode("div", _hoisted_6$1, [
                vue.createElementVNode("div", {
                  class: "progress-fill",
                  style: vue.normalizeStyle({ width: `${_ctx.progress}%` })
                }, null, 4)
              ]),
              vue.createElementVNode("div", _hoisted_7$1, vue.toDisplayString(_ctx.progress) + "%", 1)
            ])) : vue.createCommentVNode("", true)
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
  const _withScopeId = (n) => (vue.pushScopeId("data-v-885d6cf3"), n = n(), vue.popScopeId(), n);
  const _hoisted_1 = { class: "monaco-error-boundary" };
  const _hoisted_2 = { class: "monaco-error-content" };
  const _hoisted_3 = /* @__PURE__ */ vue.createStaticVNode('<div class="monaco-error-icon" data-v-885d6cf3><svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" data-v-885d6cf3><circle cx="12" cy="12" r="10" stroke="#dc3545" stroke-width="2" data-v-885d6cf3></circle><path d="m15 9-6 6" stroke="#dc3545" stroke-width="2" data-v-885d6cf3></path><path d="m9 9 6 6" stroke="#dc3545" stroke-width="2" data-v-885d6cf3></path></svg></div><div class="monaco-error-title" data-v-885d6cf3> Monaco Editor Error </div>', 2);
  const _hoisted_5 = { class: "monaco-error-message" };
  const _hoisted_6 = {
    key: 0,
    class: "monaco-error-details"
  };
  const _hoisted_7 = /* @__PURE__ */ _withScopeId(() => /* @__PURE__ */ vue.createElementVNode("summary", null, "Error Details", -1));
  const _hoisted_8 = { class: "monaco-error-actions" };
  const _hoisted_9 = /* @__PURE__ */ vue.createStaticVNode('<svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" data-v-885d6cf3><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-v-885d6cf3></path><path d="M21 3v5h-5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-v-885d6cf3></path><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-v-885d6cf3></path><path d="M3 21v-5h5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-v-885d6cf3></path></svg>', 1);
  const _hoisted_10 = {
    key: 1,
    class: "monaco-error-code"
  };
  const _sfc_main$2 = /* @__PURE__ */ vue.defineComponent({
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
      const errorCode = vue.computed(() => props.error.code);
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
        return vue.openBlock(), vue.createElementBlock("div", _hoisted_1, [
          vue.createElementVNode("div", _hoisted_2, [
            _hoisted_3,
            vue.createElementVNode("div", _hoisted_5, vue.toDisplayString(_ctx.error.message), 1),
            _ctx.error.details && _ctx.showDetails ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_6, [
              vue.createElementVNode("details", null, [
                _hoisted_7,
                vue.createElementVNode("pre", null, vue.toDisplayString(_ctx.error.details), 1)
              ])
            ])) : vue.createCommentVNode("", true),
            vue.createElementVNode("div", _hoisted_8, [
              _ctx.error.recoverable && _ctx.showRetry ? (vue.openBlock(), vue.createElementBlock("button", {
                key: 0,
                onClick: handleRetry,
                class: "monaco-error-button retry"
              }, [
                _hoisted_9,
                vue.createTextVNode(" Retry ")
              ])) : vue.createCommentVNode("", true),
              _ctx.showReload ? (vue.openBlock(), vue.createElementBlock("button", {
                key: 1,
                onClick: handleReload,
                class: "monaco-error-button reload"
              }, " Reload Page ")) : vue.createCommentVNode("", true),
              _ctx.showReport ? (vue.openBlock(), vue.createElementBlock("button", {
                key: 2,
                onClick: handleReport,
                class: "monaco-error-button report"
              }, " Report Issue ")) : vue.createCommentVNode("", true)
            ]),
            errorCode.value ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_10, " Error Code: " + vue.toDisplayString(errorCode.value), 1)) : vue.createCommentVNode("", true)
          ])
        ]);
      };
    }
  });
  const MonacoErrorBoundary = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["__scopeId", "data-v-885d6cf3"]]);
  const _sfc_main$1 = /* @__PURE__ */ vue.defineComponent({
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
      const { width, height } = vue.toRefs(props);
      const style = vue.computed(() => ({
        width: formatSize(width.value),
        height: formatSize(height.value),
        textAlign: "left",
        position: "relative"
      }));
      const handleRetry = () => {
        retry();
        emit("error", null);
      };
      vue.watch(
        loading,
        (newLoading) => {
          emit("loading", newLoading);
        },
        { deep: true }
      );
      vue.watch(error, (newError) => {
        emit("error", newError);
      });
      vue.watch(isReady, (ready) => {
        if (ready) {
          emit("ready");
        }
      });
      return (_ctx, _cache) => {
        return vue.openBlock(), vue.createElementBlock("div", {
          ref: "editorContainer",
          style: vue.normalizeStyle(style.value),
          class: "monaco-code-editor"
        }, [
          !vue.unref(isReady) && !vue.unref(error) ? vue.renderSlot(_ctx.$slots, "loading", {
            key: 0,
            loading: vue.unref(loading),
            loadingText: _ctx.loadingText || vue.unref(loading).loadingText,
            progress: vue.unref(loading).progress,
            showProgress: _ctx.showProgress
          }, () => [
            _ctx.useDefaultLoading ? (vue.openBlock(), vue.createBlock(MonacoLoading, {
              key: 0,
              "loading-text": _ctx.loadingText || vue.unref(loading).loadingText,
              progress: vue.unref(loading).progress,
              "show-progress": _ctx.showProgress
            }, null, 8, ["loading-text", "progress", "show-progress"])) : vue.createCommentVNode("", true)
          ], true) : vue.unref(error) && _ctx.showErrorBoundary ? vue.renderSlot(_ctx.$slots, "error", {
            key: 1,
            error: vue.unref(error),
            retry: handleRetry,
            retryable: _ctx.retryable
          }, () => [
            _ctx.useDefaultErrorBoundary ? (vue.openBlock(), vue.createBlock(MonacoErrorBoundary, {
              key: 0,
              error: vue.unref(error),
              "show-retry": _ctx.retryable,
              "show-details": true,
              "show-reload": false,
              "show-report": false,
              onRetry: handleRetry
            }, null, 8, ["error", "show-retry"])) : vue.createCommentVNode("", true)
          ], true) : vue.createCommentVNode("", true),
          vue.withDirectives(vue.createElementVNode("div", {
            ref_key: "container",
            ref: container,
            class: "monaco-editor-container"
          }, null, 512), [
            [vue.vShow, vue.unref(isReady) && !vue.unref(error)]
          ])
        ], 4);
      };
    }
  });
  const CodeEditor = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["__scopeId", "data-v-591a3846"]]);
  const _sfc_main = /* @__PURE__ */ vue.defineComponent({
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
      const { width, height } = vue.toRefs(props);
      const style = vue.computed(() => ({
        width: formatSize(width.value),
        height: formatSize(height.value),
        textAlign: "left",
        position: "relative"
      }));
      const handleRetry = () => {
        retry();
        emit("error", null);
      };
      vue.watch(
        loading,
        (newLoading) => {
          emit("loading", newLoading);
        },
        { deep: true }
      );
      vue.watch(error, (newError) => {
        emit("error", newError);
      });
      vue.watch(isReady, (ready) => {
        if (ready) {
          emit("ready");
        }
      });
      return (_ctx, _cache) => {
        return vue.openBlock(), vue.createElementBlock("div", {
          ref: "editorContainer",
          style: vue.normalizeStyle(style.value),
          class: "monaco-diff-editor"
        }, [
          !vue.unref(isReady) && !vue.unref(error) ? vue.renderSlot(_ctx.$slots, "loading", {
            key: 0,
            loading: vue.unref(loading),
            loadingText: _ctx.loadingText || vue.unref(loading).loadingText,
            progress: vue.unref(loading).progress,
            showProgress: _ctx.showProgress
          }, () => [
            _ctx.useDefaultLoading ? (vue.openBlock(), vue.createBlock(MonacoLoading, {
              key: 0,
              "loading-text": _ctx.loadingText || vue.unref(loading).loadingText,
              progress: vue.unref(loading).progress,
              "show-progress": _ctx.showProgress
            }, null, 8, ["loading-text", "progress", "show-progress"])) : vue.createCommentVNode("", true)
          ], true) : vue.unref(error) && _ctx.showErrorBoundary ? vue.renderSlot(_ctx.$slots, "error", {
            key: 1,
            error: vue.unref(error),
            retry: handleRetry,
            retryable: _ctx.retryable
          }, () => [
            _ctx.useDefaultErrorBoundary ? (vue.openBlock(), vue.createBlock(MonacoErrorBoundary, {
              key: 0,
              error: vue.unref(error),
              "show-retry": _ctx.retryable,
              "show-details": true,
              "show-reload": false,
              "show-report": false,
              onRetry: handleRetry
            }, null, 8, ["error", "show-retry"])) : vue.createCommentVNode("", true)
          ], true) : vue.createCommentVNode("", true),
          vue.withDirectives(vue.createElementVNode("div", {
            ref_key: "container",
            ref: container,
            class: "monaco-editor-container"
          }, null, 512), [
            [vue.vShow, vue.unref(isReady) && !vue.unref(error)]
          ])
        ], 4);
      };
    }
  });
  const DiffEditor = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-9eb8d5bc"]]);
  exports2.CodeEditor = CodeEditor;
  exports2.DiffEditor = DiffEditor;
  exports2.createDefaultOptions = createDefaultOptions;
  exports2.deepMerge = deepMerge;
  exports2.default = CodeEditor;
  exports2.formatSize = formatSize;
  exports2.isSupportedLanguage = isSupportedLanguage;
  exports2.useCodeEditor = useCodeEditor;
  exports2.useCommonEditor = useCommonEditor;
  exports2.useDiffEditor = useDiffEditor;
  exports2.useEditorLifecycle = useEditorLifecycle;
  exports2.useEditorState = useEditorState;
  exports2.warnMsg = warnMsg;
  Object.defineProperties(exports2, { __esModule: { value: true }, [Symbol.toStringTag]: { value: "Module" } });
});
