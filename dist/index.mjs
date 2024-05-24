import { ref, onMounted, watch, defineComponent, toRefs, computed, openBlock, createElementBlock, normalizeStyle, unref } from "vue";
import { editor } from "monaco-editor";
const useCodeEditor = (props, emit) => {
  let editorInstance = null;
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
    editorInstance = editor.create(container.value, options);
    editorInstance.onDidChangeModelContent((event) => {
      const value = editorInstance.getValue();
      if (props.value !== value) {
        emit("change", value, event);
        emit("update:value", value);
      }
    });
    emit("editorDidMount", editorInstance);
  });
  watch(
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
const _sfc_main = /* @__PURE__ */ defineComponent({
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
  _sfc_main as CodeEditor,
  _sfc_main as default
};
