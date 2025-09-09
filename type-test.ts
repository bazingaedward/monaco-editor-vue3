import type {
  CodeEditorProps,
  DiffEditorProps,
  EditorTheme,
  SupportedLanguage,
  MonacoEditorConfig,
  UseCodeEditorReturn,
  UseDiffEditorReturn,
} from './src/index';

// 测试类型导出是否正确
const codeEditorProps: CodeEditorProps = {
  width: 800,
  height: 600,
  value: 'console.log("Hello World");',
  language: 'javascript',
  theme: 'vs-dark',
  options: {
    minimap: { enabled: false },
    fontSize: 14,
  },
};

const diffEditorProps: DiffEditorProps = {
  width: '100%',
  height: 400,
  original: 'const a = 1;',
  value: 'const a = 2;',
  language: 'typescript',
  theme: 'vs',
};

const themes: EditorTheme[] = ['vs', 'vs-dark', 'hc-black', 'hc-light'];
const languages: SupportedLanguage[] = ['javascript', 'typescript', 'json', 'python'];

const config: MonacoEditorConfig = {
  theme: 'vs-dark',
  language: 'typescript',
  readOnly: false,
  automaticLayout: true,
  minimap: { enabled: false },
  fontSize: 16,
  lineHeight: 24,
  tabSize: 2,
  wordWrap: 'on',
};

// 这些类型应该能正确推导
export type TestTypes = {
  codeEditor: CodeEditorProps;
  diffEditor: DiffEditorProps;
  theme: EditorTheme;
  language: SupportedLanguage;
  config: MonacoEditorConfig;
  codeEditorReturn: UseCodeEditorReturn;
  diffEditorReturn: UseDiffEditorReturn;
};

console.log('Type test file compiled successfully!');
