/**
 * @module route/parser
 */

"use strict";

import { parser } from "./compiled-grammar";
import * as nodes from "./nodes";

/** Wrap the compiled parser with the context to create node objects */
export { parser };
parser.yy = nodes;
