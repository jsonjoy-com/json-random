import {resetMathRandom} from "../../__tests__/setup";
import {deterministic} from "../../util";
import {TemplateJson} from "../TemplateJson";

describe('TemplateJson', () => {
  describe('str', () => {
    test('uses default string schema, if not provided', () => {
      deterministic(123, () => {
        expect(TemplateJson.gen(['str'])).toBe('Hi, Globe');
        expect(TemplateJson.gen('str')).toBe('Halo, World');
        expect(TemplateJson.gen('str')).toBe('Salutations, Earth!');
      });
    });

    test('generates string according to schema', () => {
      resetMathRandom();
      const str = TemplateJson.gen(['str', ['pick', ['foo', 'bar', 'baz']]]);
      expect(str).toBe('foo');
    });

    test('handles complex string tokens', () => {
      resetMathRandom();
      const str = TemplateJson.gen(['str', ['list', 'prefix-', ['pick', ['a', 'b']], '-suffix']]);
      expect(str).toBe('prefix-a-suffix');
    });
  });

  describe('int', () => {
    test('uses default integer schema, if not provided', () => {
      resetMathRandom();
      expect(TemplateJson.gen('int')).toBe(-8037967800187380);
      resetMathRandom(123456);
      expect(TemplateJson.gen(['int'])).toBe(4954609332676803);
    });

    test('can specify "int" range', () => {
      resetMathRandom();
      expect(TemplateJson.gen(['int', -10, 10])).toBe(-9);
      expect(TemplateJson.gen(['int', 0, 1])).toBe(0);
      expect(TemplateJson.gen(['int', 1, 5])).toBe(4);
    });

    test('handles edge cases', () => {
      resetMathRandom();
      expect(TemplateJson.gen(['int', 0, 0])).toBe(0);
      expect(TemplateJson.gen(['int', -1, -1])).toBe(-1);
    });
  });

  describe('num', () => {
    test('generates random number, without range', () => {
      resetMathRandom();
      const num = TemplateJson.gen('num');
      expect(typeof num).toBe('number');
    });

    test('can specify range', () => {
      resetMathRandom();
      const num = TemplateJson.gen(['num', 0, 1]);
      expect(num).toBeGreaterThanOrEqual(0);
      expect(num).toBeLessThanOrEqual(1);
    });

    test('handles negative ranges', () => {
      resetMathRandom();
      const num = TemplateJson.gen(['num', -10, -5]);
      expect(num).toBeGreaterThanOrEqual(-10);
      expect(num).toBeLessThanOrEqual(-5);
    });
  });

  describe('float', () => {
    test('uses default float schema, if not provided', () => {
      resetMathRandom();
      const float = TemplateJson.gen('float');
      expect(typeof float).toBe('number');
    });

    test('can specify range', () => {
      resetMathRandom();
      const float = TemplateJson.gen(['float', 0.1, 0.9]);
      expect(float).toBeGreaterThanOrEqual(0.1);
      expect(float).toBeLessThanOrEqual(0.9);
    });

    test('handles very small ranges', () => {
      resetMathRandom();
      const float = TemplateJson.gen(['float', 1.0, 1.1]);
      expect(float).toBeGreaterThanOrEqual(1.0);
      expect(float).toBeLessThanOrEqual(1.1);
    });
  });

  describe('bool', () => {
    test('uses default boolean schema, if not provided', () => {
      resetMathRandom();
      const bool = TemplateJson.gen('bool');
      expect(typeof bool).toBe('boolean');
    });

    test('can specify fixed value', () => {
      expect(TemplateJson.gen(['bool', true])).toBe(true);
      expect(TemplateJson.gen(['bool', false])).toBe(false);
    });

    test('generates random booleans when no value specified', () => {
      resetMathRandom();
      expect(TemplateJson.gen(['bool'])).toBe(true);
      resetMathRandom(999);
      expect(TemplateJson.gen(['bool'])).toBe(true);
    });
  });

  describe('nil', () => {
    test('always returns null', () => {
      expect(TemplateJson.gen('nil')).toBe(null);
      expect(TemplateJson.gen(['nil'])).toBe(null);
    });
  });

  describe('lit', () => {
    test('returns literal values', () => {
      expect(TemplateJson.gen(['lit', 42])).toBe(42);
      expect(TemplateJson.gen(['lit', 'hello'])).toBe('hello');
      expect(TemplateJson.gen(['lit', true])).toBe(true);
      expect(TemplateJson.gen(['lit', null])).toBe(null);
    });

    test('deep clones objects', () => {
      const obj = { a: 1, b: { c: 2 } };
      const result = TemplateJson.gen(['lit', obj]);
      expect(result).toEqual(obj);
      expect(result).not.toBe(obj);
      expect((result as any).b).not.toBe(obj.b);
    });

    test('deep clones arrays', () => {
      const arr = [1, [2, 3], { a: 4 }];
      const result = TemplateJson.gen(['lit', arr]);
      expect(result).toEqual(arr);
      expect(result).not.toBe(arr);
      expect((result as any)[1]).not.toBe(arr[1]);
      expect((result as any)[2]).not.toBe(arr[2]);
    });
  });

  describe('arr', () => {
    test('uses default array schema, if not provided', () => {
      resetMathRandom();
      const arr = TemplateJson.gen('arr');
      expect(Array.isArray(arr)).toBe(true);
      expect((arr as any[]).length).toBeGreaterThanOrEqual(0);
      expect((arr as any[]).length).toBeLessThanOrEqual(5);
    });

    test('can specify length range', () => {
      resetMathRandom();
      const arr = TemplateJson.gen(['arr', 2, 4]);
      expect(Array.isArray(arr)).toBe(true);
      expect((arr as any[]).length).toBeGreaterThanOrEqual(2);
      expect((arr as any[]).length).toBeLessThanOrEqual(4);
    });

    test('can specify item template', () => {
      resetMathRandom();
      const arr = TemplateJson.gen(['arr', 2, 2, 'str']);
      expect(Array.isArray(arr)).toBe(true);
      expect((arr as any[]).length).toBe(2);
      expect(typeof (arr as any[])[0]).toBe('string');
      expect(typeof (arr as any[])[1]).toBe('string');
    });

    test('can specify head templates', () => {
      resetMathRandom();
      const arr = TemplateJson.gen(['arr', 1, 1, 'nil', [['lit', 'first'], ['lit', 'second']]]);
      expect(Array.isArray(arr)).toBe(true);
      expect((arr as any[])[0]).toBe('first');
      expect((arr as any[])[1]).toBe('second');
    });

    test('can specify tail templates', () => {
      resetMathRandom();
      const arr = TemplateJson.gen(['arr', 1, 1, 'nil', [], [['lit', 'tail1'], ['lit', 'tail2']]]);
      expect(Array.isArray(arr)).toBe(true);
      const arrTyped = arr as any[];
      expect(arrTyped[arrTyped.length - 2]).toBe('tail1');
      expect(arrTyped[arrTyped.length - 1]).toBe('tail2');
    });

    test('handles empty arrays', () => {
      const arr = TemplateJson.gen(['arr', 0, 0]);
      expect(Array.isArray(arr)).toBe(true);
      expect((arr as any[]).length).toBe(0);
    });
  });

  describe('obj', () => {
    test('uses default object schema, if not provided', () => {
      const obj = TemplateJson.gen('obj');
      expect(typeof obj).toBe('object');
      expect(obj).not.toBe(null);
    });

    test('can specify fields', () => {
      resetMathRandom();
      const obj = TemplateJson.gen(['obj', [
        ['name', 'str'],
        ['age', 'int']
      ]]);
      expect(typeof obj).toBe('object');
      expect(typeof (obj as any).name).toBe('string');
      expect(typeof (obj as any).age).toBe('number');
    });

    test('handles optional fields', () => {
      resetMathRandom();
      const obj = TemplateJson.gen(['obj', [
        ['required', 'str', 0],
        ['optional', 'str', 1]
      ]]);
      expect(typeof (obj as any).required).toBe('string');
      expect((obj as any).optional).toBeUndefined();
    });

    test('can use token for key generation', () => {
      resetMathRandom();
      const obj = TemplateJson.gen(['obj', [
        [['pick', ['key1', 'key2']], 'str']
      ]]);
      expect(typeof obj).toBe('object');
      const keys = Object.keys(obj as any);
      expect(keys.length).toBe(1);
      expect(['key1', 'key2']).toContain(keys[0]);
    });

    test('handles null key token', () => {
      resetMathRandom();
      const obj = TemplateJson.gen(['obj', [
        [null, 'str']
      ]]);
      expect(typeof obj).toBe('object');
      const keys = Object.keys(obj as any);
      expect(keys.length).toBe(1);
    });
  });

  describe('or', () => {
    test('picks one of the provided templates', () => {
      resetMathRandom();
      const result = TemplateJson.gen(['or', 'str', 'int', 'bool']);
      expect(['string', 'number', 'boolean']).toContain(typeof result);
    });

    test('works with complex templates', () => {
      resetMathRandom();
      const result = TemplateJson.gen(['or', ['lit', 'hello'], ['lit', 42], ['lit', true]]);
      expect(['hello', 42, true]).toContain(result);
    });

    test('handles single option', () => {
      const result = TemplateJson.gen(['or', ['lit', 'only']]);
      expect(result).toBe('only');
    });
  });

  describe('maxNodeCount', () => {
    test('respects node count limit', () => {
      const result = TemplateJson.gen(['arr', 100, 100, 'str'], { maxNodeCount: 5 });
      expect(Array.isArray(result)).toBe(true);
      const arr = result as any[];
      expect(arr.some(item => item === null)).toBe(true);
    });

    test('works with nested structures', () => {
      const template: any = ['arr', 3, 3, ['obj', [['key', 'str']]]];
      const result = TemplateJson.gen(template, { maxNodeCount: 10 });
      expect(Array.isArray(result)).toBe(true);
    });
  });

  describe('edge cases', () => {
    test('handles deeply nested structures', () => {
      const template: any = ['obj', [
        ['users', ['arr', 2, 2, ['obj', [
          ['name', 'str'],
          ['profile', ['obj', [
            ['age', 'int'],
            ['active', 'bool']
          ]]]
        ]]]]
      ]];

      resetMathRandom();
      const result = TemplateJson.gen(template);
      expect(typeof result).toBe('object');
      expect(Array.isArray((result as any).users)).toBe(true);
      expect((result as any).users.length).toBe(2);
    });

    test('handles recursive or templates', () => {
      resetMathRandom();
      const result = TemplateJson.gen(['or', ['or', 'str', 'int'], 'bool']);
      expect(['string', 'number', 'boolean']).toContain(typeof result);
    });

    test('handles empty object fields', () => {
      const result = TemplateJson.gen(['obj', []]);
      expect(typeof result).toBe('object');
      expect(Object.keys(result as any).length).toBe(0);
    });

    test('handles very large integer ranges', () => {
      resetMathRandom();
      const result = TemplateJson.gen(['int', Number.MIN_SAFE_INTEGER, Number.MAX_SAFE_INTEGER]);
      expect(typeof result).toBe('number');
      expect(Number.isInteger(result)).toBe(true);
    });
  });
});
