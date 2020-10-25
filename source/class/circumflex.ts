//

import {
  Generatable,
  Identifier,
  Matchable,
  Zatlin
} from ".";


export class Circumflex implements Generatable, Matchable {

  public readonly leading: boolean;

  public constructor(leading: boolean) {
    this.leading = leading;
  }

  public generate(zatlin: Zatlin): string {
    return "";
  }

  public match(string: string, from: number, zatlin: Zatlin): number {
    if (this.leading) {
      if (from === 0) {
        return from;
      } else {
        return -1;
      }
    } else {
      if (from === string.length) {
        return from;
      } else {
        return -1;
      }
    }
  }

  public findUnknownIdentifier(zatlin: Zatlin): Identifier | undefined {
    return undefined;
  }

  public findCircularIdentifier(identifiers: Array<Identifier>, zatlin: Zatlin): Identifier | undefined {
    return undefined;
  }

  public toString(): string {
    return "^";
  }

}