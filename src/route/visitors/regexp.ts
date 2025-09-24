"use strict";
import type { AstNode } from "../nodes.js";
import { createVisitor, type Visitor } from "./create_visitor.js";

const escapeRegExp = /[-{}[\]+?.,\\^$|#\s]/g;

/**
 * @class
 * @private
 */
class Matcher {
  re: string;
  captures: string[];

  constructor(options: { re: string; captures: string[] }) {
    this.captures = options.captures;
    this.re = options.re;
  }

  match(path: string): Record<string, string | undefined> | false {
    const match = new RegExp(this.re).exec(path);
    const matchParams: Record<string, string | undefined> = {};

    if (!match) {
      return false;
    }

    this.captures.forEach(function (capture, i) {
      const nextMatch = match[i + 1];
      if (typeof nextMatch === "undefined") {
        matchParams[capture] = undefined;
      } else {
        matchParams[capture] = decodeURIComponent(nextMatch);
      }
    });

    return matchParams;
  }
}

/**
 * Visitor for the AST to create a regular expression matcher
 * @class RegexpVisitor
 * @borrows Visitor-visit
 */
export const RegexpVisitor: Visitor<never, Matcher> = createVisitor({
  Concat: function (this: Visitor<never, Matcher>, node: AstNode) {
    return node.children.reduce((memo, child) => {
      const childResult = this.visit(child);
      return new Matcher({
        re: memo.re + childResult.re,
        captures: memo.captures.concat(childResult.captures),
      });
    }, new Matcher({ re: "", captures: [] }));
  },
  Literal: function (node: AstNode) {
    return new Matcher({
      re: node.props.value.replace(escapeRegExp, "\\$&"),
      captures: [],
    });
  },

  Splat: function (node: AstNode) {
    return new Matcher({
      re: "([^?]*?)",
      captures: [node.props.name],
    });
  },

  Param: function (node: AstNode) {
    return new Matcher({
      re: "([^\\/\\?]+)",
      captures: [node.props.name],
    });
  },

  Optional: function (this: Visitor<never, Matcher>, node: AstNode) {
    const child = this.visit(node.children[0]!);
    return new Matcher({
      re: "(?:" + child.re + ")?",
      captures: child.captures,
    });
  },

  Root: function (this: Visitor<never, Matcher>, node) {
    const childResult = this.visit(node.children[0]!);
    return new Matcher({
      re: "^" + childResult.re + "(?=\\?|$)",
      captures: childResult.captures,
    });
  },
});
