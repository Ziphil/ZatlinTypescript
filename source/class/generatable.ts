//

import {
  Identifier,
  Zatlin
} from ".";


export interface Generatable {

  generate(zatlin: Zatlin): string;

  // ちょうど from で与えられた位置から右向きにマッチするかどうかを調べます。
  // マッチした場合はマッチした範囲の右端のインデックス (範囲にそのインデックス自体は含まない) を返します。
  // マッチしなかった場合は -1 を返します。
  match(string: string, from: number, zatlin: Zatlin): number;

  isMatchable(zatlin: Zatlin): boolean;

  // 存在しない識別子を含んでいればそれを返し、そうでなければ undefined を返します。
  findUnknownIdentifier(zatlin: Zatlin): Identifier | undefined;

  // 識別子定義文を全て展開したときに identifiers に含まれる識別子が含まれていればそれを返し、そうでなければ undefined を返します。
  // 識別子の定義が循環参照していないかを調べるのに用いられます。
  findCircularIdentifier(identifiers: Array<Identifier>, zatlin: Zatlin): Identifier | undefined;

}