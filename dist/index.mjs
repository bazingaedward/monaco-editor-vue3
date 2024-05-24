import { ref, onMounted, watch, defineComponent, toRefs, computed, openBlock, createElementBlock, normalizeStyle, unref } from "vue";
import { editor } from "monaco-editor";
const useEditor = (props, emit) => {
  const editorRef = ref();
  const container = ref();
  onMounted(() => {
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
      editorRef.value = editor.createDiffEditor(container.value, options);
      const originalModel = editor.createModel(props.original, props.language);
      const modifiedModel = editor.createModel(props.value, props.language);
      editorRef.value.setModel({
        original: originalModel,
        modified: modifiedModel
      });
    } else {
      editorRef.value = editor.create(container.value, options);
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
    watch(
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
    watch(
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
const _sfc_main = /* @__PURE__ */ defineComponent({
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
    const { editor: editor2, container } = useEditor(props, emit);
    const { width, height } = toRefs(props);
    const style = computed(() => {
      const fixedWidth = width.value.toString().includes("%") ? width.value : `${width.value}px`;
      const fixedHeight = height.value.toString().includes("%") ? height.value : `${height.value}px`;
      return {
        width: fixedWidth,
        height: fixedHeight,
        textAlign: "left"
      };
    });
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", {
        ref_key: "container",
        ref: container,
        style: normalizeStyle(unref(style))
      }, null, 4);
    };
  }
});
export {
  _sfc_main as default
};
