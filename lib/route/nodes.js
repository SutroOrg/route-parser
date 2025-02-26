"use strict";

/** @module route/nodes */

/**
 * Create a node for use with the parser, giving it a constructor that takes
 * props, children, and returns an object with props, children, and a
 * displayName.
 * @param  {String} displayName The display name for the node
 * @return {{displayName: string, props: Object, children: Array}}
 */
function createNode(displayName) {
  return function (props, children) {
    return {
      displayName: displayName,
      props: props,
      children: children || [],
    };
  };
}

export const Root = createNode("Root");
export const Concat = createNode("Concat");
export const Literal = createNode("Literal");
export const Splat = createNode("Splat");
export const Param = createNode("Param");
export const Optional = createNode("Optional");
