"use strict";

import { createVisitor, type Visitor } from "./create_visitor.js";

/**
 * Visitor for the AST to reconstruct the normalized input
 * @class ReconstructVisitor
 * @borrows Visitor-visit
 */
export const ReconstructVisitor = createVisitor({
  Concat: function (this: Visitor<never, string>, node) {
    return node.children
      .map((child) => {
        return this.visit(child);
      })
      .join("");
  },

  Literal: function (node) {
    return node.props.value;
  },

  Splat: function (node) {
    return "*" + node.props.name;
  },

  Param: function (node) {
    return ":" + node.props.name;
  },

  Optional: function (this: Visitor<never, string>, node) {
    return "(" + this.visit(node.children[0]!) + ")";
  },

  Root: function (this: Visitor<never, string>, node) {
    return this.visit(node.children[0]!);
  },
});
