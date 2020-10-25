//

import {
  Zatlin
} from "../source/class";


function repeat(zatlin: Zatlin, count: number, predicate: (output: string) => unknown): void {
  for (let i = 0 ; i < count ; i ++) {
    let output = zatlin.generate();
    expect(predicate(output)).toBeTruthy();
  }
}

describe("normal", () => {
  test("simple", () => {
    let zatlin = Zatlin.load(`
      % "a" | "b" | "c";
    `);
    repeat(zatlin, 20, (output) => output === "a" || output === "b" || output === "c");
  });
  test("simple with exclusion", () => {
    let zatlin = Zatlin.load(`
      % "a" | "b" | "c" - "b";
    `);
    repeat(zatlin, 20, (output) => output === "a" || output === "c");
    repeat(zatlin, 20, (output) => output !== "b");
  });
});