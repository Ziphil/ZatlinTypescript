//

import {
  Identifier,
  Zatlin
} from ".";
import {
  Generatable
} from "./generatable";


export class Circumflex extends Generatable<Array<string>, Array<string>> {

  public readonly leading: boolean;

  public constructor(leading: boolean) {
    super();
    this.leading = leading;
  }

  public generate(zatlin: Zatlin): string {
    return "";
  }

  public match(string: string, from: number, zatlin: Zatlin): [] | [number] {
    if (this.leading) {
      if (from === 0) {
        return [from];
      } else {
        return [];
      }
    } else {
      if (from === string.length) {
        return [from];
      } else {
        return [];
      }
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
    return this.leading ? "^[first]" : "^[last]";
  }

}