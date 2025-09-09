import { describe, it, expect, vi } from 'vitest';
import { useCodeEditor, useDiffEditor } from './hook';

describe('useCodeEditor', () => {
  it('should be a function', () => {
    expect(typeof useCodeEditor).toBe('function');
  });

  it('should return an object with expected keys', () => {
    const emit = vi.fn();
    const result = useCodeEditor({ value: '', language: 'javascript' }, emit);
    expect(result).toHaveProperty('container');
    expect(result).toHaveProperty('editorInstance');
    expect(result).toHaveProperty('loading');
    expect(result).toHaveProperty('error');
    expect(result).toHaveProperty('retry');
    expect(result).toHaveProperty('destroy');
  });
});

describe('useDiffEditor', () => {
  it('should be a function', () => {
    expect(typeof useDiffEditor).toBe('function');
  });

  it('should return an object with expected keys', () => {
    const emit = vi.fn();
    const result = useDiffEditor({ value: '', original: '', language: 'javascript' }, emit);
    expect(result).toHaveProperty('container');
    expect(result).toHaveProperty('editorInstance');
    expect(result).toHaveProperty('loading');
    expect(result).toHaveProperty('error');
    expect(result).toHaveProperty('retry');
    expect(result).toHaveProperty('destroy');
  });
});
