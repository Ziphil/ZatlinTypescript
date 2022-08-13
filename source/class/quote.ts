//

import {
  Identifier,
  Zatlin
} from ".";
import {
  Generatable
} from "./generatable";


export class Quote extends Generatable {

  public readonly text: string;

  public constructor(text: string) {
    super();
    this.text = text;
  }

  public generate(zatlin: Zatlin): string {
    return this.text;
  }

  public match(string: string, from: number, zatlin: Zatlin): [] | [number] {
    const candidate = string.substr(from, this.text.length);
    if (candidate === this.text) {
      return [from + this.text.length];
    } else {
      return [];
    }
  }

  public isMatchable(zatlin: Zatlin): boolean {
    return true;
  }

  public isValid(zatlin: Zatlin): boolean {
    return true;
  }

  public findUnknownIdentifier(zatlin: Zatlin): Identifier | undefined {
    return undefined;
  }

  public findCircularIdentifier(identifiers: Array<Identifier>, zatlin: Zatlin): Identifier | undefined {
    return undefined;
  }

  public toString(): string {
    return `"${this.text}"`;
  }

}