//

import {
  Generatable,
  Identifier,
  Zatlin,
  ZatlinError
} from ".";


export class Compound implements Generatable {

  private readonly generatable: Generatable;
  private readonly exclusion?: Generatable;

  public constructor(generatable: Generatable, exclusion?: Generatable) {
    this.generatable = generatable;
    this.exclusion = exclusion;
  }

  public generate(zatlin: Zatlin): string {
    for (let i = 0 ; i < 100 ; i ++) {
      let output = this.generatable.generate(zatlin);
      if (!this.testExclusion(output, zatlin)) {
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
    return this.generatable.isMatchable(zatlin) && this.exclusion === undefined;
  }

  private testExclusion(string: string, zatlin: Zatlin): boolean {
    if (this.exclusion !== undefined) {
      for (let from = 0 ; from <= string.length ; from ++) {
        if (this.exclusion.match(string, from, zatlin) >= 0) {
          return true;
        }
      }
      return false;
    } else {
      return false;
    }
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