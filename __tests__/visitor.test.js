/* global describe, it */

"use strict";

import { describe, expect, it } from "vitest";
import { createVisitor } from "../lib/route/visitors/create_visitor.js";

function sillyVisitor(node) {
  return node.displayName;
}

describe("createVisitor", function () {
  it("should throw if not all handler node types are defined", function () {
    expect(function () {
      createVisitor({ Root: function () {} });
    }).toThrow(/No handler defined/);
  });

  it("should create when all handlers are defined", function () {
    var visitor = createVisitor({
      Root: function (node) {
        return "Root(" + this.visit(node.children[0]) + ")";
      },
      Concat: function (node) {
        return (
          "Concat(" +
          node.children
            .map(
              function (child) {
                return this.visit(child);
              }.bind(this)
            )
            .join(" ") +
          ")"
        );
      },
      Optional: function (node) {
        return "Optional(" + this.visit(node.children[0]) + ")";
      },
      Literal: sillyVisitor,
      Splat: sillyVisitor,
      Param: sillyVisitor,
    });

    expect(visitor).toBeDefined();
  });
});
