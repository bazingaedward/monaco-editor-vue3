# API Reference

This page provides comprehensive API documentation for Monaco Editor Vue3 components.

## CodeEditor Component

### Props

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `value` | `string` | `''` | The value of the editor |
| `language` | `string` | `'javascript'` | Programming language for syntax highlighting |
| `theme` | `string` | `'vs'` | Editor theme (`'vs'`, `'vs-dark'`, `'hc-black'`, `'hc-light'`) |
| `width` | `string \| number` | `'100%'` | Editor width |
| `height` | `string \| number` | `'100%'` | Editor height |
| `options` | `EditorOptions` | `{}` | Monaco editor options |
| `loadingText` | `string` | `undefined` | Custom loading text |
| `showProgress` | `boolean` | `true` | Show loading progress |
| `showErrorBoundary` | `boolean` | `true` | Show error boundary |
| `retryable` | `boolean` | `true` | Allow retry on error |
| `lifecycle` | `EditorLifecycleHooks` | `undefined` | Lifecycle hooks |
| `useDefaultLoading` | `boolean` | `true` | Use default loading component |
| `useDefaultErrorBoundary` | `boolean` | `true` | Use default error boundary component |

### Events

| Event | Payload | Description |
|-------|---------|-------------|
| `editorWillMount` | `()` | Fired before editor is mounted |
| `editorDidMount` | `(editor: IStandaloneCodeEditor)` | Fired after editor is mounted |
| `change` | `(value: string, event: IModelContentChangedEvent)` | Fired when content changes |
| `update:value` | `(value: string)` | For v-model support |
| `error` | `(error: EditorError \| null)` | Fired when error occurs |
| `ready` | `()` | Fired when editor is ready |
| `loading` | `(loading: EditorLoadingState)` | Fired when loading state changes |

### Slots

#### `loading`

Custom loading component slot.

**Slot Props:**
- `loading: EditorLoadingState` - Complete loading state object
- `loadingText: string` - Loading text
- `progress: number` - Loading progress (0-100)
- `showProgress: boolean` - Whether to show progress

#### `error`

Custom error component slot.

**Slot Props:**
- `error: EditorError` - Error object
- `retry: () => void` - Retry function
- `retryable: boolean` - Whether retry is allowed

## DiffEditor Component

### Props

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `value` | `string` | `''` | The modified value |
| `original` | `string` | `''` | The original value |
| `language` | `string` | `'javascript'` | Programming language |
| `theme` | `string` | `'vs'` | Editor theme |
| `width` | `string \| number` | `'100%'` | Editor width |
| `height` | `string \| number` | `'100%'` | Editor height |
| `options` | `EditorOptions` | `{}` | Monaco editor options |
| `loadingText` | `string` | `undefined` | Custom loading text |
| `showProgress` | `boolean` | `true` | Show loading progress |
| `showErrorBoundary` | `boolean` | `true` | Show error boundary |
| `retryable` | `boolean` | `true` | Allow retry on error |
| `lifecycle` | `EditorLifecycleHooks` | `undefined` | Lifecycle hooks |
| `useDefaultLoading` | `boolean` | `true` | Use default loading component |
| `useDefaultErrorBoundary` | `boolean` | `true` | Use default error boundary component |

### Events

Same as CodeEditor, except:

| Event | Payload | Description |
|-------|---------|-------------|
| `editorDidMount` | `(editor: IStandaloneDiffEditor)` | Fired after diff editor is mounted |

### Slots

Same as CodeEditor.

## Hooks

### `useCodeEditor`

```typescript
function useCodeEditor(
  props: CodeEditorProps & { lifecycle?: EditorLifecycleHooks },
  emit: (event: string, ...args: unknown[]) => void
): UseCodeEditorReturn
```

**Returns:**
```typescript
interface UseCodeEditorReturn {
  editorInstance: IStandaloneCodeEditor | null;
  container: Ref<HTMLElement | undefined>;
  loading: Ref<EditorLoadingState>;
  error: Ref<EditorError | null>;
  isReady: Ref<boolean>;
  retry: () => void;
  destroy: () => Promise<void>;
}
```

### `useDiffEditor`

```typescript
function useDiffEditor(
  props: DiffEditorProps & { lifecycle?: EditorLifecycleHooks },
  emit: (event: string, ...args: unknown[]) => void
): UseDiffEditorReturn
```

**Returns:**
```typescript
interface UseDiffEditorReturn {
  editorInstance: IStandaloneDiffEditor | null;
  container: Ref<HTMLElement | undefined>;
  loading: Ref<EditorLoadingState>;
  error: Ref<EditorError | null>;
  isReady: Ref<boolean>;
  retry: () => void;
  destroy: () => Promise<void>;
}
```

### `useEditorState`

```typescript
function useEditorState(): {
  loading: Ref<EditorLoadingState>;
  error: Ref<EditorError | null>;
  isReady: Ref<boolean>;
  setLoading: (state: Partial<EditorLoadingState>) => void;
  setError: (err: EditorError | null) => void;
  clearError: () => void;
  setReady: (ready: boolean) => void;
}
```

## Type Definitions

### Core Types

```typescript
interface EditorOptions extends IStandaloneEditorConstructionOptions {
  [key: string]: unknown;
}

interface BaseEditorProps {
  width?: string | number;
  height?: string | number;
  theme?: string;
  language?: string;
  options?: EditorOptions;
}

interface CodeEditorProps extends BaseEditorProps {
  value?: string;
}

interface DiffEditorProps extends BaseEditorProps {
  value?: string;
  original?: string;
}
```

### Events

```typescript
interface BaseEditorEvents {
  editorWillMount: () => void;
  change: (value: string, event: IModelContentChangedEvent) => void;
  'update:value': (value: string) => void;
}

interface CodeEditorEvents extends BaseEditorEvents {
  editorDidMount: (editor: IStandaloneCodeEditor) => void;
}

interface DiffEditorEvents extends BaseEditorEvents {
  editorDidMount: (editor: IStandaloneDiffEditor) => void;
}
```

### State Types

```typescript
interface EditorLoadingState {
  isLoading: boolean;
  loadingText?: string;
  progress?: number; // 0-100
}

interface EditorError {
  code: string;
  message: string;
  details?: string;
  recoverable?: boolean;
}

interface EditorLifecycleHooks {
  beforeCreate?: () => void | Promise<void>;
  onCreating?: () => void;
  onCreated?: (editor: IStandaloneCodeEditor | IStandaloneDiffEditor) => void;
  onReady?: (editor: IStandaloneCodeEditor | IStandaloneDiffEditor) => void;
  beforeDestroy?: () => void | Promise<void>;
  onDestroyed?: () => void;
  onError?: (error: EditorError) => void;
  onRecover?: () => void;
}
```

### Utility Types

```typescript
type EditorTheme = 'vs' | 'vs-dark' | 'hc-black' | 'hc-light' | string;

type SupportedLanguage = 
  | 'javascript' | 'typescript' | 'json' | 'html' | 'css'
  | 'scss' | 'less' | 'python' | 'java' | 'csharp' | 'cpp'
  | 'php' | 'ruby' | 'go' | 'rust' | 'sql' | 'markdown'
  | 'xml' | 'yaml' | 'dockerfile' | 'shell' | 'powershell'
  | string;

type EditorSize = string | number;
```

## Utility Functions

### `createDefaultOptions`

```typescript
function createDefaultOptions(): EditorOptions
```

Creates default editor options.

### `formatSize`

```typescript
function formatSize(size: string | number): string
```

Formats size value to CSS-compatible string.

### `isSupportedLanguage`

```typescript
function isSupportedLanguage(language: string): boolean
```

Checks if a language is supported.

### `deepMerge`

```typescript
function deepMerge<T>(target: T, source: Partial<T>): T
```

Deep merges two objects.

### `warnMsg`

```typescript
function warnMsg(message: string): void
```

Outputs a warning message.
