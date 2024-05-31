(function(global, factory) {
  typeof exports === "object" && typeof module !== "undefined" ? factory(exports, require("vue"), require("monaco-editor")) : typeof define === "function" && define.amd ? define(["exports", "vue", "monaco-editor"], factory) : (global = typeof globalThis !== "undefined" ? globalThis : global || self, factory(global["monaco-editor-vue3"] = {}, global.Vue, global["monaco-editor"]));
})(this, function(exports2, vue, monacoEditor) {
  "use strict";
  const useCodeEditor = (props, emit) => {
    let editorInstance = null;
    const container = vue.ref();
    vue.onMounted(() => {
      if (!container.value)
        return;
      emit("editorWillMount");
      const options = {
        value: props.value,
        language: props.language,
        theme: props.theme,
        ...props.options
      };
      editorInstance = monacoEditor.editor.create(container.value, options);
      editorInstance.onDidChangeModelContent((event) => {
        const value = editorInstance.getValue();
        if (props.value !== value) {
          emit("change", value, event);
          emit("update:value", value);
        }
      });
      emit("editorDidMount", editorInstance);
    });
    vue.watch(
      () => props.options,
      (opt) => {
        if (!opt)
          return;
        editorInstance == null ? void 0 : editorInstance.updateOptions(opt);
      },
      {
        deep: true
      }
    );
    return {
      editorInstance,
      container
    };
  };
  const useDiffEditor = (props, emit) => {
    let editorInstance = null;
    const container = vue.ref();
    vue.onMounted(() => {
      if (!container.value)
        return;
      emit("editorWillMount");
      const options = {
        value: props.value,
        language: props.language,
        theme: props.theme,
        ...props.options
      };
      editorInstance = monacoEditor.editor.createDiffEditor(container.value, options);
      const originalModel = monacoEditor.editor.createModel(props.original ?? "", props.language);
      const modifiedModel = monacoEditor.editor.createModel(props.value ?? "", props.language);
      editorInstance.setModel({
        original: originalModel,
        modified: modifiedModel
      });
      editorInstance.getModifiedEditor().onDidChangeModelContent((event) => {
        const value = (editorInstance == null ? void 0 : editorInstance.getModifiedEditor()).getValue();
        if (props.value !== value) {
          emit("change", value, event);
          emit("update:value", value);
        }
      });
      emit("editorDidMount", editorInstance);
    });
    return {
      editorInstance,
      container
    };
  };
  const _sfc_main$1 = /* @__PURE__ */ vue.defineComponent({
    __name: "CodeEditor",
    props: {
      width: { default: "100%" },
      height: { default: "100%" },
      original: {},
      value: { default: "" },
      theme: { default: "vs" },
      language: { default: "javascript" },
      options: { default: () => ({}) }
    },
    emits: ["editorWillMount", "editorDidMount", "change", "update:value"],
    setup(__props, { emit: __emit }) {
      const props = __props;
      const emit = __emit;
      const { container } = useCodeEditor(props, emit);
      const { width, height } = vue.toRefs(props);
      const style = vue.computed(() => {
        const fixedWidth = width.value.toString().includes("%") ? width.value : `${width.value}px`;
        const fixedHeight = height.value.toString().includes("%") ? height.value : `${height.value}px`;
        return {
          width: fixedWidth,
          height: fixedHeight,
          textAlign: "left"
        };
      });
      return (_ctx, _cache) => {
        return vue.openBlock(), vue.createElementBlock("div", {
          ref_key: "container",
          ref: container,
          style: vue.normalizeStyle(vue.unref(style))
        }, null, 4);
      };
    }
  });
  const _sfc_main = /* @__PURE__ */ vue.defineComponent({
    __name: "DiffEditor",
    props: {
      width: { default: "100%" },
      height: { default: "100%" },
      original: { default: "" },
      value: { default: "" },
      theme: { default: "vs" },
      language: { default: "javascript" },
      options: { default: () => ({}) }
    },
    emits: ["editorWillMount", "editorDidMount", "change", "update:value"],
    setup(__props, { emit: __emit }) {
      const props = __props;
      const emit = __emit;
      const { container } = useDiffEditor(props, emit);
      const { width, height } = vue.toRefs(props);
      const style = vue.computed(() => {
        const fixedWidth = width.value.toString().includes("%") ? width.value : `${width.value}px`;
        const fixedHeight = height.value.toString().includes("%") ? height.value : `${height.value}px`;
        return {
          width: fixedWidth,
          height: fixedHeight,
          textAlign: "left"
        };
      });
      return (_ctx, _cache) => {
        return vue.openBlock(), vue.createElementBlock("div", {
          ref_key: "container",
          ref: container,
          style: vue.normalizeStyle(vue.unref(style))
        }, null, 4);
      };
    }
  });
  exports2.CodeEditor = _sfc_main$1;
  exports2.DiffEditor = _sfc_main;
  exports2.default = _sfc_main$1;
  Object.defineProperties(exports2, { __esModule: { value: true }, [Symbol.toStringTag]: { value: "Module" } });
});
