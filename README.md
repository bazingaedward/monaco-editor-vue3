# Monaco Editor Vue3
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
  <MonacoEditor class="editor" v-model="code" language="javascript" />
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

## Contributing

1. Fork it!
2. Create your feature branch: `git checkout -b my-new-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin my-new-feature`
5. Submit a pull request :D

## Author

**Monaco Editor Vue3** © [bazingaedward](https://github.com/bazingaedward), Released under the [MIT](./LICENSE) License.<br>
Authored and maintained by egoist with help from contributors ([list](https://github.com/bazingaedward/monaco-editor-vue3/contributors)).