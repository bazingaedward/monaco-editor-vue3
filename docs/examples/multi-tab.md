# Multi-Tab Editor

The `MultiTabEditor` component allows you to manage multiple files within a single editor instance, providing a VS Code-like experience.

## Basic Usage

The component maintains independent undo/redo history and scroll positions for each tab using Monaco's model-switching feature.

<MultiTabEditor 
  height="400px"
  :tabs="[
    { id: '1', title: 'main.js', value: 'const msg = \'Hello World\';\nconsole.log(msg);', language: 'javascript' },
    { id: '2', title: 'style.css', value: 'body {\n  background: #f0f0f0;\n  color: #333;\n}', language: 'css' },
    { id: '3', title: 'data.json', value: '{\n  \"name\": \"monaco-editor-vue3\",\n  \"version\": \"1.1.0\"\n}', language: 'json' }
  ]"
/>

## Features

- **Efficiency**: Only one editor instance is created; tabs switch using `setModel()`.
- **State Persistence**: Each tab automatically saves and restores its scroll position and cursor state.
- **Dynamic Tabs**: Supports adding and closing tabs programmatically or via UI.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `tabs` | `TabItem[]` | `[]` | Array of tab data (id, title, value, language). |
| `activeTabId` | `string` | First tab | The ID of the currently active tab. |
| `closable` | `boolean` | `true` | Whether tabs can be closed. |
| `addable` | `boolean` | `false` | Whether to show the "+" button for adding tabs. |

## Events

- `@tab-switch`: Emitted when active tab changes.
- `@tab-close`: Emitted when a tab is closed.
- `@tab-add`: Emitted when a new tab is added.
- `@add-click`: Emitted when the "+" button is clicked.
