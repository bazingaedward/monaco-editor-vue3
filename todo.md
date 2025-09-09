// 建议新增的组件设计

// MultiEditor.vue - 多标签页编辑器
interface MultiEditorProps {
  tabs: Array<{
    id: string;
    title: string;
    content: string;
    language: string;
    modified?: boolean;
  }>;
  activeTab?: string;
  onTabChange?: (tabId: string) => void;
  onTabClose?: (tabId: string) => void;
}

// EmbeddedEditor.vue - 嵌入式编辑器（小型代码片段）
interface EmbeddedEditorProps extends CodeEditorProps {
  lineNumbers?: 'off' | 'on' | 'relative';
  minimap?: boolean;
  scrollbar?: boolean;
  folding?: boolean;
}

// ReadOnlyEditor.vue - 只读代码查看器
interface ReadOnlyEditorProps extends CodeEditorProps {
  copyable?: boolean;
  highlightLines?: number[];
  showLineNumbers?: boolean;
}
