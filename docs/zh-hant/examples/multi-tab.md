# 多页签编辑器

`MultiTabEditor` 组件允许您在单个编辑器实例中管理多个文件，提供类似 VS Code 的使用体验。

## 基础用法

该组件利用 Monaco 的 Model 切换功能，为每个页签维护独立的撤销/重做历史和滚动位置。

<MultiTabEditor 
  height="400px"
  :tabs="[
    { id: '1', title: 'main.js', value: 'const msg = \'你好，世界\';\nconsole.log(msg);', language: 'javascript' },
    { id: '2', title: 'style.css', value: 'body {\n  background: #f0f0f0;\n  color: #333;\n}', language: 'css' },
    { id: '3', title: 'data.json', value: '{\n  \"name\": \"monaco-editor-vue3\",\n  \"version\": \"1.1.0\"\n}', language: 'json' }
  ]"
/>

## 核心特性

- **高效性能**：仅创建一个编辑器实例，通过 `setModel()` 切换页签内容。
- **状态保持**：每个页签自动保存并恢复其滚动位置和光标状态。
- **动态页签**：支持通过 UI 或编程方式动态增加和关闭页签。

## 属性 (Props)

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `tabs` | `TabItem[]` | `[]` | 页签数据数组 (id, title, value, language)。 |
| `activeTabId` | `string` | 第一个页签 | 当前处于激活状态的页签 ID。 |
| `closable` | `boolean` | `true` | 页签是否可关闭。 |
| `addable` | `boolean` | `false` | 是否显示用于添加页签的 "+" 按钮。 |

## 事件 (Events)

- `@tab-switch`：当激活页签改变时触发。
- `@tab-close`：当页签被关闭时触发。
- `@tab-add`：当新页签被添加时触发。
- `@add-click`：当点击 "+" 按钮时触发。
