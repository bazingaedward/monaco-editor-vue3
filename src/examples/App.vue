<template>
  <MonacoEditor
    theme="vs"
    :options="options"
    language="javascript"
    :width="800"
    :height="800"
  ></MonacoEditor>
  <MonacoEditor
    theme="vs"
    :options="options"
    language="javascript"
    :width="800"
    :height="800"
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
    MonacoEditor
  },
  data(){
    return {
      options: {
        colorDecorators: true,
        lineHeight: 24,
        tabSize: 2
      },
      original: 'hello',
      value: 'world',
      width: 800,
      theme: 'vs'
    }
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
</style>
