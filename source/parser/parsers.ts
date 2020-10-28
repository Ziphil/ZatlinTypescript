//

import Parsimmon from "parsimmon";
import {
  Parser,
  alt,
  lazy,
  seq
} from "parsimmon";
import {
  Backref,
  Circumflex,
  Compound,
  Definition,
  Disjunction,
  Generatable,
  Identifier,
  Quote,
  Sentence,
  Sequence,
  SequenceGeneratable,
  Weighted,
  Zatlin
} from "../class";
import {
  attempt
} from "./util";


export class Parsers {

  public static zatlin: Parser<Zatlin> = lazy(() => {
    let parser = seq(
      Parsers.blankOrBreak,
      Parsers.sentences,
      Parsers.blankOrBreak,
      Parsimmon.eof
    ).map(([, sentences]) => new Zatlin(sentences));
    return parser;
  });

  private static sentences: Parser<Array<Sentence>> = lazy(() => {
    let parser = Parsers.sentence.atLeast(1).map((sentences) => {
      let filteredSentences = sentences.filter((sentence) => sentence !== null) as Array<Sentence>;
      return filteredSentences;
    });
    return parser;
  });

  private static sentence: Parser<Sentence | null> = lazy(() => {
    let parser = alt(Parsers.definition, Parsers.mainGeneratable, Parsers.comment);
    return parser;
  });

  private static definition: Parser<Definition> = lazy(() => {
    let parser = seq(
      Parsers.identifier,
      Parsimmon.string("=").trim(Parsers.blank),
      Parsers.compound,
      seq(Parsers.blank, Parsers.semicolon)
    ).map(([identifier, , content]) => new Definition(identifier, content));
    return parser;
  });

  private static mainGeneratable: Parser<Generatable> = lazy(() => {
    let parser = seq(
      seq(Parsimmon.string("%"), Parsers.blank),
      Parsers.compound,
      seq(Parsers.blank, Parsers.semicolon)
    ).map(([, generatable]) => generatable);
    return parser;
  });

  private static compound: Parser<Compound> = lazy(() => {
    let exclusionParser = seq(
      Parsimmon.string("-").trim(Parsers.blank),
      Parsers.disjunction
    ).map(([, disjunction]) => disjunction);
    let parser = seq(
      Parsers.disjunction,
      exclusionParser.thru(attempt).times(0, 1).map((result) => result[0])
    ).map(([disjunction, exclusion]) => new Compound(disjunction, exclusion));
    return parser;
  });

  private static disjunction: Parser<Disjunction> = lazy(() => {
    let parser = Parsers.weightedSequence.sepBy1(Parsimmon.string("|").trim(Parsers.blank)).map((weightedSequences) => new Disjunction(weightedSequences));
    return parser;
  });

  private static weightedSequence: Parser<Weighted<Sequence>> = lazy(() => {
    let parser = seq(
      Parsers.sequence,
      Parsers.blank,
      Parsers.weight.times(0, 1).map((result) => result[0])
    ).map(([sequence, , weight]) => [sequence, weight ?? 1] as const);
    return parser;
  });

  private static sequence: Parser<Sequence> = lazy(() => {
    let parser = seq(
      Parsers.leadingCircumflex.times(0, 1).map((result) => result[0]),
      Parsers.blank,
      Parsers.sequenceGeneratable.sepBy1(Parsers.blank),
      Parsers.blank,
      Parsers.trailingCircumflex.times(0, 1).map((result) => result[0])
    ).map(([leadingCircumflex, , sequenceElements, , trailingCircumflex]) => {
      let generatables = [leadingCircumflex, ...sequenceElements, trailingCircumflex].filter((generatable) => generatable !== undefined);
      return new Sequence(generatables);
    });
    return parser;
  });

  private static sequenceGeneratable: Parser<SequenceGeneratable> = lazy(() => {
    let compoundParser = Parsers.compound.thru(Parsers.parened);
    let parser = alt(Parsers.quote, Parsers.backref, Parsers.identifier, compoundParser);
    return parser;
  });

  private static quote: Parser<Quote> = lazy(() => {
    let parser = seq(
      Parsimmon.string("\""),
      alt(Parsers.quoteEscape, Parsers.quoteContent).many().tie(),
      Parsimmon.string("\"")
    ).map(([, text]) => new Quote(text));
    return parser;
  });

  private static quoteEscape: Parser<string> = lazy(() => {
    let parser = seq(
      Parsimmon.string("\\"),
      alt(Parsimmon.regexp(/u[A-Fa-f0-9]{4}/), Parsimmon.oneOf("\\\""))
    ).map(([, escape]) => {
      if (escape.startsWith("u")) {
        let code = parseInt(escape.substr(1, 4), 16);
        let char = String.fromCharCode(code);
        return char;
      } else {
        return escape;
      }
    });
    return parser;
  });

  private static quoteContent: Parser<string> = lazy(() => {
    let parser = Parsimmon.noneOf("\\\"");
    return parser;
  });

  private static backref: Parser<Backref> = lazy(() => {
    let indexParser = Parsimmon.regexp(/\d+/).map((string) => parseInt(string));
    let parser = seq(
      Parsimmon.string("&"),
      indexParser
    ).map(([, index]) => new Backref(index - 1));
    return parser;
  });

  private static leadingCircumflex: Parser<Circumflex> = lazy(() => {
    let parser = Parsimmon.string("^").result(new Circumflex(true));
    return parser;
  });

  private static trailingCircumflex: Parser<Circumflex> = lazy(() => {
    let parser = Parsimmon.string("^").result(new Circumflex(false));
    return parser;
  });

  private static comment: Parser<null> = lazy(() => {
    let parser = seq(
      Parsimmon.string("#"),
      Parsimmon.noneOf("\n").many(),
      Parsers.blankOrBreak
    ).result(null);
    return parser;
  });

  // 文末の (省略されているかもしれない) セミコロンおよびその後の (改行を含む) スペースをパースします。
  private static semicolon: Parser<null> = lazy(() => {
    let semicolonParser = seq(Parsimmon.string(";"), Parsers.blankOrBreak);
    let breakParser = seq(Parsers.break, Parsers.blankOrBreak);
    let otherParser = Parsimmon.lookahead(alt(Parsimmon.string("#"), Parsimmon.eof));
    let parser = alt(semicolonParser, breakParser, otherParser).result(null);
    return parser;
  });

  private static identifier: Parser<Identifier> = lazy(() => {
    let parser = Parsers.identifierText.map((text) => new Identifier(text));
    return parser;
  });

  private static identifierText: Parser<string> = lazy(() => {
    let parser = Parsimmon.regexp(/[a-zA-Z][a-zA-Z0-9_]*/);
    return parser;
  });

  private static weight: Parser<number> = lazy(() => {
    let parser = Parsimmon.regexp(/\d+\.?\d*|\.\d+/).map((string) => parseFloat(string));
    return parser;
  });

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