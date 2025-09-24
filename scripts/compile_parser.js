#!/usr/bin/env node
import { writeFileSync } from "fs";
import { join } from "path";
import grammar from "../src/route/grammar.js";

import jison from "jison";
import Lexer from "jison-lex";

const parser = new jison.Parser(grammar);

parser.lexer = new Lexer(grammar.lex, null, grammar.terminals_);

// Remove _token_stack label manually until fixed in jison:
// https://github.com/zaach/jison/issues/351
// https://github.com/zaach/jison/pull/352
const compiledGrammar = parser
  .generate({ moduleType: "js" })
  .replace(/_token_stack:\s?/, "");

writeFileSync(
  join(import.meta.dirname, "/../src/route/compiled-grammar.js"),
  [
    compiledGrammar,
    `
export { parser};
`,
  ].join("")
);
