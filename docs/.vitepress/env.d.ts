// VitePress 全局类型声明
declare module '*.worker?worker' {
  const workerConstructor: {
    new (): Worker;
  };
  export default workerConstructor;
}

declare module 'monaco-editor-vue3' {
  export const CodeEditor: any;
  export const DiffEditor: any;
}
