//

import {
  Identifier,
  Zatlin,
  ZatlinError
} from ".";
import {
  Generatable
} from "./generatable";


export class Backref extends Generatable<Array<string>, Array<string>> {

  public readonly index: number;

  public constructor(index: number) {
    super();
    this.index = index;
  }

  public generate(zatlin: Zatlin, previousOutputs: Array<string>): string {
    if (this.index < previousOutputs.length) {
      let output = previousOutputs[this.index];
      return output;
    } else {
      throw new ZatlinError(9005, "Cannot happen (at Backref#generate)");
    }
  }

  public match(string: string, from: number, zatlin: Zatlin, previousMatches: Array<string>): number {
    if (this.index < previousMatches.length) {
      let match = previousMatches[this.index];
      let candidate = string.substr(from, match.length);
      if (candidate === match) {
        return from + match.length;
      } else {
        return -1;
      }
    } else {
      throw new ZatlinError(9006, "Cannot happen (at Backref#match)");
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
    return `&${this.index}`;
  }

}