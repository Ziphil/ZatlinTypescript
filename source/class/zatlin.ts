//

import {
  Definition,
  Generatable,
  Identifier,
  ZatlinError
} from ".";
import {
  Parsers
} from "../parser/parsers";


export class Zatlin {

  private readonly definitions: ReadonlyArray<Definition>;
  private readonly mainGeneratable?: Generatable;

  public constructor(sentences: Array<Sentence>) {
    let definitions = [];
    let mainGeneratable;
    for (let sentence of sentences) {
      if (sentence instanceof Definition) {
        definitions.push(sentence);
      } else {
        if (mainGeneratable === undefined) {
          mainGeneratable = sentence;
        } else {
          throw new ZatlinError(1009, "There are multiple main patterns");
        }
      }
    }
    if (mainGeneratable === undefined) {
      throw new ZatlinError(1009, "There is no main pattern");
    }
    this.definitions = definitions;
    this.mainGeneratable = mainGeneratable;
  }

  public static load(source: string): Zatlin {
    let zatlin = Parsers.zatlin.tryParse(source);
    return zatlin;
  }

  public generate(): string {
    if (this.mainGeneratable !== undefined) {
      return this.mainGeneratable.generate(this);
    } else {
      throw new ZatlinError(9003, "Cannot happen (at Zatlin#generate)");
    }
  }

  public findDefinition(identifier: Identifier): Definition | undefined {
    for (let definition of this.definitions) {
      if (definition.identifier.equals(identifier)) {
        return definition;
      }
    }
    return undefined;
  }

  public findContent(identifier: Identifier): Generatable | undefined {
    for (let definition of this.definitions) {
      if (definition.identifier.equals(identifier)) {
        return definition.content;
      }
    }
    return undefined;
  }

  public hasDefinition(identifier: Identifier): boolean {
    return this.definitions.findIndex((definition) => definition.identifier.equals(identifier)) >= 0;
  }

  public toString(): string {
    let string = "";
    if (this.definitions.length > 0) {
      string += "definitions:\n";
      for (let definition of this.definitions) {
        string += `  ${definition}\n`;
      }
    }
    if (this.mainGeneratable) {
      string += "main:\n";
      string += `  % ${this.mainGeneratable}\n`;
    }
    return string;
  }

}


export type Sentence = Definition | Generatable;