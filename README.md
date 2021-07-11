# Monaco Editor Vue3

[![NPM version](https://img.shields.io/npm/v/vue-monaco.svg?style=flat)](https://npmjs.com/package/monaco-editor-vue3) [![NPM downloads](https://img.shields.io/npm/dm/vue-monaco.svg?style=flat)](https://npmjs.com/package/monaco-editor-vue3) [![donate](https://img.shields.io/badge/$-donate-ff69b4.svg?maxAge=2592000&style=flat)](https://github.com/bazingaedward/donate)

[Monaco Editor](https://github.com/Microsoft/monaco-editor) is the code editor that powers VS Code, now it's available as a Vue3 component `<MonacoEditor>` thanks to this project.

## Install

```bash
npm install monaco-editor-vue3
```

Or

```bash
yarn add monaco-editor-vue3
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
    class="editor" 
    v-model="code" 
    language="javascript" 
  />
</template>

<script>
import MonacoEditor from 'vue-monaco'

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

## Contributing

1. Fork it!
2. Create your feature branch: `git checkout -b my-new-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin my-new-feature`
5. Submit a pull request :D

## Author

**Monaco Editor Vue3** © [bazingaedward](https://github.com/bazingaedward), Released under the [MIT](./LICENSE) License.<br>
Authored and maintained by egoist with help from contributors ([list](https://github.com/bazingaedward/monaco-editor-vue3/contributors)).