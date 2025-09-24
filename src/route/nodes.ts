"use strict";

export type AstNode = {
  displayName: string;
  props: {
    name: string;
    value: string;
  };
  children: AstNode[];
};

/**
 * Create a node for use with the parser, giving it a constructor that takes
 * props, children, and returns an object with props, children, and a
 * displayName.
 * @param displayName The display name for the node
 */
function createNode(displayName: AstNode["displayName"]) {
  return function (
    props: AstNode["props"],
    children: AstNode["children"]
  ): AstNode {
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

export const NODES = {
  Root,
  Concat,
  Literal,
  Splat,
  Param,
  Optional,
} as const;
