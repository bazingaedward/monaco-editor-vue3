import { describe, it, expect } from 'vitest';
import * as entry from './index';

describe('index exports', () => {
  it('should export CodeEditor and DiffEditor', () => {
    expect(entry).toHaveProperty('CodeEditor');
    expect(entry).toHaveProperty('DiffEditor');
  });
});
