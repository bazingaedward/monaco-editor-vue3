import { describe, it, expect, beforeEach, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import CodeEditor from './CodeEditor.vue';

// TODO: add test
describe('monaco editor', () => {
  beforeEach(() => {
    vi.stubGlobal('matchMedia', () => ({ matches: false, addEventListener: function () {} }));
  });

  it('is a vue component', () => {
    const wrapper = mount(CodeEditor);
    expect(1).toBe(1);
  });
});
