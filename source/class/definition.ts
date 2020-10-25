//

import {
  Identifier,
  Zatlin
} from ".";
import {
  Generatable
} from "./generatable";


export class Definition {

  public readonly identifier: Identifier;
  public readonly content: Generatable;

  public constructor(identifier: Identifier, content: Generatable) {
    this.identifier = identifier;
    this.content = content;
  }

  public findUnknownIdentifier(zatlin: Zatlin): Identifier | undefined {
    return this.content.findUnknownIdentifier(zatlin);
  }

  public findCircularIdentifier(identifiers: Array<Identifier>, zatlin: Zatlin): Identifier | undefined {
    let nextIdentifiers = [...identifiers, this.identifier];
    return this.content.findCircularIdentifier(nextIdentifiers, zatlin);
  }

  public toString(): string {
    let string = "";
    string += this.identifier.toString();
    string += " = ";
    string += this.content.toString();
    string += ";";
    return string;
  }

}