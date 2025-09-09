import { describe, it, expect } from 'vitest';
import * as typing from './typing';

describe('typing module', () => {
  it('should export types', () => {
    expect(typing).toBeTypeOf('object');
  });
});
