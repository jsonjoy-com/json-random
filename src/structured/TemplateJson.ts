import {randomString} from "../string";
import * as templates from "./templates";
import {ArrayTemplate, BooleanTemplate, FloatTemplate, IntegerTemplate, NumberTemplate, ObjectTemplate, StringTemplate, Template, TemplateNode} from "./types";

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
      default:
        throw new Error(`Unknown template type: ${type}`);
    }
  }

  protected generateArray(template: ArrayTemplate): unknown[] {
    throw new Error('not implemented');
  }

  protected generateObject(template: ObjectTemplate): Record<string, unknown> {
    throw new Error('not implemented');
  }

  protected generateString(template: StringTemplate): string {
    return randomString(template[1] ?? templates.tokensHelloWorld);
  }

  protected generateNumber(template: NumberTemplate): number {
    throw new Error('not implemented');
  }

  protected generateInteger(template: IntegerTemplate): number {
    const [, min = Number.MIN_SAFE_INTEGER, max = Number.MAX_SAFE_INTEGER] = template;
    let int = Math.round(Math.random() * (max - min) + min);
    int = Math.max(Number.MIN_SAFE_INTEGER, Math.min(Number.MAX_SAFE_INTEGER, int));
    return int;
  }

  protected generateFloat(template: FloatTemplate): number {
    throw new Error('not implemented');
  }

  protected generateBoolean(template: BooleanTemplate): boolean {
    throw new Error('not implemented');
  }
}
