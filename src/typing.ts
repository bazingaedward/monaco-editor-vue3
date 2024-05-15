export interface MonacoEditorProps {
  diffEditor: boolean;
  width: string | number;
  height: string | number;
  original: string;
  value: string;
  theme: string;
  language: string;
  options: object;
  // options: IStandaloneDiffEditorConstructionOptions & IStandaloneEditorConstructionOptions;
}
