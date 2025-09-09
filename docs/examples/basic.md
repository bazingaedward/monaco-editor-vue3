# Basic Examples

This page demonstrates the basic usage of Monaco Editor Vue3 components, including common use cases for the single-file editor and diff editor.

## Diff Editor

The DiffEditor is used to compare two versions of code, supporting side-by-side display and highlighting changes.

**Key Features:**
- Side-by-side diff comparison
- Highlighting of added, deleted, and modified content
- Syntax highlighting for various programming languages
- Responsive layout

<!-- <DiffEditor
  theme="vs"
  :options="options"
  language="javascript"
  :height="600"
  v-model:value="diff"
  :original="'world'"
/> -->

## JavaScript / TypeScript Editor

Full support for JavaScript and TypeScript syntax highlighting, intelligent suggestions, and error checking.

**Key Features:**
- Syntax highlighting and auto-completion
- Real-time error checking
- Code formatting
- Smart refactoring suggestions

<ClientOnly>

<CodeEditor
  theme="vs"
  :options="options"
  language="javascript"
  :height="600"
  v-model:value="tsString"
/>
</ClientOnly>

<script setup lang="ts">
import { ref } from 'vue'
import { tsString, jsonString, cssString, htmlString, sqlString } from './constant'

// Reactive data
const diff = ref('hello')

// Editor configuration options
const options = {
  // Enable color decorators
  colorDecorators: true,
  // Set line height
  lineHeight: 24,
  // Set tab size
  tabSize: 2,
  // Enable automatic layout
  automaticLayout: true,
  // Show line numbers
  lineNumbers: 'on' as const,
  // Enable code folding
  folding: true,
  // Enable bracket matching
  matchBrackets: 'always' as const,
  // Enable scrollbar
  scrollBeyondLastLine: false,
}
</script>

---

## Configuration Explanation

The above examples use a unified editor configuration:

| Option              | Value      | Description                                 |
|---------------------|-----------|---------------------------------------------|
| `colorDecorators`   | `true`    | Enable color decorators for CSS preview      |
| `lineHeight`        | `24`      | Set line height to 24px                     |
| `tabSize`           | `2`       | Set tab to 2 spaces                         |
| `automaticLayout`   | `true`    | Enable automatic layout adjustment          |
| `lineNumbers`       | `'on'`    | Show line numbers                           |
| `folding`           | `true`    | Enable code folding                         |
| `matchBrackets`     | `'always'`| Always highlight matching brackets          |
| `scrollBeyondLastLine` | `false` | Prevent scrolling beyond the last line      |

For more options, see the [Monaco Editor official docs](https://microsoft.github.io/monaco-editor/docs.html).

## JSON Editor

Optimized for editing JSON data, providing syntax validation, formatting, and folding features.

**Key Features:**
- JSON syntax validation and error hints
- Auto-formatting and beautification
- Folding for objects and arrays
- Smart bracket matching

<!-- <CodeEditor
  theme="vs"
  :options="options"
  language="json"
  :height="600"
  v-model:value="jsonString"
/> -->

## CSS / Less / Sass Editor

Supports modern CSS preprocessors, with property suggestions and color preview features.

**Key Features:**
- CSS property suggestions
- Color value preview and selector
- Less/Sass syntax support
- Auto-completion for CSS selectors

<!-- <CodeEditor
  theme="vs"
  :options="options"
  language="css"
  :height="600"
  v-model:value="cssString"
/> -->

## HTML / Handlebars / Razor Editor

Supports HTML and template engines, with tag completion and attribute suggestions.

**Key Features:**
- HTML tag and attribute auto-completion
- Template syntax highlighting (Handlebars, Razor)
- Auto-indentation for nested tags
- Real-time HTML validation

<!-- <CodeEditor
  theme="vs"
  :options="options"
  language="html"
  :height="600"
  v-model:value="htmlString"
/> -->

## SQL Editor

Professional SQL query editor supporting multiple database dialects.

**Key Features:**
- SQL keyword highlighting
- Table and field name suggestions
- Query syntax validation
- Support for multiple database dialects

<!-- <CodeEditor
  theme="vs"
  :options="options"
  language="sql"
  :height="600"
  v-model:value="sqlString"
/> -->
