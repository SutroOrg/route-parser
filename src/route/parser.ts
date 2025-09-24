/**
 * @module route/parser
 */

"use strict";
// @ts-expect-error No types available
import { parser } from "./compiled-grammar.js";
import * as nodes from "./nodes.js";

/** Wrap the compiled parser with the context to create node objects */
export { parser };
parser.yy = nodes;
