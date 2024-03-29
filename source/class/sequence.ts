//

import {Backref, Identifier, Zatlin, ZatlinError} from ".";
import {Generatable} from "./generatable";


export class Sequence extends Generatable {

  private readonly generatables: ReadonlyArray<SequenceGeneratable>;

  public constructor(generatables: Array<SequenceGeneratable>) {
    super();
    this.generatables = generatables;
    this.checkBackref();
  }

  public generate(zatlin: Zatlin): string {
    let output = "";
    const previousOutputs = [];
    for (const generatable of this.generatables) {
      const currentOutput = generatable.generate(zatlin, previousOutputs);
      previousOutputs.push(currentOutput);
      output += currentOutput;
    }
    return output;
  }

  public match(string: string, from: number, zatlin: Zatlin): Array<number> {
    const matchRecursive = function (generatables: ReadonlyArray<SequenceGeneratable>, string: string, from: number, zatlin: Zatlin, previousMatches: Array<string>): Array<number> {
      if (generatables.length > 0) {
        const [generatable, ...nextGeneratables] = generatables;
        const tos = generatable.match(string, from, zatlin, previousMatches);
        const allTos = tos.flatMap((to) => {
          const nextPreviousMatches = [...previousMatches, string.substring(from, to)];
          return matchRecursive(nextGeneratables, string, to, zatlin, nextPreviousMatches);
        });
        return allTos;
      } else {
        return [from];
      }
    };
    return matchRecursive(this.generatables, string, from, zatlin, []);
  }

  public isMatchable(zatlin: Zatlin): boolean {
    for (const generatable of this.generatables) {
      const matchable = generatable.isMatchable(zatlin);
      if (!matchable) {
        return false;
      }
    }
    return true;
  }

  public isValid(zatlin: Zatlin): boolean {
    for (const generatable of this.generatables) {
      const matchable = generatable.isMatchable(zatlin);
      if (!matchable) {
        return false;
      }
    }
    return true;
  }

  private checkBackref(): void {
    for (let index = 0 ; index < this.generatables.length ; index ++) {
      const generatable = this.generatables[index];
      if (generatable instanceof Backref) {
        if (!(generatable.index >= 0 && generatable.index < index)) {
          throw new ZatlinError(1105, `Index of backreference is invalid: '${generatable}' in '${this}'`);
        }
      }
    }
  }

  public findUnknownIdentifier(zatlin: Zatlin): Identifier | undefined {
    for (const generatable of this.generatables) {
      const identifier = generatable.findUnknownIdentifier(zatlin);
      if (identifier !== undefined) {
        return identifier;
      }
    }
    return undefined;
  }

  public findCircularIdentifier(identifiers: Array<Identifier>, zatlin: Zatlin): Identifier | undefined {
    for (const generatable of this.generatables) {
      const identifier = generatable.findCircularIdentifier(identifiers, zatlin);
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


export type SequenceGeneratable = Generatable<Array<string>, Array<string>>;