"use strict";

import { createVisitor } from "./create_visitor.js";

const generateSegment = (node, context) => {
  if (!"generators" in context) {
    return false;
  }
  const matchingGenerator = context.generators.find((gen) =>
    gen.match.test(node.props.name)
  );
  if (matchingGenerator) {
    return matchingGenerator.generate(node.props.name);
  }
  return false;
};

/**
 * Visitor for the AST to generate a path with filled in parameters
 * @class GenerateVisitor
 * @borrows Visitor-visit
 */
export const GenerateVisitor = createVisitor({
  Concat: function (node, context) {
    var childResults = node.children.map(
      function (child) {
        return this.visit(child, context);
      }.bind(this)
    );

    if (
      childResults.some(function (c) {
        return c === false;
      })
    ) {
      return false;
    }
    return childResults.join("");
  },

  Literal: function (node) {
    return decodeURI(node.props.value);
  },

  Splat: function (node, context) {
    return generateSegment(node, context);
  },

  Param: function (node, context) {
    return generateSegment(node, context);
  },

  Optional: function (node, context) {
    var childResult = this.visit(node.children[0], context);
    if (childResult) {
      return childResult;
    }

    return "";
  },

  Root: function (node, context) {
    context = context || {};
    var childResult = this.visit(node.children[0], context);
    if (childResult === false || typeof childResult === "undefined") {
      return false;
    }
    return encodeURI(childResult);
  },
});
