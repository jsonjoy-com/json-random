import {randomString} from "../string";
import {clone} from "../util";
import * as templates from "./templates";
import type {ArrayTemplate, BooleanTemplate, FloatTemplate, IntegerTemplate, LiteralTemplate, NumberTemplate, ObjectTemplate, OrTemplate, StringTemplate, Template, TemplateNode} from "./types";

export interface TemplateJsonOpts {
  maxNodeCount?: number;
}

export class TemplateJson {
  public static readonly gen = (template?: Template, opts?: TemplateJsonOpts): unknown => {
    const generator = new TemplateJson(template, opts);
    return generator.gen();
  };

  protected nodes: number = 0;
  protected maxNodes: number;

  constructor(public readonly template: Template = templates.nil, public readonly opts: TemplateJsonOpts = {}) {
    this.maxNodes = opts.maxNodeCount ?? 100;
  }

  public gen(): unknown {
    return this.generate(this.template);
  }

  protected generate(tpl: Template): unknown {
    if (this.nodes >= this.maxNodes) return null;
    this.nodes++;
    const template: TemplateNode = typeof tpl === 'string' ? [tpl] : tpl;
    const type = template[0];
    switch (type) {
      case 'arr':
        return this.generateArray(template as ArrayTemplate);
      case 'obj':
        return this.generateObject(template as ObjectTemplate);
      case 'str':
        return this.generateString(template as StringTemplate);
      case 'num':
        return this.generateNumber(template as NumberTemplate);
      case 'int':
        return this.generateInteger(template as IntegerTemplate);
      case 'float':
        return this.generateFloat(template as FloatTemplate);
      case 'bool':
        return this.generateBoolean(template as BooleanTemplate);
      case 'nil':
        return null;
      case 'lit':
        return this.generateLiteral(template as any);
      case 'or':
        return this.generateOr(template as any);
      default:
        throw new Error(`Unknown template type: ${type}`);
    }
  }

  protected generateArray(template: ArrayTemplate): unknown[] {
    const [, min = 0, max = 5, itemTemplate = 'nil', head = [], tail = []] = template;
    const length = Math.floor(Math.random() * (max - min + 1)) + min;
    const result: unknown[] = [];
    for (const tpl of head) result.push(this.generate(tpl));
    const mainCount = Math.max(0, length - head.length - tail.length);
    for (let i = 0; i < mainCount; i++) result.push(this.generate(itemTemplate));
    for (const tpl of tail) result.push(this.generate(tpl));
    return result;
  }

  protected generateObject(template: ObjectTemplate): Record<string, unknown> {
    const [, fields = []] = template;
    const result: Record<string, unknown> = {};
    for (const field of fields) {
      const [keyToken, valueTemplate = 'nil', optionality = 0] = field;
      if (optionality && Math.random() < optionality) continue;
      const key = randomString(keyToken ?? templates.tokensHelloWorld);
      const value = this.generate(valueTemplate);
      result[key] = value;
    }
    return result;
  }

  protected generateString(template: StringTemplate): string {
    return randomString(template[1] ?? templates.tokensHelloWorld);
  }

  protected generateNumber([, min, max]: NumberTemplate): number {
    if (Math.random() > .5) return this.generateInteger(['int', min, max]);
    else return this.generateFloat(['float', min, max]);
  }

  protected generateInteger(template: IntegerTemplate): number {
    const [, min = Number.MIN_SAFE_INTEGER, max = Number.MAX_SAFE_INTEGER] = template;
    let int = Math.round(Math.random() * (max - min) + min);
    int = Math.max(Number.MIN_SAFE_INTEGER, Math.min(Number.MAX_SAFE_INTEGER, int));
    return int;
  }

  protected generateFloat(template: FloatTemplate): number {
    const [, min = -Number.MAX_VALUE, max = Number.MAX_VALUE] = template;
    let float = Math.random() * (max - min) + min;
    float = Math.max(-Number.MAX_VALUE, Math.min(Number.MAX_VALUE, float));
    return float;
  }

  protected generateBoolean(template: BooleanTemplate): boolean {
    const [, value] = template;
    return value !== undefined ? value : Math.random() < 0.5;
  }

  protected generateLiteral(template: LiteralTemplate): unknown {
    const [, value] = template;
    return clone(value);
  }

  protected generateOr(template: OrTemplate): unknown {
    const [, ...options] = template;
    const randomIndex = Math.floor(Math.random() * options.length);
    return this.generate(options[randomIndex]);
  }
}
