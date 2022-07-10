import MonacoEditor from './MonacoEditor.vue'

MonacoEditor.install = (app) => {
    app.component(MonacoEditor.name, MonacoEditor)
}
export default MonacoEditor