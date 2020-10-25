// @ts-nocheck

import {
  Parsers
} from "../source/parser/parsers";


describe("definition", () => {
  test("simple 1", () => {
    let result = Parsers.definition.tryParse(`identifier = "foo" | "bar" | "baz" "two" "three"`);
  });
  test("simple 2", () => {
    let result = Parsers.definition.tryParse(`identifier = inner inner | "string" inner | "string" "string" | "string"`);
  });
  test("with weight", () => {
    let result = Parsers.definition.tryParse(`identifier = "foo" 3 | "bar" 1.94 | "baz" .2 | unweighted | "qux" 50.`);
  });
  test("with exclusion 1", () => {
    let result = Parsers.definition.tryParse(`identifier = "foo" | "bar" | "baz" "qux" - "exclusion" | exclusion`);
  });
  test("with exclusion 2", () => {
    let result = Parsers.definition.tryParse(`identifier = "foo" | "bar" | "baz" "qux" - ^ exact ^ | ^ prefix | suffix ^`);
  });
  test("complex 1", () => {
    let result = Parsers.definition.tryParse(`identifier = ("a" | "b" | "c") ("d" | "e") | "f" ("g" | "h")`);
  });
  test("complex 2", () => {
    let result = Parsers.definition.tryParse(`identifier = "a" ("b" 3 | "c" | ("d" | "e" "f" 1.7 | inner "g") 5) | ("h" | inner inner 4) "i" 2 - ^ ("j" | "k") "l" inner | "m" "n" ^`);
  });
});

describe("main generatable", () => {
  test("complex", () => {
    let result = Parsers.mainGeneratable.tryParse(`% "a" ("b" 3 | "c" | ("d" | "e" "f" 1.7 | inner "g") 5) | ("h" | inner inner 4) "i" 2 - ^ ("j" | "k") "l" inner | "m" "n" ^;`);
  });
});