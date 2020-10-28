//

import {
  Identifier,
  Zatlin
} from ".";


export abstract class Generatable<C = undefined, D = undefined> {

  public abstract generate(...args: GenerateArgs<C>): string;

  // ちょうど from で与えられた位置から右向きにマッチするかどうかを調べます。
  // マッチした場合はマッチした範囲の右端のインデックス (範囲にそのインデックス自体は含まない) を返します。
  // マッチしなかった場合は -1 を返します。
  public abstract match(...args: MatchArgs<D>): number;

  public test(...args: TestArgs<D>): boolean {
    let [string, zatlin, context] = args;
    for (let from = 0 ; from <= string.length ; from ++) {
      let args = [string, from, zatlin, context] as MatchArgs<D>;
      if (this.match(...args) >= 0) {
        return true;
      }
    }
    return false;
  }

  // このオブジェクトがマッチ可能 (除外設定に置いて良い) ならば true を返し、そうでなければ false を返します。
  public abstract isMatchable(zatlin: Zatlin): boolean;

  public abstract isValid(zatlin: Zatlin): boolean;

  // 存在しない識別子を含んでいればそれを返し、そうでなければ undefined を返します。
  public abstract findUnknownIdentifier(zatlin: Zatlin): Identifier | undefined;

  // 識別子定義文を全て展開したときに identifiers に含まれる識別子が含まれていればそれを返し、そうでなければ undefined を返します。
  // 識別子の定義が循環参照していないかを調べるのに用いられます。
  public abstract findCircularIdentifier(identifiers: Array<Identifier>, zatlin: Zatlin): Identifier | undefined;

}


type GenerateArgs<C> = C extends undefined ? [zatlin: Zatlin] : [zatlin: Zatlin, context: C];
type MatchArgs<D> = D extends undefined ? [string: string, from: number, zatlin: Zatlin] : [string: string, from: number, zatlin: Zatlin, context: D];
type TestArgs<D> = D extends undefined ? [string: string, zatlin: Zatlin] : [string: string, zatlin: Zatlin, context: D];