export type EditorProps = {
  width?: string | number;
  height?: string | number;
  original?: string;
  value?: string;
  theme?: string;
  language?: string;
  options?: object;
};

export type CodeEditorProps = EditorProps;
export type DiffEditorProps = EditorProps;
