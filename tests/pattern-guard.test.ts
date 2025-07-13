import { describe, it, expect } from 'vitest';
import { normaliseRule, validateRule } from '~/utils/pattern-guard';

describe('pattern‑guard', () => {
  it('upper‑cases lowercase metavariables', () => {
    const { pattern } = normaliseRule('const $val = 1');
    expect(pattern).toContain('$VAL');
  });

  it('rejects patterns with newlines', () => {
    const { valid } = validateRule({ pattern: 'foo\nbar' });
    expect(valid).toBe(false);
  });

  it('passes a simple valid rule', () => {
    const { valid } = validateRule({ pattern: 'function $FUNC($$$) { $$$ }' });
    expect(valid).toBe(true);
  });
});