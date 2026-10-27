import { describe, expect, it } from '@jest/globals';
import {
  stringIsInEnum,
  stringIsInEnumOrThrow,
} from '../validator-helper.js';

enum TestEnum {
  FOO = 'FOO',
  BAR = 'BAR',
}

describe('validator-helper', () => {
  it('should match enum values case-insensitively', () => {
    expect(stringIsInEnum('foo', TestEnum)).toBe(true);
    expect(stringIsInEnum('Bar', TestEnum)).toBe(true);
    expect(stringIsInEnum('baz', TestEnum)).toBe(false);
  });

  it('should throw with default message when value is invalid', () => {
    expect(() => stringIsInEnumOrThrow('missing', TestEnum)).toThrow(
      'Invalid value missing',
    );
  });

  it('should allow custom error messages', () => {
    expect(() =>
      stringIsInEnumOrThrow('invalid', TestEnum, 'custom message'),
    ).toThrow('custom message');
  });

  it('should return true when value is valid', () => {
    expect(stringIsInEnumOrThrow('foo', TestEnum)).toBe(true);
  });

  describe('parseBoundedInt and parseOptionalInt', () => {
    const {
      parseBoundedInt,
      parseOptionalInt,
      ValidationError,
    } = require('../validator-helper.js');

    it('parses valid bounded integers', () => {
      expect(parseBoundedInt('42', 'answer', 1, 100)).toBe(42);
      expect(parseBoundedInt('-5', 'neg', -10, 0)).toBe(-5);
    });

    it('throws ValidationError for missing, non-integer, or out of bounds inputs', () => {
      expect(() => parseBoundedInt('', 'val', 1, 10)).toThrow(ValidationError);
      expect(() => parseBoundedInt(null, 'val', 1, 10)).toThrow(ValidationError);
      expect(() => parseBoundedInt('abc', 'val', 1, 10)).toThrow(ValidationError);
      expect(() => parseBoundedInt('0', 'val', 1, 10)).toThrow(ValidationError);
      expect(() => parseBoundedInt('11', 'val', 1, 10)).toThrow(ValidationError);
    });

    it('handles optional ints', () => {
      expect(parseOptionalInt(undefined, 'val', 1, 10)).toBeUndefined();
      expect(parseOptionalInt('', 'val', 1, 10)).toBeUndefined();
      expect(parseOptionalInt('5', 'val', 1, 10)).toBe(5);
    });
  });
});

