//

import {
  Identifier,
  Zatlin,
  ZatlinError
} from ".";
import {
  Generatable
} from "./generatable";


export class Compound extends Generatable {

  private readonly generatable: Generatable;
  private readonly exclusion?: Generatable;

  public constructor(generatable: Generatable, exclusion?: Generatable) {
    super();
    this.generatable = generatable;
    this.exclusion = exclusion;
  }

  public generate(zatlin: Zatlin): string {
    for (let i = 0 ; i < 100 ; i ++) {
      let output = this.generatable.generate(zatlin);
      if (this.exclusion === undefined || !this.exclusion.test(output, zatlin)) {
        return output;
      }
    }
    throw new ZatlinError(2000, "Possibly empty");
  }

  public match(string: string, from: number, zatlin: Zatlin): number {
    let to = this.generatable.match(string, from, zatlin);
    if (to >= 0) {
      if (this.exclusion !== undefined && this.exclusion.test(string.substring(from, to), zatlin)) {
        return -1;
      } else {
        return to;
      }
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
    return this.generatable.findUnknownIdentifier(zatlin) ?? this.exclusion?.findUnknownIdentifier(zatlin);
  }

  public findCircularIdentifier(identifiers: Array<Identifier>, zatlin: Zatlin): Identifier | undefined {
    return this.generatable.findCircularIdentifier(identifiers, zatlin) ?? this.exclusion?.findCircularIdentifier(identifiers, zatlin);
  }

  public toString(): string {
    let string = "";
    string += this.generatable.toString();
    if (this.exclusion !== undefined) {
      string += ` - ${this.exclusion.toString()}`;
    }
    return string;
  }

}