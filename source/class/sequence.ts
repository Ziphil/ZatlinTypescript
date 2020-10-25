//

import {
  Identifier,
  Zatlin
} from ".";
import {
  Generatable
} from "./generatable";


export class Sequence extends Generatable {

  private readonly generatables: ReadonlyArray<Generatable>;

  public constructor(generatables: Array<Generatable>) {
    super();
    this.generatables = generatables;
  }

  public generate(zatlin: Zatlin): string {
    let output = "";
    for (let generatable of this.generatables) {
      output += generatable.generate(zatlin);
    }
    return output;
  }

  public match(string: string, from: number, zatlin: Zatlin): number {
    if (this.generatables.length > 0) {
      let pointer = from;
      for (let matchable of this.generatables) {
        let to = matchable.match(string, pointer, zatlin);
        if (to >= 0) {
          pointer = to;
        } else {
          return -1;
        }
      }
      return pointer;
    } else {
      return from;
    }
  }

  public isMatchable(zatlin: Zatlin): boolean {
    for (let generatable of this.generatables) {
      let matchable = generatable.isMatchable(zatlin);
      if (!matchable) {
        return false;
      }
    }
    return true;
  }

  public isValid(zatlin: Zatlin): boolean {
    for (let generatable of this.generatables) {
      let matchable = generatable.isMatchable(zatlin);
      if (!matchable) {
        return false;
      }
    }
    return true;
  }

  public findUnknownIdentifier(zatlin: Zatlin): Identifier | undefined {
    for (let generatable of this.generatables) {
      let identifier = generatable.findUnknownIdentifier(zatlin);
      if (identifier !== undefined) {
        return identifier;
      }
    }
    return undefined;
  }

  public findCircularIdentifier(identifiers: Array<Identifier>, zatlin: Zatlin): Identifier | undefined {
    for (let generatable of this.generatables) {
      let identifier = generatable.findCircularIdentifier(identifiers, zatlin);
      if (identifier !== undefined) {
        return identifier;
      }
    }
    return undefined;
  }

  public toString(): string {
    let string = "";
    string += this.generatables.join(" ");
    return string;
  }

}