"use strict";

import { createVisitor } from "./create_visitor.js";

/**
 * Visitor for the AST to reconstruct the normalized input
 * @class ReconstructVisitor
 * @borrows Visitor-visit
 */
export const ReconstructVisitor = createVisitor({
  Concat: function (node) {
    return node.children
      .map(
        function (child) {
          return this.visit(child);
        }.bind(this)
      )
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

  Optional: function (node) {
    return "(" + this.visit(node.children[0]) + ")";
  },

  Root: function (node) {
    return this.visit(node.children[0]);
  },
});
