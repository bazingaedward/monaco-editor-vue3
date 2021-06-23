import Editor from './Editor.vue'

Editor.install = (app) => {
    app.component(Editor.name, Editor)
}
export default Editor