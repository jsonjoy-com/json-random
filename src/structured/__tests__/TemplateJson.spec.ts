import {resetMathRandom} from "../../__tests__/setup";
import {TemplateJson} from "../TemplateJson";

describe('str', () => {
  test('uses default string schema, if not provided', () => {
    resetMathRandom();
    expect(TemplateJson.gen('str')).toBe('hello, World!');
    resetMathRandom(123);
    expect(TemplateJson.gen(['str'])).toBe('Hi, Globe');
    resetMathRandom(456);
    expect(TemplateJson.gen('str')).toBe('Greetings Earth');
  });

  test('generates string according to schema', () => {
    resetMathRandom();
    const str = TemplateJson.gen(['str', ['pick', ['foo', 'bar', 'baz']]]);
    expect(str).toBe('foo');
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
});
