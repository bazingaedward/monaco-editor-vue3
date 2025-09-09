import { describe, it, expect } from 'vitest';
import * as utils from './utils';

describe('utils', () => {
  it('should export functions', () => {
    expect(typeof utils.isMonacoAvailable).toBe('function');
    expect(typeof utils.waitForMonaco).toBe('function');
    expect(typeof utils.createEditorError).toBe('function');
    expect(typeof utils.safeAsyncExecution).toBe('function');
    expect(typeof utils.validateEditorOptions).toBe('function');
  });

  it('createEditorError returns correct error object', () => {
    const err = utils.createEditorError('CODE', 'msg', 'details', true);
    expect(err.code).toBe('CODE');
    expect(err.message).toBe('msg');
    expect(err.details).toBe('details');
    expect(err.recoverable).toBe(true);
  });

  it('validateEditorOptions returns null for valid options', () => {
    expect(utils.validateEditorOptions({ value: '', language: 'javascript' })).toBeNull();
  });

  it('validateEditorOptions returns error for unsupported language', () => {
    const err = utils.validateEditorOptions({ value: '', language: 'notlang' });
    expect(err).not.toBeNull();
    expect(err?.code).toBe('UNSUPPORTED_LANGUAGE');
  });
});
