"use strict";

import type { AstNode } from "../nodes.js";
import { createVisitor, type Visitor } from "./create_visitor.js";

type GenerateContext = {
  generators: Array<{ match: RegExp; generate: (name: string) => string }>;
};

const generateSegment = (node: AstNode, context: GenerateContext) => {
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
export const GenerateVisitor: Visitor<GenerateContext, string | false> =
  createVisitor({
    Concat: function (this: Visitor, node: AstNode, context?: GenerateContext) {
      const childResults = node.children.map((child: AstNode) => {
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

    Literal: function (node) {
      return decodeURI(node.props.value);
    },

    Splat: function (
      node,
      context = { generators: [{ match: /.*/, generate: () => "<missing>" }] }
    ) {
      return generateSegment(node, context);
    },

    Param: function (
      node,
      context = { generators: [{ match: /.*/, generate: () => "<missing>" }] }
    ) {
      return generateSegment(node, context);
    },

    Optional: function (
      this: Visitor<GenerateContext, string | false>,
      node: AstNode,
      context: GenerateContext = {
        generators: [{ match: /.*/, generate: () => "<missing>" }],
      }
    ) {
      const childResult = this.visit(node.children[0]!, context);
      if (childResult) {
        return childResult;
      }

      return "";
    },

    Root: function (
      this: Visitor<GenerateContext, string | false>,
      node,
      context: GenerateContext = {
        generators: [{ match: /.*/, generate: () => "<missing>" }],
      }
    ) {
      context = context || {};
      const childResult = this.visit(node.children[0]!, context);
      if (childResult === false || typeof childResult === "undefined") {
        return false;
      }
      return encodeURI(childResult);
    },
  });
