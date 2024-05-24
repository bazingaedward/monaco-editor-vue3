<template>
  <h3>Monaco Editor Vue3</h3>

  <div class="demo-title">Demo1: Simple Editor</div>
  <MonacoEditor
    theme="vs"
    :options="options"
    language="javascript"
    :width="1000"
    :height="600"
    v-model:value="text"
    @change="onChange"
  ></MonacoEditor>

  <!-- <div class="demo-title">Demo2: Diff Editor</div> -->
  <!-- <MonacoEditor
    theme="vs"
    :options="options"
    language="javascript"
    :width="800"
    :height="400"
    :diffEditor="true"
    :original="original"
    :value="value"
  ></MonacoEditor> -->
</template>

<script setup lang="ts">
import MonacoEditor from '../CodeEditor.vue';

const options = {
  colorDecorators: true,
  lineHeight: 24,
  tabSize: 2,
};
const text = ref('world');

const onChange = (v: string) => {
  console.log(v, text.value, 'ar');
};
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
