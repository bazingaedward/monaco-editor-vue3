import CodeEditor from './CodeEditor.vue';

describe('<CodeEditor />', () => {
  it('renders', () => {
    // see: https://on.cypress.io/mounting-vue
    cy.mount(CodeEditor, {
      props: {
        height: 800,
        value: 'const hello=123',
      },
    });
  });
});
