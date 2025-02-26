#!/usr/bin/env node
import { writeFileSync } from "fs";
import { join } from "path";
import grammar from "../lib/route/grammar.js";

import jison from "jison";
import Lexer from "jison-lex";

var parser = new jison.Parser(grammar);

// eslint-disable-next-line no-underscore-dangle
parser.lexer = new Lexer(grammar.lex, null, grammar.terminals_);

// Remove _token_stack label manually until fixed in jison:
// https://github.com/zaach/jison/issues/351
// https://github.com/zaach/jison/pull/352
var compiledGrammar = parser
  .generate({ moduleType: "js" })
  .replace(/_token_stack:\s?/, "");

writeFileSync(
  join(import.meta.dirname, "/../lib/route/compiled-grammar.js"),
  [
    compiledGrammar,
    `
export { parser};
`,
  ].join("")
);
