//

import {
  Zatlin,
  ZatlinError
} from ".";
import {
  Generatable
} from "./generatable";


export class Identifier extends Generatable {

  public readonly text: string;

  public constructor(text: string) {
    super();
    this.text = text;
  }

  public generate(zatlin: Zatlin): string {
    const content = zatlin.findContent(this);
    if (content !== undefined) {
      const output = content.generate(zatlin);
      return output;
    } else {
      throw new ZatlinError(9000, "Cannot happen (at Identifier#generate)");
    }
  }

  public match(string: string, from: number, zatlin: Zatlin): Array<number> {
    const content = zatlin.findContent(this);
    if (content !== undefined) {
      const tos = content.match(string, from, zatlin);
      return tos;
    } else {
      throw new ZatlinError(9001, "Cannot happen (at Identifier#match)");
    }
  }

  public isMatchable(zatlin: Zatlin): boolean {
    const content = zatlin.findContent(this);
    if (content !== undefined) {
      const matchable = content.isMatchable(zatlin);
      return matchable;
    } else {
      throw new ZatlinError(9002, "Cannot happen (at Identifier#isMatchable)");
    }
  }

  public isValid(zatlin: Zatlin): boolean {
    return true;
  }

  public findUnknownIdentifier(zatlin: Zatlin): Identifier | undefined {
    if (!zatlin.hasDefinition(this)) {
      return this;
    } else {
      return undefined;
    }
  }

  public findCircularIdentifier(identifiers: Array<Identifier>, zatlin: Zatlin): Identifier | undefined {
    const identifier = identifiers.find((identifier) => identifier.equals(this));
    if (identifier !== undefined) {
      return identifier;
    } else {
      const definition = zatlin.findDefinition(this);
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