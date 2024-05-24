# Examples

## Javascript / Typescript

<CodeEditor
theme="vs"
:options="options"
language="javascript"
:height="600"
v-model:value="tsString"
/>

<script setup lang="ts">
  import {ref} from 'vue'
  import {CodeEditor} from '../dist/index.mjs'
  import {tsString, jsonString, cssString, htmlString, sqlString} from './constant'

  const options = {
  colorDecorators: true,
  lineHeight: 24,
  tabSize: 2,
};
</script>

## JSON

<CodeEditor
theme="vs"
:options="options"
language="json"
:height="600"
v-model:value="jsonString"
/>

## CSS / Less / Sass

<CodeEditor
theme="vs"
:options="options"
language="css"
:height="600"
v-model:value="cssString"
/>

## Html / Handlebars / Razor

<CodeEditor
theme="vs"
:options="options"
language="html"
:height="600"
v-model:value="htmlString"
/>

## SQL

<CodeEditor
theme="vs"
:options="options"
language="sql"
:height="600"
v-model:value="sqlString"
/>
