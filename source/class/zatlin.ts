//

import {
  Definition,
  Generatable,
  Identifier,
  ZatlinError
} from ".";


export class Zatlin {

  private definitions: Array<Definition> = [];
  private mainGeneratable?: Generatable;

  public static load(source: string): Zatlin {
    let zatlin = undefined as any;
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

}