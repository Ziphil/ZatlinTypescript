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
    if (this.exclusion === undefined) {
      return this.generatable.match(string, from, zatlin);
    } else {
      throw new ZatlinError(9004, "Cannot happen (at Compound#match)");
    }
  }

  public isMatchable(zatlin: Zatlin): boolean {
    return this.exclusion === undefined && this.generatable.isMatchable(zatlin);
  }

  public isValid(zatlin: Zatlin): boolean {
    return this.exclusion === undefined || this.exclusion.isMatchable(zatlin);
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