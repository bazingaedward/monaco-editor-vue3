(function(global, factory) {
  typeof exports === "object" && typeof module !== "undefined" ? module.exports = factory(require("vue"), require("monaco-editor")) : typeof define === "function" && define.amd ? define(["vue", "monaco-editor"], factory) : (global = typeof globalThis !== "undefined" ? globalThis : global || self, global["monaco-editor-vue3"] = factory(global.Vue, global["monaco-editor"]));
})(this, function(vue, monaco) {
  "use strict";
  function _interopNamespace(e) {
    if (e && e.__esModule)
      return e;
    const n = Object.create(null, { [Symbol.toStringTag]: { value: "Module" } });
    if (e) {
      for (const k in e) {
        if (k !== "default") {
          const d = Object.getOwnPropertyDescriptor(e, k);
          Object.defineProperty(n, k, d.get ? d : {
            enumerable: true,
            get: () => e[k]
          });
        }
      }
    }
    n.default = e;
    return Object.freeze(n);
  }
  const monaco__namespace = /* @__PURE__ */ _interopNamespace(monaco);
  const _export_sfc = (sfc, props) => {
    const target = sfc.__vccOpts || sfc;
    for (const [key, val] of props) {
      target[key] = val;
    }
    return target;
  };
  const _sfc_main = vue.defineComponent({
    name: "MonacoEditor",
    props: {
      diffEditor: { type: Boolean, default: false },
      width: { type: [String, Number], default: "100%" },
      height: { type: [String, Number], default: "100%" },
      original: String,
      value: String,
      language: { type: String, default: "javascript" },
      theme: { type: String, default: "vs" },
      options: {
        type: Object,
        default() {
          return {};
        }
      }
    },
    emits: ["editorWillMount", "editorDidMount", "change", "update:value"],
    setup(props) {
      const { width, height } = vue.toRefs(props);
      const style = vue.computed(() => {
        const fixedWidth = width.value.toString().includes("%") ? width.value : `${width.value}px`;
        const fixedHeight = height.value.toString().includes("%") ? height.value : `${height.value}px`;
        return {
          width: fixedWidth,
          height: fixedHeight,
          "text-align": "left"
        };
      });
      return {
        style
      };
    },
    mounted() {
      this.initMonaco();
    },
    beforeUnmount() {
      this.editor && this.editor.dispose();
    },
    methods: {
      initMonaco() {
        this.$emit("editorWillMount", monaco__namespace);
        const { value, language, theme, options } = this;
        this.editor = monaco__namespace.editor[this.diffEditor ? "createDiffEditor" : "create"](this.$el, {
          value,
          language,
          theme,
          ...options
        });
        this.diffEditor && this._setModel(this.value, this.original);
        const editor = this._getEditor();
        editor && editor.onDidChangeModelContent((event) => {
          const value2 = editor.getValue();
          if (this.value !== value2) {
            this.$emit("change", value2, event);
            this.$emit("update:value", value2);
          }
        });
        this.$emit("editorDidMount", this.editor);
      },
      _setModel(value, original) {
        const { language } = this;
        const originalModel = monaco__namespace.editor.createModel(original, language);
        const modifiedModel = monaco__namespace.editor.createModel(value, language);
        this.editor.setModel({
          original: originalModel,
          modified: modifiedModel
        });
      },
      _setValue(value) {
        let editor = this._getEditor();
        if (editor)
          return editor.setValue(value);
      },
      _getValue() {
        let editor = this._getEditor();
        if (!editor)
          return "";
        return editor.getValue();
      },
      _getEditor() {
        if (!this.editor)
          return null;
        return this.diffEditor ? this.editor.modifiedEditor : this.editor;
      },
      _setOriginal() {
        const { original } = this.editor.getModel();
        original.setValue(this.original);
      }
    },
    watch: {
      options: {
        deep: true,
        handler(options) {
          this.editor.updateOptions(options);
        }
      },
      value() {
        this.value !== this._getValue() && this._setValue(this.value);
      },
      original() {
        this._setOriginal();
      },
      language() {
        if (!this.editor)
          return;
        if (this.diffEditor) {
          const { original, modified } = this.editor.getModel();
          monaco__namespace.editor.setModelLanguage(original, this.language);
          monaco__namespace.editor.setModelLanguage(modified, this.language);
        } else
          monaco__namespace.editor.setModelLanguage(this.editor.getModel(), this.language);
      },
      theme() {
        monaco__namespace.editor.setTheme(this.theme);
      }
    }
  });
  function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("div", {
      class: "monaco-editor-vue3",
      style: vue.normalizeStyle(_ctx.style)
    }, null, 4);
  }
  const MonacoEditor = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render]]);
  const main = {
    install: (app) => {
      app.component(MonacoEditor.name, MonacoEditor);
    }
  };
  return main;
});
