import { App } from 'vue';
import MonacoEditor from './MonacoEditor.vue';

export { MonacoEditor };

export default {
  install: (app: App) => {
    app.component(MonacoEditor.name as string, MonacoEditor);
  },
};
