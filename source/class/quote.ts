//

import {
  Generatable,
  Identifier,
  Zatlin
} from ".";


export class Quote implements Generatable {

  public readonly text: string;

  public constructor(text: string) {
    this.text = text;
  }

  public generate(zatlin: Zatlin): string {
    return this.text;
  }

  public match(string: string, from: number, zatlin: Zatlin): number {
    let candidate = string.substr(from, this.text.length);
    if (candidate === this.text) {
      return from + this.text.length;
    } else {
      return -1;
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