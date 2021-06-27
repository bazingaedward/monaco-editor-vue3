<template>
  <div class="monaco-editor-vue3" style="width:800px;height:800px"></div>
</template>

<script>
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';

export default {
  name: "MonacoEditor",
  props: {
    diffEditor: { type: Boolean, default: false },
    width: {type: [String, Number], default: '100%'},
    height: {type: [String, Number], default: '100%'},
    original: String,       //只有在diff模式下有效
    value: String,
    language: {type: String, default: 'javascript'},
    theme: {type: String, default: 'vs'},
    options: {type: Object, default() {return {};}},
  },
  mounted() {
    this.initMonaco()
  },
  data() {
    return {};
  },
  methods: {
    initMonaco(){
      // init monaco editor
      const { value, language, theme, options } = this;
      console.log(language, 123)
      this.editor = monaco.editor[this.diffEditor ? 'createDiffEditor' : 'create'](this.$el, {
        value: value,
        language: language,
        theme: theme,
        ...options
      });
      this.diffEditor && this._setModel(this.value, this.original);
    },
    _setModel(value, original) {
      //diff模式下设置model
      const { language } = this;
      const originalModel = monaco.editor.createModel(original, language);
      const modifiedModel = monaco.editor.createModel(value, language);
      this.editor.setModel({
        original: originalModel,
        modified: modifiedModel
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.monaco-editor-vue3 {
  text-align: left;
}
</style>