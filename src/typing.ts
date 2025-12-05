import type { editor } from 'monaco-editor';
import type { Ref } from 'vue';

export interface EditorOptions extends editor.IStandaloneEditorConstructionOptions {
  [key: string]: unknown;
}

export interface BaseEditorProps {
  width?: string | number;
  height?: string | number;
  theme?: string;
  language?: string;
  options?: EditorOptions;
}

export interface CodeEditorProps extends BaseEditorProps {
  value?: string;
}

export interface DiffEditorProps extends BaseEditorProps {
  value?: string;
  original?: string;
}

// Basic event type definitions
export interface BaseEditorEvents {
  editorWillMount: () => void;
  change: (value: string, event: editor.IModelContentChangedEvent) => void;
  'update:value': (value: string) => void;
}

export interface CodeEditorEvents extends BaseEditorEvents {
  editorDidMount: (editor: editor.IStandaloneCodeEditor) => void;
}

export interface DiffEditorEvents extends BaseEditorEvents {
  editorDidMount: (editor: editor.IStandaloneDiffEditor) => void;
}

// Hook return types
export interface UseCodeEditorReturn {
  editorInstance: editor.IStandaloneCodeEditor | null;
  container: Ref<HTMLElement | undefined>;
  loading: Ref<EditorLoadingState>;
  error: Ref<EditorError | null>;
  isReady: Ref<boolean>;
  retry: () => void;
  destroy: () => Promise<void>;
}

export interface UseDiffEditorReturn {
  editorInstance: editor.IStandaloneDiffEditor | null;
  container: Ref<HTMLElement | undefined>;
  loading: Ref<EditorLoadingState>;
  error: Ref<EditorError | null>;
  isReady: Ref<boolean>;
  retry: () => void;
  destroy: () => Promise<void>;
}

// Compatibility type alias
export type MonacoEditorProps = DiffEditorProps;

// Editor theme type
export type EditorTheme = 'vs' | 'vs-dark' | 'hc-black' | 'hc-light' | string;

// Supported language types
export type SupportedLanguage =
  | 'javascript'
  | 'typescript'
  | 'json'
  | 'html'
  | 'css'
  | 'scss'
  | 'less'
  | 'python'
  | 'java'
  | 'csharp'
  | 'cpp'
  | 'php'
  | 'ruby'
  | 'go'
  | 'rust'
  | 'sql'
  | 'markdown'
  | 'xml'
  | 'yaml'
  | 'dockerfile'
  | 'shell'
  | 'powershell'
  | string;

// Editor size type
export type EditorSize = string | number;

// Editor state type
export interface EditorState {
  isReady: boolean;
  hasError: boolean;
  errorMessage?: string;
  value: string;
}

// 编辑器配置选项
export interface MonacoEditorConfig {
  theme?: EditorTheme;
  language?: SupportedLanguage;
  readOnly?: boolean;
  automaticLayout?: boolean;
  minimap?: {
    enabled: boolean;
  };
  fontSize?: number;
  lineHeight?: number;
  tabSize?: number;
  wordWrap?: 'off' | 'on' | 'wordWrapColumn' | 'bounded';
}

// 插件接口
export interface EditorPlugin {
  name: string;
  install: (editor: editor.IStandaloneCodeEditor | editor.IStandaloneDiffEditor) => void;
  uninstall?: (editor: editor.IStandaloneCodeEditor | editor.IStandaloneDiffEditor) => void;
}

// 编辑器实例管理器接口
export interface EditorManager {
  getEditor: () => editor.IStandaloneCodeEditor | editor.IStandaloneDiffEditor | null;
  getValue: () => string;
  setValue: (value: string) => void;
  focus: () => void;
  dispose: () => void;
  updateOptions: (options: EditorOptions) => void;
}

// 编辑器高级功能接口
export interface EditorFeatures {
  autoSave?: {
    enabled: boolean;
    delay?: number; // 毫秒
  };
  search?: {
    enabled: boolean;
    caseSensitive?: boolean;
    wholeWord?: boolean;
    regex?: boolean;
  };
  formatting?: {
    enabled: boolean;
    onSave?: boolean;
    onPaste?: boolean;
    onType?: boolean;
  };
  intellisense?: {
    enabled: boolean;
    triggerCharacters?: string[];
    completionProvider?: any;
  };
}

// 扩展的编辑器配置
export interface AdvancedEditorOptions extends EditorOptions {
  features?: EditorFeatures;
  keybindings?: Array<{
    key: string;
    command: string;
    when?: string;
  }>;
  contextMenu?: {
    enabled: boolean;
    customItems?: Array<{
      id: string;
      label: string;
      action: () => void;
    }>;
  };
}

// 编辑器状态管理
export interface EditorStateManager {
  saveState: () => any;
  restoreState: (state: any) => void;
  getHistory: () => any[];
  clearHistory: () => void;
}

// 加载状态类型
export interface EditorLoadingState {
  isLoading: boolean;
  loadingText?: string;
  progress?: number; // 0-100
}

// 错误类型
export interface EditorError {
  code: string;
  message: string;
  details?: string;
  recoverable?: boolean;
}

// 生命周期钩子类型
export interface EditorLifecycleHooks {
  beforeCreate?: () => void | Promise<void>;
  onCreating?: () => void;
  onCreated?: (editor: editor.IStandaloneCodeEditor | editor.IStandaloneDiffEditor) => void;
  onReady?: (editor: editor.IStandaloneCodeEditor | editor.IStandaloneDiffEditor) => void;
  beforeDestroy?: () => void | Promise<void>;
  onDestroyed?: () => void;
  onError?: (error: EditorError) => void;
  onRecover?: () => void;
}

// 扩展基础属性，包含生命周期和错误处理
export interface EnhancedBaseEditorProps extends BaseEditorProps {
  loading?: boolean;
  loadingText?: string;
  error?: EditorError | null;
  showErrorBoundary?: boolean;
  retryable?: boolean;
  lifecycle?: EditorLifecycleHooks;
}

// 扩展的 CodeEditor 属性
export interface EnhancedCodeEditorProps extends CodeEditorProps, EnhancedBaseEditorProps {}

// 扩展的 DiffEditor 属性
export interface EnhancedDiffEditorProps extends DiffEditorProps, EnhancedBaseEditorProps {}
