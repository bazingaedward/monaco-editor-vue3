(function(global, factory) {
  typeof exports === "object" && typeof module !== "undefined" ? module.exports = factory(require("vue"), require("monaco-editor")) : typeof define === "function" && define.amd ? define(["vue", "monaco-editor"], factory) : (global = typeof globalThis !== "undefined" ? globalThis : global || self, global["monaco-editor-vue3"] = factory(global.Vue, global["monaco-editor"]));
})(this, function(vue, monacoEditor) {
  "use strict";
  const useEditor = (props, emit) => {
    const editorRef = vue.ref();
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
      if (props.diffEditor) {
        editorRef.value = monacoEditor.editor.createDiffEditor(container.value, options);
        const originalModel = monacoEditor.editor.createModel(props.original, props.language);
        const modifiedModel = monacoEditor.editor.createModel(props.value, props.language);
        editorRef.value.setModel({
          original: originalModel,
          modified: modifiedModel
        });
      } else {
        editorRef.value = monacoEditor.editor.create(container.value, options);
        editorRef.value.onDidChangeModelContent((event) => {
          debugger;
          const value = editorRef.value.getValue();
          if (props.value !== value) {
            emit("change", value, event);
            emit("update:value", value);
          }
        });
      }
      emit("editorDidMount", editorRef.value);
      vue.watch(
        () => props.options,
        (opt) => {
          var _a;
          if (!opt)
            return;
          (_a = editorRef.value) == null ? void 0 : _a.updateOptions(opt);
        },
        {
          deep: true
        }
      );
      vue.watch(
        () => props.value,
        (v) => {
          var _a;
          (_a = editorRef.value) == null ? void 0 : _a.setValue(v);
        }
      );
    });
    return {
      editorRef,
      container
    };
  };
  const _sfc_main = /* @__PURE__ */ vue.defineComponent({
    __name: "MonacoEditor",
    props: {
      diffEditor: { type: Boolean, default: false },
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
      const { editor, container } = useEditor(props, emit);
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
  return _sfc_main;
});
