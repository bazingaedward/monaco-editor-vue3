import DiffEditor from './DiffEditor.vue'

describe('<DiffEditor />', () => {
  it('renders', () => {
    // see: https://on.cypress.io/mounting-vue
    cy.mount(DiffEditor)
  })
})