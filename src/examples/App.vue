<template>
  <h3>Monaco Editor Vue3</h3>

  <div class="demo-title">Demo1: Simple Editor</div>
  <MonacoEditor
    theme="vs"
    :options="options"
    language="javascript"
    :width="800"
    :height="600"
    v-model:value="test"
  ></MonacoEditor>

  <div class="demo-title">Demo2: Diff Editor</div>
  <MonacoEditor
    theme="vs"
    :options="options"
    language="javascript"
    :width="800"
    :height="400"
    :diffEditor="true"
    :original="original"
    :value="value"
  ></MonacoEditor>
</template>

<script>
import { defineComponent } from 'vue'
import MonacoEditor from '../MonacoEditor.vue'

export default defineComponent({
  name: 'App',
  components: {
    MonacoEditor,
  },
  data() {
    return {
      options: {
        colorDecorators: true,
        lineHeight: 24,
        tabSize: 2,
      },
      original: 'hello',
      value: 'world',
      width: 800,
      theme: 'vs',
      test: '',
    }
  },
  watch: {
    test: function (val) {
      console.log(val, 11)
    },
  },
  methods: {
    handleChange(e) {
      console.log(e, 11)
    },
  },
})
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

.demo-title {
  text-align: left;
  font-style: bold;
  margin: 20px 0 10px;
}
</style>
