import type { editor } from 'monaco-editor';
import type { EditorError } from './typing';

/**
 * Output warning message
 * @param msg Warning message
 */
export const warnMsg = (msg: string): void => {
  console.warn(`[MonacoEditorVue3]: ${msg}`);
};

/**
 * Check if it is a valid size value
 * @param value Size value
 * @returns Formatted size value
 */
export const formatSize = (value: string | number): string => {
  if (typeof value === 'number') {
    return `${value}px`;
  }
  if (typeof value === 'string') {
    if (value.includes('%') || value.includes('px') || value.includes('rem') || value.includes('em')) {
      return value;
    }
    return `${value}px`;
  }
  return '100%';
};

/**
 * Deep merge objects
 * @param target Target object
 * @param source Source object
 * @returns Merged object
 */
export const deepMerge = <T extends Record<string, unknown>>(target: T, source: Partial<T>): T => {
  const result = { ...target };

  for (const key in source) {
    if (Object.hasOwn(source, key)) {
      const sourceValue = source[key];
      const targetValue = result[key];

      if (
        typeof sourceValue === 'object' &&
        sourceValue !== null &&
        !Array.isArray(sourceValue) &&
        typeof targetValue === 'object' &&
        targetValue !== null &&
        !Array.isArray(targetValue)
      ) {
        result[key] = deepMerge(
          targetValue as Record<string, unknown>,
          sourceValue as Record<string, unknown>
        ) as T[Extract<keyof T, string>];
      } else {
        result[key] = sourceValue as T[Extract<keyof T, string>];
      }
    }
  }

  return result;
};

/**
 * Create default configuration for monaco editor instance
 * @param language Language type
 * @returns Default configuration object
 */
export const createDefaultOptions = (language = 'javascript'): editor.IStandaloneEditorConstructionOptions => ({
  language,
  theme: 'vs',
  automaticLayout: true,
  minimap: { enabled: false },
  scrollBeyondLastLine: false,
  fontSize: 14,
  lineHeight: 24,
  tabSize: 2,
  wordWrap: 'on',
  contextmenu: true,
  selectOnLineNumbers: true,
});

/**
 * Verify if the language is supported by Monaco Editor
 * @param language Language identifier
 * @returns Whether the language is supported
 */
export const isSupportedLanguage = (language: string): boolean => {
  const supportedLanguages = [
    'javascript',
    'typescript',
    'json',
    'html',
    'css',
    'scss',
    'less',
    'python',
    'java',
    'csharp',
    'cpp',
    'php',
    'ruby',
    'go',
    'rust',
    'sql',
    'markdown',
    'xml',
    'yaml',
    'dockerfile',
    'shell',
    'powershell',
  ];
  return supportedLanguages.includes(language.toLowerCase());
};

/**
 * 编辑器实例管理器
 */
export class EditorInstanceManager {
  private static instances = new Map<string, editor.IStandaloneCodeEditor | editor.IStandaloneDiffEditor>();

  static register(id: string, instance: editor.IStandaloneCodeEditor | editor.IStandaloneDiffEditor): void {
    this.instances.set(id, instance);
  }

  static get(id: string): editor.IStandaloneCodeEditor | editor.IStandaloneDiffEditor | undefined {
    return this.instances.get(id);
  }

  static dispose(id: string): void {
    const instance = this.instances.get(id);
    if (instance) {
      instance.dispose();
      this.instances.delete(id);
    }
  }

  static disposeAll(): void {
    this.instances.forEach((instance) => instance.dispose());
    this.instances.clear();
  }
}

/**
 * 创建编辑器主题
 * @param name 主题名称
 * @param baseTheme 基础主题
 * @param rules 自定义规则
 */
export const createEditorTheme = (
  name: string,
  baseTheme: 'vs' | 'vs-dark' | 'hc-black' = 'vs',
  rules: editor.ITokenThemeRule[] = []
): void => {
  editor.defineTheme(name, {
    base: baseTheme,
    inherit: true,
    rules,
    colors: {},
  });
};

/**
 * 注册语言支持
 * @param languageId 语言标识
 * @param configuration 语言配置
 */
export const registerLanguageSupport = (languageId: string, configuration?: any): void => {
  // 注册语言
  languages.register({ id: languageId });

  if (configuration) {
    // 设置语言配置
    languages.setLanguageConfiguration(languageId, configuration);
  }
};

/**
 * 创建标准化的编辑器错误
 * @param code 错误代码
 * @param message 错误消息
 * @param details 详细信息
 * @param recoverable 是否可恢复
 */
export const createEditorError = (
  code: string,
  message: string,
  details?: string,
  recoverable = true
): EditorError => ({
  code,
  message,
  details,
  recoverable,
});

/**
 * 安全执行异步函数，捕获错误并转换为 EditorError
 * @param fn 异步函数
 * @param errorCode 错误代码
 * @param errorMessage 错误消息
 */
export const safeAsyncExecution = async <T>(
  fn: () => Promise<T>,
  errorCode: string,
  errorMessage: string
): Promise<{ success: boolean; data?: T; error?: EditorError }> => {
  try {
    const data = await fn();
    return { success: true, data };
  } catch (err) {
    const error = createEditorError(errorCode, errorMessage, err instanceof Error ? err.message : String(err));
    return { success: false, error };
  }
};

/**
 * 检查 Monaco Editor 是否可用
 */
export const isMonacoAvailable = (): boolean => {
  return (
    typeof window !== 'undefined' && typeof window.monaco !== 'undefined' && typeof window.monaco.editor !== 'undefined'
  );
};

/**
 * 等待 Monaco Editor 加载完成
 * @param timeout 超时时间（毫秒）
 */
export const waitForMonaco = (timeout = 10000): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (isMonacoAvailable()) {
      resolve();
      return;
    }

    const startTime = Date.now();
    const checkInterval = setInterval(() => {
      if (isMonacoAvailable()) {
        clearInterval(checkInterval);
        resolve();
      } else if (Date.now() - startTime > timeout) {
        clearInterval(checkInterval);
        reject(
          createEditorError(
            'MONACO_LOAD_TIMEOUT',
            'Monaco Editor failed to load within timeout',
            `Timeout: ${timeout}ms`
          )
        );
      }
    }, 100);
  });
};

/**
 * 验证编辑器选项
 * @param options 编辑器选项
 */
export const validateEditorOptions = (options: any): EditorError | null => {
  if (!options || typeof options !== 'object') {
    return createEditorError('INVALID_OPTIONS', 'Editor options must be an object');
  }

  // 验证常见的配置错误
  if (options.value !== undefined && typeof options.value !== 'string') {
    return createEditorError('INVALID_VALUE', 'Editor value must be a string');
  }

  if (options.language !== undefined && !isSupportedLanguage(options.language)) {
    return createEditorError(
      'UNSUPPORTED_LANGUAGE',
      `Language "${options.language}" is not supported`,
      undefined,
      true
    );
  }

  return null;
};
