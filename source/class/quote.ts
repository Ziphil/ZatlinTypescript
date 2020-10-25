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