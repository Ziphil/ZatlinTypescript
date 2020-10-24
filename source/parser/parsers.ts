//

import Parsimmon from "parsimmon";
import {
  Parser,
  alt,
  lazy,
  seq
} from "parsimmon";
import {
  attempt
} from "./util";


export class Parsers {

  private static blankOrBreak: Parser<null> = lazy(() => {
    let parser = Parsimmon.regexp(/\s*/).result(null);
    return parser;
  });

  private static blank: Parser<null> = lazy(() => {
    let parser = Parsimmon.regexp(/[^\S\n]*/).result(null);
    return parser;
  });

  private static break: Parser<null> = lazy(() => {
    let parser = Parsimmon.string("\n").result(null);
    return parser;
  });

  private static parened<T>(parser: Parser<T>): Parser<T> {
    let leftParser = seq(Parsimmon.string("("), Parsers.blank);
    let rightParser = seq(Parsers.blank, Parsimmon.string(")"));
    let wrappedParser = seq(leftParser, parser, rightParser).map((result) => result[1]);
    return wrappedParser;
  }

}