<div align="center">
<h1>Zatlin</h1>
</div>

![](https://img.shields.io/github/package-json/v/Ziphil/TypescriptZatlin)
![](https://img.shields.io/github/commit-activity/y/Ziphil/TypescriptZatlin?label=commits)
![](https://img.shields.io/endpoint.svg?url=https%3A%2F%2Factions-badge.atrox.dev%2FZiphil%2FTypescriptZatlin%2Fbadge%3Fref%3Ddevelop&label=test&style=flat&logo=none)
[![](https://img.shields.io/codecov/c/github/Ziphil/TypescriptZatlin)](https://app.codecov.io/gh/Ziphil/TypescriptZatlin)


## Overview
Zatlin is a domain-specific language to generate words of a constructed langauge.
This package serves a TypeScript implementation of Zatlin.

## Installation
Install via [npm](https://www.npmjs.com/package/zatlin).
```
npm i zatlin
```

## Usage
Call `Zatlin.load` with a source string to create a `Zatlin` object, and then call `generate` to generate a string.
```javascript
const {Zatlin} = require("zatlin");

let zatlin = Zatlin.load(`% "a" | "b" | "c";`);
let output = zatlin.generate();
console.log(output);
```
If an identifier name is passed to `generate` method, the processor generates a string from the specified identifier.
```javascript
const {Zatlin} = require("zatlin");

let zatlin = Zatlin.load(`
  foo = "a" | "b" ; bar = "x" | "y";
  % "p" | "q" ;
`);
let output = zatlin.generate("bar");
console.log(output);  // outputs “x” or “y”
```

## Documentations
### Syntax
- Version 1.0
- Version 1.1: [日本語](document/syntax/1.1-ja.md)
- Version 1.2: [日本語](document/syntax/1.2-ja.md)

### Error messages
- [Error messages](document/error.md)

## Note on versioning
First note that the version of this package and that of Zatlin implemented in it are different.

Zatlin 1.0 is the first version of Zatlin, and implemented in the desktop version of ZpDIC.
There is also a self-contained Java implementation [here](https://github.com/Ziphil/Zatlin).

Zatlin 1.1 and 1.2 are enhanced versions whose syntax is more powerful, and implemented in this package.