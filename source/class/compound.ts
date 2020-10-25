//

import {
  Generatable,
  Identifier,
  Matchable,
  Zatlin,
  ZatlinError
} from ".";


export class Compound implements Generatable {

  private readonly generatable: Generatable;
  private readonly matchable?: Matchable;

  public constructor(generatable: Generatable, matchable?: Matchable) {
    this.generatable = generatable;
    this.matchable = matchable;
  }

  public generate(zatlin: Zatlin): string {
    for (let i = 0 ; i < 100 ; i ++) {
      let output = this.generatable.generate(zatlin);
      if (!this.testMatchable(output, zatlin)) {
        return output;
      }
    }
    throw new ZatlinError(2000, "Possibly empty");
  }

  private testMatchable(string: string, zatlin: Zatlin): boolean {
    if (this.matchable !== undefined) {
      for (let from = 0 ; from <= string.length ; from ++) {
        if (this.matchable.match(string, from, zatlin)) {
          return true;
        }
      }
      return false;
    } else {
      return false;
    }
  }

  public findUnknownIdentifier(zatlin: Zatlin): Identifier | undefined {
    return this.generatable.findUnknownIdentifier(zatlin) ?? this.matchable?.findUnknownIdentifier(zatlin);
  }

  public findCircularIdentifier(identifiers: Array<Identifier>, zatlin: Zatlin): Identifier | undefined {
    return this.generatable.findCircularIdentifier(identifiers, zatlin) ?? this.matchable?.findCircularIdentifier(identifiers, zatlin);
  }

  public toString(): string {
    let string = "";
    string += this.generatable.toString();
    if (this.matchable !== undefined) {
      string += ` - ${this.matchable.toString()}`;
    }
    return string;
  }

}