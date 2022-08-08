# Monaco Editor Vue3
![npm](https://img.shields.io/npm/v/monaco-editor-vue3)
![npm](https://img.shields.io/npm/dt/monaco-editor-vue3)
![NPM](https://img.shields.io/npm/l/monaco-editor-vue3)
![npm bundle size](https://img.shields.io/bundlephobia/min/format-rmb)

[Monaco Editor](https://github.com/Microsoft/monaco-editor) is the code editor that powers VS Code, now it's available as a Vue3 component `<MonacoEditor>` thanks to this project.

## Install

```bash
pnpm install monaco-editor-vue3
```

Or

```bash
yarn add monaco-editor-vue3
```

Or

```bash
npm i monaco-editor-vue3
```

## Usage

### Use ESM version with webpack

Use [monaco-editor-webpack-plugin](https://github.com/Microsoft/monaco-editor-webpack-plugin):

```js
// webpack.config.js
const MonacoEditorPlugin = require('monaco-editor-webpack-plugin')

module.exports = {
  plugins: [
    new MonacoEditorPlugin({
      // https://github.com/Microsoft/monaco-editor-webpack-plugin#options
      // Include a subset of languages support
      // Some language extensions like typescript are so huge that may impact build performance
      // e.g. Build full languages support with webpack 4.0 takes over 80 seconds
      // Languages are loaded on demand at runtime
      languages: ['javascript', 'css', 'html', 'typescript']
    })
  ]
}
```

Then use the component:

```vue
<template>
  <MonacoEditor
    theme="vs"
    :options="options"
    language="javascript"
    :width="800"
    :height="800"
    :diffEditor="true"
    :original="original"
    v-model:value="value"
  ></MonacoEditor>
</template>

<script>
import MonacoEditor from 'monaco-editor-vue3'

export default {
  components: {
    MonacoEditor
  },

  data() {
    return {
      code: 'const noop = () => {}'
    }
  }
}
</script>

<style>
.editor {
  width: 600px;
  height: 800px;
}
</style>
```

### Use ESM version with Vite

[See Stackblitz Demo](https://stackblitz.com/edit/vitejs-vite-bfx1bj)

### Use ESM version with rollup

Use [rollup-plugin-monaco-editor](https://github.com/chengcyber/rollup-plugin-monaco-editor):

```js
// rollup.config.js
import { nodeResolve } from '@rollup/plugin-node-resolve';
import postcss from 'rollup-plugin-postcss';
import commonjs from '@rollup/plugin-commonjs';
import monaco from 'rollup-plugin-monaco-editor';

export default {
  output: {
    format: 'es',
    dir: 'dist',
  },
  // ...other config
  plugins: [
    // ...other plugins
    // handle .css files
    postcss(),
    monaco({
      languages: ['json'],
    }),
    nodeResolve(),
    commonjs(),
  ],
};
```


### Props
- `width`: Editor width, eg: `800px` or `800`.
- `height`: Editor height, eg: `800px` or `800`.
- `options`: The [second argument](https://microsoft.github.io/monaco-editor/api/interfaces/monaco.editor.ieditorconstructionoptions.html) of [`monaco.editor.create`](https://microsoft.github.io/monaco-editor/api/modules/monaco.editor.html#create).
- `value`: A shortcut to set `options.value`.
- `theme`: A shortcut to set `options.theme`.
- `language`: A shortcut to set `options.language`.
- `diffEditor`: `boolean` Indicate that this is a DiffEditor, `false` by default.
- `original`: if `diffEditor` set `true`, this will be used .

### Component Events

#### `editorWillMount`

- Params:
  - `monaco`: [`monaco module`](https://microsoft.github.io/monaco-editor/api/index.html)

Called before mounting the editor.

#### `editorDidMount`

- Params:
  - `editor`: [`IStandaloneCodeEditor`](https://microsoft.github.io/monaco-editor/api/interfaces/monaco.editor.istandalonecodeeditor.html) for normal editor, [`IStandaloneDiffEditor`](https://microsoft.github.io/monaco-editor/api/interfaces/monaco.editor.istandalonediffeditor.html) for diff editor.

Called when the editor is mounted.

#### `change`

Editor value is updated.

- Params:
  - `value`: New editor value.
  - `event`: The `event` from [`onDidChangeModelContent`](https://microsoft.github.io/monaco-editor/api/interfaces/monaco.editor.istandalonecodeeditor.html#ondidchangemodelcontent).

#### Editor Events

You can listen to the editor events directly like this:

```vue
<template>
  <MonacoEditor v-model="code" @editorDidMount="editorDidMount" />
</template>

<script>
export default {
  methods: {
    editorDidMount(editor) {
      // Listen to `scroll` event
      editor.onDidScrollChange(e => {
        console.log(e)
      })
    }
  },

  data() {
    return {
      code: '...'
    }
  }
}
</script>
```

Refer to [this page](https://microsoft.github.io/monaco-editor/api/interfaces/monaco.editor.istandalonecodeeditor.html) for all editor events.

## Typescript
create `monaco-editor-vue3.d.ts` in your root.
```ts
declare module "monaco-editor-vue3";
```
This will allow ts compilation without errors, but may not include all the types.

## Contributing

1. Fork it!
2. Create your feature branch: `git checkout -b my-new-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin my-new-feature`
5. Submit a pull request :D

## Author

**Monaco Editor Vue3** © [bazingaedward](https://github.com/bazingaedward), Released under the [MIT](./LICENSE) License.<br>
Authored and maintained by egoist with help from contributors ([list](https://github.com/bazingaedward/monaco-editor-vue3/contributors)).
