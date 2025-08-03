import {resetMathRandom} from "../../__tests__/setup";
import {TemplateJson} from "../TemplateJson";

describe('str', () => {
  test('uses default string schema, if not provided', () => {
    resetMathRandom();
    expect(TemplateJson.gen('str')).toBe('hello, World!');
    resetMathRandom(123);
    expect(TemplateJson.gen('str')).toBe('Hi, Globe');
    resetMathRandom(456);
    expect(TemplateJson.gen('str')).toBe('Greetings Earth');
    // const str = TemplateJson.gen(['str', ['pick', ['foo', 'bar', 'baz']]]);
  });

  test('generates string according to schema', () => {
    resetMathRandom();
    const str = TemplateJson.gen(['str', ['pick', ['foo', 'bar', 'baz']]]);
    expect(str).toBe('foo');
  });
});
