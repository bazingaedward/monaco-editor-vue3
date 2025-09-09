import CodeEditor from './CodeEditor.vue';
import DiffEditor from './DiffEditor.vue';

// 导出组件
export { CodeEditor, DiffEditor };

// 导出 hooks
export { useCodeEditor, useCommonEditor, useDiffEditor, useEditorState, useEditorLifecycle } from './hook';
// 导出类型
export type {
  BaseEditorEvents,
  BaseEditorProps,
  CodeEditorEvents,
  CodeEditorProps,
  DiffEditorEvents,
  DiffEditorProps,
  EditorManager,
  EditorOptions,
  EditorPlugin,
  EditorSize,
  EditorState,
  // 新增类型
  EditorTheme,
  MonacoEditorConfig,
  MonacoEditorProps, // 兼容性导出
  SupportedLanguage,
  UseCodeEditorReturn,
  UseDiffEditorReturn,
} from './typing';
// 导出工具函数
export {
  createDefaultOptions,
  deepMerge,
  formatSize,
  isSupportedLanguage,
  warnMsg,
} from './utils';

// 默认导出
export default CodeEditor;
