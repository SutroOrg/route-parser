"use strict";

import type { AstNode } from "../nodes.js";
import { NODES } from "../nodes.js";
const nodeTypes = Object.keys(NODES) as Array<keyof typeof NODES>;

export interface Visitor<C = unknown, R = unknown> {
  visit: (node: AstNode, context?: C) => R;
  handlers: Record<keyof typeof NODES, (node: AstNode, context?: C) => R>;
}

/**
 * Helper for creating visitors. Take an object of node name to handler
 * mappings, returns an object with a "visit" method that can be called
 * @param  {Object.<string,function(node,context)>} handlers A mapping of node
 * type to visitor functions
 * @return {{visit: function(node,context)}}  A visitor object with a "visit"
 * method that can be called on a node with a context
 */
export function createVisitor<C = unknown, R = unknown>(
  handlers: Record<keyof typeof NODES, (node: AstNode, context?: C) => R>
): Visitor<C, R> {
  nodeTypes.forEach(function (nodeType: keyof typeof NODES) {
    if (typeof handlers[nodeType] === "undefined") {
      throw new Error("No handler defined for " + nodeType);
    }
  });

  return {
    /**
     * Call the given handler for this node type
     * @param  node    the AST node
     * @param context context to pass through to handlers
     * @return
     */
    visit: function (node: AstNode, context?: C) {
      return this.handlers[node.displayName as keyof typeof NODES].call(
        this,
        node,
        context
      );
    },
    handlers: handlers,
  };
}
