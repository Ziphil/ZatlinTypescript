//

import {
  Generatable,
  Zatlin,
  ZatlinError
} from ".";


export class Identifier implements Generatable {

  public readonly text: string;

  public constructor(text: string) {
    this.text = text;
  }

  public generate(zatlin: Zatlin): string {
    let content = zatlin.findContent(this);
    if (content !== undefined) {
      let output = content.generate(zatlin);
      return output;
    } else {
      throw new ZatlinError(9000, "Cannot happen (at Identifier#generate)");
    }
  }

  public findUnknownIdentifier(zatlin: Zatlin): Identifier | undefined {
    if (!zatlin.hasDefinition(this)) {
      return this;
    } else {
      return undefined;
    }
  }

  public findCircularIdentifier(identifiers: Array<Identifier>, zatlin: Zatlin): Identifier | undefined {
    let identifier = identifiers.find((identifier) => identifier.equals(this));
    if (identifier !== undefined) {
      return identifier;
    } else {
      let definition = zatlin.findDefinition(this);
      if (definition !== undefined) {
        return definition.findCircularIdentifier(identifiers, zatlin);
      } else {
        return undefined;
      }
    }
  }

  public equals(that: Identifier): boolean {
    return this.text === that.text;
  }

  public toString(): string {
    return this.text;
  }

}