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
  private readonly mainGeneratable: Generatable;

  public constructor(sentences: Array<Sentence>) {
    let definitions = [];
    let mainGeneratable;
    for (let sentence of sentences) {
      if (sentence instanceof Definition) {
        let duplicatedIndex = definitions.findIndex((definition) => {
          let castSentence = sentence as Definition;
          return definition.identifier.equals(castSentence.identifier);
        });
        if (duplicatedIndex < 0) {
          definitions.push(sentence);
        } else {
          throw new ZatlinError(1102, `Duplicate definition of identifier: '${sentence.identifier}'`);
        }
      } else {
        if (mainGeneratable === undefined) {
          mainGeneratable = sentence;
        } else {
          throw new ZatlinError(1001, "There are multiple main patterns");
        }
      }
    }
    if (mainGeneratable === undefined) {
      throw new ZatlinError(1000, "There is no main pattern");
    }
    this.definitions = definitions;
    this.mainGeneratable = mainGeneratable;
    this.checkUnknownIdentifier();
    this.checkCircularIdentifier();
  }

  public static load(source: string): Zatlin {
    let zatlin = Parsers.zatlin.tryParse(source);
    return zatlin;
  }

  public generate(identifierName?: string): string {
    let generatable = (() => {
      if (identifierName !== undefined) {
        let generatable = this.findContent(new Identifier(identifierName));
        if (generatable !== undefined) {
          return generatable;
        } else {
          throw new ZatlinError(2001, `No such identifier: '${identifierName}'`);
        }
      } else {
        return this.mainGeneratable;
      }
    })();
    return generatable.generate(this);
  }

  // 存在しない識別子を参照していないかチェックします。
  private checkUnknownIdentifier(): void {
    let generatables = [...this.definitions, this.mainGeneratable];
    for (let generatable of generatables) {
      let identifier = generatable.findUnknownIdentifier(this);
      if (identifier !== undefined) {
        throw new ZatlinError(1100, `Unresolved identifier: '${identifier.text}' in '${generatable}'`);
      }
    }
  }

  // 識別子が循環参照していないかチェックします。
  private checkCircularIdentifier(): void {
    let identifier = this.mainGeneratable.findCircularIdentifier([], this);
    if (identifier !== undefined) {
      throw new ZatlinError(1101, `Circular reference involving identifier: '${identifier.text}'`);
    }
  }

  // メインパターンおよび識別子定義文の右辺のパターンにおいて、正当でないパターンが含まれていないかチェックします。
  // 当初の想定から仕様が変更されたことにより、現在は全ての可能なパターンが正当であるため、このメソッドを呼ぶ意味はありません。
  private checkValid(): void {
    let generatables = [...this.definitions.map((definition) => definition.content), this.mainGeneratable!];
    for (let generatable of generatables) {
      let valid = generatable.isValid(this);
      if (!valid) {
        throw new ZatlinError(1103, `Invalid exclusion pattern: '${generatable}'`);
      }
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