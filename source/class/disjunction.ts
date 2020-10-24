//

import {
  Generatable,
  Identifier,
  Zatlin,
  ZatlinError
} from ".";


export class Disjunction implements Generatable {

  private weightedGeneratables: Array<WeightedGeneratable>;

  public constructor(weightedGeneratables: Array<WeightedGeneratable>) {
    this.weightedGeneratables = weightedGeneratables;
  }

  public generate(zatlin: Zatlin): string {
    let number = Math.random() * this.totalWeight;
    let currentWeight = 0;
    for (let [generatable, weight] of this.weightedGeneratables) {
      currentWeight += weight;
      if (number < currentWeight) {
        return generatable.generate(zatlin);
      }
    }
    throw new ZatlinError(9009, "Cannot happen (at Disjunction#generate)");
  }

  public findUnknownIdentifier(zatlin: Zatlin): Identifier | undefined {
    for (let [generatable] of this.weightedGeneratables) {
      let identifier = generatable.findUnknownIdentifier(zatlin);
      if (identifier !== undefined) {
        return identifier;
      }
    }
    return undefined;
  }

  public findCircularIdentifier(identifiers: Array<Identifier>, zatlin: Zatlin): Identifier | undefined {
    for (let [generatable] of this.weightedGeneratables) {
      let identifier = generatable.findCircularIdentifier(identifiers, zatlin);
      if (identifier !== undefined) {
        return identifier;
      }
    }
    return undefined;
  }

  public get totalWeight(): number {
    return this.weightedGeneratables.reduce((totalWeight, [, weight]) => totalWeight + weight, 0);
  }

  public toString(): string {
    let string = "";
    string += `(${this.weightedGeneratables.join(" | ")})`;
    return string;
  }

}


export type WeightedGeneratable = [Generatable, number];