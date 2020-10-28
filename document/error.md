## About error messages
Syntactic errors are reported by [parsimmon](https://www.npmjs.com/package/parsimmon) library, so see there for information of those errors.
This documentation only gives an explanation of semantic and run-time errors.

Each semantic or run-time error has a unique error code, which appears at the beginning of the error message.

## Semantic errors
### 1000: `There is no main pattern`
There is no main pattern defined.

### 1001: `There are multiple main patterns`
There are multiple main patterns defined.

### 1100: `Unresolved identifier: 'xxx' in 'xxx'`
An undefined identifier is used in a definition.

### 1101: `Circular reference involving identifier: 'xxx'`
There is a circular reference of identifiers.
Since this may cause an infinite loop at run-time, the processor reports it as an error beforehand.
```
foo = bar | circular;  # error occurs
circular = bar | baz;  # foo -> circular -> baz -> foo
baz = foo;
bar = "a" | "b";
% foo;
```
Note that, if a circular reference is inside unused identifiers, no errors will occur.

### 1102: `Duplicate definition of identifier: 'xxx'`
Identifiers with the same name are defined multiple times.

### 1103
This error code is currently not used.

### 1104: `Total weight is zero: 'xxx'`
The total weight of a pattern is zero.
Such pattern cannot produce any string, so the processor throws an error.

### 1105: `Index of backreference is invalid: 'xxx' in 'xxx'`
The index of a backreference pattern is invalid.
If a backreference pattern is placed at the *N*th (1-origin) position of a sequence pattern, its index must be between 1 and *N*−1 (thus especially a backreference cannot be placed at the top of a sequence).

## Run-time errors
### 2000: `Possibly empty`
The processor cannot generate an output which matches the specified pattern.
This most likely occurs when the possible outputs are all excluded by the exclusion pattern:
```
% "ab" | "ac" | "bc" - ^ "a" | "c" ^
# Every possible output (“ab” or “ac” or “bc”) either starts with “a” or ends with “c”.
# Such patterns are all specified to be excluded from the output.
# Thus the processor cannot generate anything.
```
Since the processor tries to generate a string only 100 times for each pattern, if the probability of the possible output is very low, this error may occur:
```
% "a" 1000000 | "b" 1 - "a";
# Theoretically this pattern can output “b”, but its probability is very low.
# Thus this pattern almost always fails to output a string.
```

## Other errors
### 90xx: `Cannot happen (at xxx)`
This error cannot occur if the processor runs as intended.
If this occurs, it is a bug of the processor, so please inform the developer.