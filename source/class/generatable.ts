//

import {
  Identifier,
  Zatlin
} from ".";


export interface Generatable {

  generate(zatlin: Zatlin): string;

  // 存在しない識別子を含んでいればそれを返し、そうでなければ undefined を返します。
  findUnknownIdentifier(zatlin: Zatlin): Identifier | undefined;

  // 識別子定義文を全て展開したときに identifiers に含まれる識別子が含まれていればそれを返し、そうでなければ undefined を返します。
  // 識別子の定義が循環参照していないかを調べるのに用いられます。
  findCircularIdentifier(identifiers: Array<Identifier>, zatlin: Zatlin): Identifier | undefined;

}