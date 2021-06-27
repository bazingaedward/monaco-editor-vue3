<template>
  <MonacoEditor
    theme="vs"
    :options="options"
    language="json"
  ></MonacoEditor>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import MonacoEditor from './Editor.vue'

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
      }
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
