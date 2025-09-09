# 基础示例

本页面展示了 Monaco Editor Vue3 组件的基础使用示例，包括单文件编辑器和差异对比编辑器的常见用法。

## 差异对比编辑器 (DiffEditor)

DiffEditor 用于对比两个版本的代码差异，支持并排显示和高亮显示变更内容。

**主要特性：**
- 并排差异对比
- 高亮显示新增、删除、修改的内容
- 支持各种编程语言的语法高亮
- 响应式布局

<DiffEditor
theme="vs"
:options="options"
language="javascript"
:height="600"
v-model:value="diff"
:original="'world'"
/>

## JavaScript / TypeScript 编辑器

支持完整的 JavaScript 和 TypeScript 语法高亮、智能提示、错误检查等功能。

**主要特性：**
- 语法高亮和自动补全
- 实时错误检查
- 代码格式化
- 智能重构建议

<CodeEditor
theme="vs"
:options="options"
language="javascript"
:height="600"
v-model:value="tsString"
/>

<script setup lang="ts">
import { ref } from 'vue'
import { tsString, jsonString, cssString, htmlString, sqlString } from './constant'

// 响应式数据
const diff = ref('hello')

// 编辑器配置选项
const options = {
  // 启用颜色装饰器
  colorDecorators: true,
  // 设置行高
  lineHeight: 24,
  // 设置 Tab 键的空格数
  tabSize: 2,
  // 启用自动缩进
  automaticLayout: true,
  // 显示行号
  lineNumbers: 'on' as const,
  // 启用代码折叠
  folding: true,
  // 启用括号匹配
  matchBrackets: 'always' as const,
  // 启用滚动条
  scrollBeyondLastLine: false,
}
</script>

---

## 配置说明

以上示例使用了统一的编辑器配置：

| 配置项 | 值 | 说明 |
|--------|-----|------|
| `colorDecorators` | `true` | 启用颜色装饰器，在 CSS 中显示颜色预览 |
| `lineHeight` | `24` | 设置行高为 24px |
| `tabSize` | `2` | 设置 Tab 键对应 2 个空格 |
| `automaticLayout` | `true` | 启用自动布局调整 |
| `lineNumbers` | `'on'` | 显示行号 |
| `folding` | `true` | 启用代码折叠功能 |
| `matchBrackets` | `'always'` | 始终高亮匹配的括号 |
| `scrollBeyondLastLine` | `false` | 禁止滚动超过最后一行 |

更多配置选项请参考 [Monaco Editor 官方文档](https://microsoft.github.io/monaco-editor/docs.html)。

## JSON 编辑器

专为 JSON 数据编辑优化，提供语法验证、格式化、折叠等功能。

**主要特性：**
- JSON 语法验证和错误提示
- 自动格式化和美化
- 支持对象和数组的折叠展开
- 智能括号匹配

<CodeEditor
theme="vs"
:options="options"
language="json"
:height="600"
v-model:value="jsonString"
/>

## CSS / Less / Sass 编辑器

支持现代 CSS 预处理器，提供属性提示、颜色预览等功能。

**主要特性：**
- CSS 属性智能提示
- 颜色值预览和选择器
- Less/Sass 语法支持
- 自动补全 CSS 选择器

<CodeEditor
theme="vs"
:options="options"
language="css"
:height="600"
v-model:value="cssString"
/>

## HTML / Handlebars / Razor 编辑器

支持 HTML 及其模板引擎，提供标签补全、属性提示等功能。

**主要特性：**
- HTML 标签和属性自动补全
- 模板语法高亮（Handlebars、Razor）
- 嵌套标签自动缩进
- 实时 HTML 验证

<CodeEditor
theme="vs"
:options="options"
language="html"
:height="600"
v-model:value="htmlString"
/>

## SQL 编辑器

专业的 SQL 查询编辑器，支持多种数据库方言。

**主要特性：**
- SQL 关键字高亮
- 表名和字段名提示
- 查询语法验证
- 支持多种数据库方言

<CodeEditor
theme="vs"
:options="options"
language="sql"
:height="600"
v-model:value="sqlString"
/>
