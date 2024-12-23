//

import {Zatlin} from "../source/class";


function repeat(zatlin: Zatlin, count: number, predicates: Array<(output: string) => unknown>): void {
  for (let i = 0 ; i < count ; i ++) {
    const output = zatlin.generate();
    const results = predicates.map((predicate) => !!predicate(output));
    expect(results).not.toContain(false);
  }
}

describe("normal", () => {
  test("simple", () => {
    const zatlin = Zatlin.load(`
      % "a" | "b" | "c";
    `);
    repeat(zatlin, 20, [
      (output) => output === "a" || output === "b" || output === "c"
    ]);
  });
  test("simple with exclusion", () => {
    const zatlin = Zatlin.load(`
      % "a" | "b" | "c" - "b";
    `);
    repeat(zatlin, 20, [
      (output) => output === "a" || output === "c",
      (output) => output !== "b"
    ]);
  });
  test("nested exclusion", () => {
    const zatlin = Zatlin.load(`
      % "a" | "b" | "c" - ("b" | "c" - "c");
    `);
    repeat(zatlin, 20, [
      (output) => output === "a" || output === "c",
      (output) => output !== "b"
    ]);
  });
  test("exclusion with probability zero", () => {
    const zatlin = Zatlin.load(`
      % "a" | "b" | "c" - ("b" | "c" 0);
    `);
    repeat(zatlin, 20, [
      (output) => output === "a" || output === "c"
    ]);
  });
  test("exclusion with multiple matches 1", () => {
    const zatlin = Zatlin.load(`
      % "ac" | "abc" | "x" - ("a" | "ab") "c";
    `);
    repeat(zatlin, 20, [
      (output) => output === "x"
    ]);
  });
  test("exclusion with multiple matches 2", () => {
    const zatlin = Zatlin.load(`
      % "aa" | "abab" | "abcabc" | "x" - ^ ("a" | "ab" | "abc") &2 ^;
    `);
    console.log(zatlin.toString());
    repeat(zatlin, 20, [
      (output) => (console.log(output), output === "x")
    ]);
  });
  test("simple with circumflex 1", () => {
    const zatlin = Zatlin.load(`
      % "aa" | "ab" | "ba" | "bb" - ^ "b" | "a" ^;
    `);
    repeat(zatlin, 20, [
      (output) => output === "ab"
    ]);
  });
  test("simple with circumflex 2", () => {
    const zatlin = Zatlin.load(`
      % "ac" | "bc" | "ab" - ^ ("a" | "b") "c" ^;
    `);
    repeat(zatlin, 20, [
      (output) => output === "ab"
    ]);
  });
  test("zero probability", () => {
    const zatlin = Zatlin.load(`
      % "a" 2 | "b" 0 | "c" 3;
    `);
    repeat(zatlin, 20, [
      (output) => output === "a" || output === "c",
      (output) => output !== "b"
    ]);
  });
  test("identifier", () => {
    const zatlin = Zatlin.load(`
      char = "a" | "b" | "c";
      % char;
    `);
    repeat(zatlin, 20, [
      (output) => output === "a" || output === "b" || output === "c"
    ]);
  });
  test("backref 1", () => {
    const zatlin = Zatlin.load(`
      char = "a" | "b" | "c";
      % char &1 char &3;
    `);
    repeat(zatlin, 20, [
      (output) => output.length === 4,
      (output) => output.charAt(0) === output.charAt(1),
      (output) => output.charAt(2) === output.charAt(3)
    ]);
  });
  test("backref 2", () => {
    const zatlin = Zatlin.load(`
      char = "a" | "b" | "c";
      % char char char - char &1 | char char &1;
    `);
    repeat(zatlin, 20, [
      (output) => output.length === 3,
      (output) => new Set(output.split("")).size === 3
    ]);
  });
  test("comment", () => {
    const zatlin = Zatlin.load(`
      char = "a" | "b" | "c"#comment
      # comment
      % char;  # comment
    `);
    repeat(zatlin, 20, [
      (output) => output === "a" || output === "b" || output === "c"
    ]);
  });
  test("complex 1", () => {
    const zatlin = Zatlin.load(`
      vowel = "a" | "e" | "i" | "o" | "u";
      cons = "s" | "t" | "k";
      % cons vowel cons;
    `);
    repeat(zatlin, 50, [
      (output) => output.length === 3,
      (output) => output.match(/^[stk][aeiou][stk]$/)
    ]);
  });
  test("complex 2", () => {
    const zatlin = Zatlin.load(`
      semivowel = "y" | "w";
      cons = "s" | "z" | semivowel 2;
      vowel = "a" | "e" | "i" | "o" | "u";
      % cons cons vowel cons - semivowel "i" | "y" ^;
    `);
    repeat(zatlin, 50, [
      (output) => output.length === 4,
      (output) => !output.includes("yi") && !output.includes("wi"),
      (output) => !output.endsWith("y")
    ]);
  });
  test("complex 3", () => {
    const zatlin = Zatlin.load(`
      vowel = "a" | "e" | "i" | "o" | "u";
      cons = "s" | "z" | "t" | "d" | "k" | "g";
      pattern = ("s" | "t" | "k") ("y" | "") vowel (vowel - "a" | "o") cons;
      % pattern - ^ "k" "y";
    `);
    repeat(zatlin, 50, [
      (output) => output.length === 5 || output.length === 4,
      (output) => output[output.length - 2].match(/^[eiu]$/),
      (output) => !output.startsWith("ky")
    ]);
  });
});

describe("errors", () => {
  test("no main pattern", () => {
    expect.assertions(2);
    try {
      const zatlin = Zatlin.load(`
        foo = "a" | "b";
        bar = "c" | foo;
      `);
    } catch (error) {
      expect(error.name).toBe("ZatlinError");
      expect(error.code).toBe(1000);
    }
  });
  test("multiple main patterns", () => {
    expect.assertions(2);
    try {
      const zatlin = Zatlin.load(`
        % foo;
        foo = "a" | "b";
        bar = "c" | foo;
        % bar;
      `);
    } catch (error) {
      expect(error.name).toBe("ZatlinError");
      expect(error.code).toBe(1001);
    }
  });
  test("unresolved identifier", () => {
    expect.assertions(2);
    try {
      const zatlin = Zatlin.load(`
        foo = bar | undefined;
        bar = "a" | "b";
        % foo;
      `);
    } catch (error) {
      expect(error.name).toBe("ZatlinError");
      expect(error.code).toBe(1100);
    }
  });
  test("circular identifier", () => {
    expect.assertions(2);
    try {
      const zatlin = Zatlin.load(`
        foo = bar | circular;
        circular = bar | baz;
        baz = foo;
        bar = "a" | "b";
        % foo;
      `);
    } catch (error) {
      expect(error.name).toBe("ZatlinError");
      expect(error.code).toBe(1101);
    }
  });
  test("duplicate identifier", () => {
    expect.assertions(2);
    try {
      const zatlin = Zatlin.load(`
        foo = "a" | "b";
        bar = "c";
        baz = "d";
        foo = "e" | "f";
        % foo;
      `);
    } catch (error) {
      expect(error.name).toBe("ZatlinError");
      expect(error.code).toBe(1102);
    }
  });
  test("zero total weight", () => {
    expect.assertions(2);
    try {
      const zatlin = Zatlin.load(`
        % "a" 0 | "b" 0 | "c" 0;
      `);
    } catch (error) {
      expect(error.name).toBe("ZatlinError");
      expect(error.code).toBe(1104);
    }
  });
  test("invalid backref 1", () => {
    expect.assertions(2);
    try {
      const zatlin = Zatlin.load(`
        % "a" &1 "b" &4;
      `);
    } catch (error) {
      expect(error.name).toBe("ZatlinError");
      expect(error.code).toBe(1105);
    }
  });
  test("invalid backref 2", () => {
    expect.assertions(2);
    try {
      const zatlin = Zatlin.load(`
        % "a" "b" &0;
      `);
    } catch (error) {
      expect(error.name).toBe("ZatlinError");
      expect(error.code).toBe(1105);
    }
  });
  test("possibly empty 1", () => {
    expect.assertions(2);
    try {
      const zatlin = Zatlin.load(`
        % "ab" | "ac" | "bc" - ^ "a" | "c" ^;
      `);
      zatlin.generate();
    } catch (error) {
      expect(error.name).toBe("ZatlinError");
      expect(error.code).toBe(2000);
    }
  });
  test("possibly empty 2", () => {
    expect.assertions(2);
    try {
      const zatlin = Zatlin.load(`
        % "a" 1000000 | "b" 1 - "a";
      `);
      zatlin.generate();
    } catch (error) {
      expect(error.name).toBe("ZatlinError");
      expect(error.code).toBe(2000);
    }
  });
  test("no identifier", () => {
    expect.assertions(2);
    try {
      const zatlin = Zatlin.load(`
        foo = "a" | "b"; bar = "x" | "y";
        % foo;
      `);
      zatlin.generate("baz");
    } catch (error) {
      expect(error.name).toBe("ZatlinError");
      expect(error.code).toBe(2001);
    }
  });
});