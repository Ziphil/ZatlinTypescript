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


export class ZatlinParser {

  public constructor() {
  }

  public tryParse(input: string): Zatlin {
    return this.root.tryParse(input);
  }

  public root: Parser<Zatlin> = lazy(() => {
    let parser = seq(
      this.blankOrBreak,
      this.sentences,
      Parsimmon.eof
    ).map(([, sentences]) => new Zatlin(sentences));
    return parser;
  });

  private sentences: Parser<Array<Sentence>> = lazy(() => {
    let parser = this.sentence.atLeast(1).map((sentences) => {
      let filteredSentences = sentences.filter((sentence) => sentence !== null) as Array<Sentence>;
      return filteredSentences;
    });
    return parser;
  });

  private sentence: Parser<Sentence | null> = lazy(() => {
    let parser = alt(this.definition, this.mainGeneratable, this.comment);
    return parser;
  });

  private definition: Parser<Definition> = lazy(() => {
    let parser = seq(
      this.identifier,
      Parsimmon.string("=").trim(this.blank),
      this.compound,
      seq(this.blank, this.semicolon)
    ).map(([identifier, , content]) => new Definition(identifier, content));
    return parser;
  });

  private mainGeneratable: Parser<Generatable> = lazy(() => {
    let parser = seq(
      seq(Parsimmon.string("%"), this.blank),
      this.compound,
      seq(this.blank, this.semicolon)
    ).map(([, generatable]) => generatable);
    return parser;
  });

  private compound: Parser<Compound> = lazy(() => {
    let exclusionParser = seq(
      seq(Parsimmon.string("-"), this.blank),
      this.disjunction
    ).map(([, disjunction]) => disjunction);
    let parser = seq(
      this.disjunction,
      this.blank,
      exclusionParser.times(0, 1).map((result) => result[0])
    ).map(([disjunction, , exclusion]) => new Compound(disjunction, exclusion));
    return parser;
  });

  private disjunction: Parser<Disjunction> = lazy(() => {
    let parser = this.weightedSequence.sepBy1(Parsimmon.string("|").trim(this.blank)).map((weightedSequences) => new Disjunction(weightedSequences));
    return parser;
  });

  private weightedSequence: Parser<Weighted<Sequence>> = lazy(() => {
    let parser = seq(
      this.sequence,
      this.blank,
      this.weight.times(0, 1).map((result) => result[0])
    ).map(([sequence, , weight]) => [sequence, weight ?? 1] as const);
    return parser;
  });

  private sequence: Parser<Sequence> = lazy(() => {
    let parser = seq(
      this.leadingCircumflex.times(0, 1).map((result) => result[0]),
      this.blank,
      this.sequenceGeneratable.sepBy1(this.blank),
      this.blank,
      this.trailingCircumflex.times(0, 1).map((result) => result[0])
    ).map(([leadingCircumflex, , sequenceElements, , trailingCircumflex]) => {
      let generatables = [leadingCircumflex, ...sequenceElements, trailingCircumflex].filter((generatable) => generatable !== undefined);
      return new Sequence(generatables);
    });
    return parser;
  });

  private sequenceGeneratable: Parser<SequenceGeneratable> = lazy(() => {
    let compoundParser = this.compound.thru(this.parened.bind(this));
    let parser = alt(this.quote, this.backref, this.identifier, compoundParser);
    return parser;
  });

  private quote: Parser<Quote> = lazy(() => {
    let parser = seq(
      Parsimmon.string("\""),
      alt(this.quoteEscape, this.quoteContent).many().tie(),
      Parsimmon.string("\"")
    ).map(([, text]) => new Quote(text));
    return parser;
  });

  private quoteEscape: Parser<string> = lazy(() => {
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

  private quoteContent: Parser<string> = lazy(() => {
    let parser = Parsimmon.noneOf("\\\"");
    return parser;
  });

  private backref: Parser<Backref> = lazy(() => {
    let indexParser = Parsimmon.regexp(/\d+/).map((string) => parseInt(string));
    let parser = seq(
      Parsimmon.string("&"),
      indexParser
    ).map(([, index]) => new Backref(index - 1));
    return parser;
  });

  private leadingCircumflex: Parser<Circumflex> = lazy(() => {
    let parser = Parsimmon.string("^").result(new Circumflex(true));
    return parser;
  });

  private trailingCircumflex: Parser<Circumflex> = lazy(() => {
    let parser = Parsimmon.string("^").result(new Circumflex(false));
    return parser;
  });

  private comment: Parser<null> = lazy(() => {
    let parser = seq(
      Parsimmon.string("#"),
      Parsimmon.noneOf("\n").many(),
      this.blankOrBreak
    ).result(null);
    return parser;
  });

  // 文末の (省略されているかもしれない) セミコロンおよびその後の改行を含むスペースをパースします。
  private semicolon: Parser<null> = lazy(() => {
    let semicolonParser = seq(Parsimmon.string(";"), this.blankOrBreak);
    let breakParser = seq(this.break, this.blankOrBreak);
    let commentParser = this.comment;
    let parser = alt(semicolonParser, breakParser, commentParser).result(null);
    return parser;
  });

  private identifier: Parser<Identifier> = lazy(() => {
    let parser = this.identifierText.map((text) => new Identifier(text));
    return parser;
  });

  private identifierText: Parser<string> = lazy(() => {
    let parser = Parsimmon.regexp(/[a-zA-Z][a-zA-Z0-9_]*/);
    return parser;
  });

  private weight: Parser<number> = lazy(() => {
    let parser = Parsimmon.regexp(/\d+\.?\d*|\.\d+/).map((string) => parseFloat(string));
    return parser;
  });

  private blankOrBreak: Parser<null> = lazy(() => {
    let parser = seq(
      Parsimmon.regexp(/\s*/),
      Parsimmon.eof.times(0, 1)
    ).result(null);
    return parser;
  });

  private blank: Parser<null> = lazy(() => {
    let parser = Parsimmon.regexp(/[^\S\n]*/).result(null);
    return parser;
  });

  private break: Parser<null> = lazy(() => {
    let parser = alt(Parsimmon.string("\n"), Parsimmon.eof).result(null);
    return parser;
  });

  private parened<T>(parser: Parser<T>): Parser<T> {
    let leftParser = seq(Parsimmon.string("("), this.blank);
    let rightParser = seq(this.blank, Parsimmon.string(")"));
    let wrappedParser = seq(leftParser, parser, rightParser).map((result) => result[1]);
    return wrappedParser;
  }

}