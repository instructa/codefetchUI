import { describe, it, expect } from 'vitest';
import { chooseEngine } from '~/utils/engine-select';

describe('chooseEngine', () => {
  it('detects structural ast queries', () => {
    expect(chooseEngine('$FUNC')).toBe('ast');
    expect(chooseEngine('pattern: function')).toBe('ast');
    expect(chooseEngine('kind: function_declaration')).toBe('ast');
  });

  it('uses vector on super short keyword', () => {
    expect(chooseEngine('auth')).toBe('vector');
  });

  it('defaults to hybrid for normal NL queries', () => {
    expect(chooseEngine('find all async functions')).toBe('hybrid');
  });
});