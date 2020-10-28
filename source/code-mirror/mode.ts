//

import CodeMirror from "codemirror";
import "codemirror/addon/mode/simple";


let CodeMirrorAny = CodeMirror as any;

CodeMirrorAny.defineSimpleMode("zatlin", {
  start: [
    {regex: /"([^"\\]|\\"|\\\\|\\u[A-Fa-f0-9]{0,4})*?"/, token: "string"},
    {regex: /\&\d+/, token: "operator"},
    {regex: /\d+\.?\d*|\.\d+/, token: "number"},
    {regex: /[a-zA-Z][a-zA-Z0-9_]*/, token: "variable-1"},
    {regex: /\^/, token: "operator"},
    {regex: /#.*/, token: "comment"}
  ]
});