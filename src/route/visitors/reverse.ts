"use strict";

import { createVisitor, type Visitor } from "./create_visitor.js";

/**
 * Visitor for the AST to construct a path with filled in parameters
 * @class ReverseVisitor
 * @borrows Visitor-visit
 */
export const ReverseVisitor: Visitor<
  Record<string, string | number>,
  string | number | false
> = createVisitor({
  Concat: function (
    this: Visitor<Record<string, string | number>, string | false>,
    node,
    context
  ) {
    const childResults = node.children.map((child) => {
      return this.visit(child, context);
    });

    if (
      childResults.some(function (c) {
        return c === false;
      })
    ) {
      return false;
    }
    return childResults.join("");
  },

  Literal: function (
    this: Visitor<Record<string, string | number>, string | false>,
    node
  ) {
    return decodeURI(node.props.value);
  },

  Splat: function (
    this: Visitor<Record<string, string | number>, string | false>,
    node,
    context = {}
  ) {
    const nameFromContext = context[node.props.name];
    if (typeof nameFromContext === "undefined") {
      return false;
    }
    return nameFromContext;
  },

  Param: function (
    this: Visitor<Record<string, string | number>, string | false>,
    node,
    context = {}
  ) {
    const nameFromContext = context[node.props.name];
    if (typeof nameFromContext === "undefined") {
      return false;
    }
    return nameFromContext;
  },

  Optional: function (
    this: Visitor<Record<string, string | number>, string | false>,
    node,
    context
  ) {
    const childResult = this.visit(node.children[0]!, context);
    if (childResult) {
      return childResult;
    }

    return "";
  },

  Root: function (
    this: Visitor<Record<string, string | number>, string | false>,
    node,
    context
  ) {
    context = context || {};
    const childResult = this.visit(node.children[0]!, context);
    if (childResult === false || typeof childResult === "undefined") {
      return false;
    }
    return encodeURI(childResult);
  },
});
