import CodeEditor from './CodeEditor.vue';
import DiffEditor from './DiffEditor.vue';

// Export components
export { CodeEditor, DiffEditor };

// Export hooks
export { useCodeEditor, useCommonEditor, useDiffEditor, useEditorState, useEditorLifecycle } from './hook';
// Export types
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
  // New types
  EditorTheme,
  MonacoEditorConfig,
  MonacoEditorProps, // Compatibility export
  SupportedLanguage,
  UseCodeEditorReturn,
  UseDiffEditorReturn,
} from './typing';
// Export utility functions
export {
  createDefaultOptions,
  deepMerge,
  formatSize,
  isSupportedLanguage,
  warnMsg,
} from './utils';

// Default export
export default CodeEditor;
