//

import {
  Generatable,
  Identifier,
  Zatlin
} from ".";


export class Sequence implements Generatable {

  private generatables: Array<Generatable>;

  public constructor(generatables: Array<Generatable>) {
    this.generatables = generatables;
  }

  public generate(zatlin: Zatlin): string {
    let output = "";
    for (let generatable of this.generatables) {
      output += generatable.generate(zatlin);
    }
    return output;
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