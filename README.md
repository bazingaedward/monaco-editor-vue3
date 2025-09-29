# Monaco Editor Vue3

![npm](https://img.shields.io/npm/v/monaco-editor-vue3)
![npm](https://img.shields.io/npm/dt/monaco-editor-vue3)
![NPM](https://img.shields.io/npm/l/monaco-editor-vue3)
![npm bundle size](https://img.shields.io/bundlephobia/min/format-rmb)

[Monaco Editor](https://github.com/Microsoft/monaco-editor) is the code editor that powers VS Code, now it's available as Vue 3 components `<CodeEditor>` and `<DiffEditor>` with full TypeScript support and modern Vue 3 features.

## ✨ Features

- 🎯 **Full TypeScript Support** - Built with TypeScript for better development experience
- 🎨 **Rich Code Editing** - Syntax highlighting, auto-completion, IntelliSense
- 🌍 **Multi-Language Support** - 20+ programming languages including JavaScript, TypeScript, Python, Java
- 🎭 **Theme Customization** - Built-in themes (VS, VS Dark, High Contrast) with custom theme support
- 🔄 **Two-Way Binding** - Full v-model support for seamless Vue 3 integration
- 📦 **Lightweight** - Tree-shakable and optimized for production
- 🛠 **Developer Friendly** - Comprehensive error handling, loading states, and lifecycle hooks
- 🎪 **Advanced Features** - Dual editor support (CodeEditor + DiffEditor), Hooks API, custom components

## 📚 Documentation

- [📖 Complete Guide](https://bazingaedward.github.io/monaco-editor-vue3/guide.html)
- [🔧 API Reference](https://bazingaedward.github.io/monaco-editor-vue3/api.html)
- [🎮 Examples](https://bazingaedward.github.io/monaco-editor-vue3/examples/)
- [🌐 Live Demo](https://stackblitz.com/edit/vitejs-vite-e8jjho)

## 📦 Install

```bash
# Using pnpm (recommended)
pnpm add monaco-editor-vue3 monaco-editor

# Using yarn
yarn add monaco-editor-vue3 monaco-editor

# Using npm
npm install monaco-editor-vue3 monaco-editor
```

## 🚀 Quick Start

### Basic CodeEditor

```vue
<template>
  <div style="height: 400px;">
    <CodeEditor
      v-model:value="code"
      language="javascript"
      theme="vs-dark"
      :options="editorOptions"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { CodeEditor } from 'monaco-editor-vue3';

const code = ref(`function hello() {
  console.log('Hello, Monaco Editor Vue3!');
}`);

const editorOptions = {
  fontSize: 14,
  minimap: { enabled: false },
  automaticLayout: true
};
</script>
```

### DiffEditor for Code Comparison

```vue
<template>
  <div style="height: 400px;">
    <DiffEditor
      v-model:value="modifiedCode"
      :original="originalCode"
      language="javascript"
      theme="vs"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { DiffEditor } from 'monaco-editor-vue3';

const originalCode = ref('const x = 1;');
const modifiedCode = ref('const x = 2;');
</script>
```

## ⚙️ Build Tool Integration

### Webpack

Use [monaco-editor-webpack-plugin](https://github.com/Microsoft/monaco-editor-webpack-plugin):

```js
// webpack.config.js
const MonacoEditorPlugin = require('monaco-editor-webpack-plugin');

module.exports = {
  plugins: [
    new MonacoEditorPlugin({
      // https://github.com/Microsoft/monaco-editor-webpack-plugin#options
      // Include a subset of languages support
      // Some language extensions like typescript are so huge that may impact build performance
      // e.g. Build full languages support with webpack 4.0 takes over 80 seconds
      // Languages are loaded on demand at runtime
      languages: ['javascript', 'css', 'html', 'typescript'],
    }),
  ],
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      }
    ]
  }
};
```

### Vite

For Vite projects, the CSS import is handled automatically.

```ts
// main.ts
import { createApp } from 'vue';
import App from './App.vue';

createApp(App).mount('#app');
```

Check out our [live demo](https://stackblitz.com/edit/vitejs-vite-e8jjho) for a complete Vite setup.

### Rollup

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
    // Handle .css files (important for Monaco Editor Vue3 styles)
    postcss({
      extract: true,
      minimize: true,
    }),
    monaco({
      languages: ['json'],
    }),
    nodeResolve(),
    commonjs(),
  ],
};
```

## 🎨 Supported Languages & Themes

### Programming Languages

Monaco Editor Vue3 supports 20+ programming languages:

| Language | Identifier | Features |
|----------|------------|----------|
| JavaScript | `javascript` | ✅ Syntax highlighting, IntelliSense, Error detection |
| TypeScript | `typescript` | ✅ Syntax highlighting, IntelliSense, Type checking |
| JSON | `json` | ✅ Syntax highlighting, Validation, Formatting |
| HTML | `html` | ✅ Syntax highlighting, Auto-completion |
| CSS | `css` | ✅ Syntax highlighting, Color decorators |
| Python | `python` | ✅ Syntax highlighting, Basic IntelliSense |
| Java | `java` | ✅ Syntax highlighting, Basic IntelliSense |
| C++ | `cpp` | ✅ Syntax highlighting |
| SQL | `sql` | ✅ Syntax highlighting, Keywords |
| Markdown | `markdown` | ✅ Syntax highlighting, Preview |

And many more: `xml`, `yaml`, `shell`, `php`, `go`, `rust`, `swift`, etc.

### Built-in Themes

| Theme | Identifier | Description |
|-------|------------|-------------|
| VS Light | `vs` | Light theme similar to VS Code light |
| VS Dark | `vs-dark` | Dark theme similar to VS Code dark |
| High Contrast Black | `hc-black` | High contrast dark theme |
| High Contrast Light | `hc-light` | High contrast light theme |

### Custom Themes

```vue
<script setup>
import { CodeEditor } from 'monaco-editor-vue3';
import { ref } from 'vue';

const code = ref('console.log("Hello World")');

// Define custom theme
const customTheme = {
  base: 'vs-dark',
  inherit: true,
  rules: [
    { token: 'comment', foreground: '6A9955' },
    { token: 'keyword', foreground: 'C586C0' }
  ],
  colors: {
    'editor.background': '#1E1E1E'
  }
};
</script>
```

## 🎮 API Overview

### CodeEditor Props

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `value` | `string` | `''` | Editor content (supports v-model) |
| `language` | `string` | `'javascript'` | Programming language |
| `theme` | `string` | `'vs'` | Editor theme |
| `width` | `string \| number` | `'100%'` | Editor width |
| `height` | `string \| number` | `'100%'` | Editor height |
| `options` | `EditorOptions` | `{}` | Monaco editor options |

### Events

#### `editorWillMount`

- **Params**: `monaco` - [Monaco module](https://microsoft.github.io/monaco-editor/api/index.html)
- **Description**: Called before mounting the editor

#### `editorDidMount`

- **Params**: `editor` - [IStandaloneCodeEditor](https://microsoft.github.io/monaco-editor/api/interfaces/monaco.editor.istandalonecodeeditor.html) for CodeEditor, [IStandaloneDiffEditor](https://microsoft.github.io/monaco-editor/api/interfaces/monaco.editor.istandalonediffeditor.html) for DiffEditor
- **Description**: Called when the editor is mounted

#### `change`

- **Params**: 
  - `value` - New editor value
  - `event` - The event from [onDidChangeModelContent](https://microsoft.github.io/monaco-editor/api/interfaces/monaco.editor.istandalonecodeeditor.html#ondidchangemodelcontent)
- **Description**: Editor value is updated

### Advanced Features

#### Loading State & Error Handling

```vue
<template>
  <CodeEditor
    v-model:value="code"
    language="javascript"
    :lifecycle="lifecycleHooks"
    @error="handleError"
    @ready="handleReady"
    @loading="handleLoading"
  >
    <!-- Custom loading slot -->
    <template #loading="{ loading, progress }">
      <div>Loading... {{ progress }}%</div>
    </template>
    
    <!-- Custom error slot -->
    <template #error="{ error, retry }">
      <div>Error: {{ error.message }}</div>
      <button @click="retry">Retry</button>
    </template>
  </CodeEditor>
</template>
```

#### Hooks API

```vue
<script setup>
import { useCodeEditor } from 'monaco-editor-vue3';

const { editor, loading, error } = useCodeEditor({
  value: 'console.log("Hello World")',
  language: 'javascript',
  theme: 'vs-dark'
});
</script>
```

## 🔧 TypeScript Support

Monaco Editor Vue3 is built with TypeScript and provides comprehensive type definitions out of the box.

### Auto Type Inference

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { CodeEditor, type EditorOptions } from 'monaco-editor-vue3';

const code = ref<string>('console.log("Hello World")');
const options: EditorOptions = {
  fontSize: 14,
  minimap: { enabled: false }
};
</script>
```

### Editor Instance Types

```ts
import type { 
  IStandaloneCodeEditor, 
  IStandaloneDiffEditor 
} from 'monaco-editor';

// CodeEditor instance type
const handleCodeEditorMount = (editor: IStandaloneCodeEditor) => {
  editor.focus();
};

// DiffEditor instance type  
const handleDiffEditorMount = (editor: IStandaloneDiffEditor) => {
  editor.getOriginalEditor().focus();
};
```

### Custom Type Declaration (if needed)

If you encounter any type issues, create `types/monaco-editor-vue3.d.ts`:

```ts
declare module 'monaco-editor-vue3' {
  // Custom type declarations
}
```

## 🔧 Troubleshooting

### Editor Not Displaying Correctly

### Common Issues

| Issue | Solution |
|-------|----------|
| Editor container is empty | 样式文件依赖说明已移除 |
| Loading spinner not showing | 样式文件依赖说明已移除 |
| Error boundary not styled | 样式文件依赖说明已移除 |
| Custom themes not working | Check if Monaco Editor worker files are loaded correctly |

### Build Issues

If you encounter build issues:

1. **Webpack**: Ensure you're using `monaco-editor-webpack-plugin`
2. **Vite**: Configure worker files properly (see our live demo)
3. **Rollup**: Use `rollup-plugin-monaco-editor` and `postcss` for CSS processing

## 🤝 Contributing

We welcome contributions from the community! Here's how you can help:

### Development Setup

```bash
# Clone the repository
git clone https://github.com/bazingaedward/monaco-editor-vue3.git
cd monaco-editor-vue3

# Install dependencies
pnpm install

# Start development server
pnpm dev

# Run tests
pnpm test

# Build the project
pnpm build
```

### Development Workflow

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes and add tests
4. Ensure all tests pass: `pnpm test`
5. Lint your code: `pnpm lint:fix`
6. Commit your changes: `pnpm commit` (uses conventional commits)
7. Push to the branch: `git push origin feature/amazing-feature`
8. Submit a pull request

### Documentation

To contribute to documentation:

```bash
# Start docs development server
pnpm docs:dev

# Build documentation
pnpm docs:build
```

## 📄 License

This project is licensed under the [MIT License](./LICENSE).

## 🙏 Acknowledgments

- [Monaco Editor](https://github.com/Microsoft/monaco-editor) - The amazing code editor that powers VS Code
- [Vue.js](https://vuejs.org/) - The progressive JavaScript framework
- All [contributors](https://github.com/bazingaedward/monaco-editor-vue3/contributors) who have helped make this project better

## 💬 Community & Support

- [🐛 Report Issues](https://github.com/bazingaedward/monaco-editor-vue3/issues)
- [💡 Feature Requests](https://github.com/bazingaedward/monaco-editor-vue3/issues/new?template=feature_request.md)
- [💬 Discussions](https://github.com/bazingaedward/monaco-editor-vue3/discussions)
- [📚 Documentation](https://bazingaedward.github.io/monaco-editor-vue3/)

---

Made with ❤️ by [bazingaedward](https://github.com/bazingaedward) and [contributors](https://github.com/bazingaedward/monaco-editor-vue3/contributors).
