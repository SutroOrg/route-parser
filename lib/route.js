"use strict";

import { parser } from "./route/parser.js";
import { RegexpVisitor } from "./route/visitors/regexp.js";
import { ReverseVisitor } from "./route/visitors/reverse.js";

/**
 * Represents a route
 * @example
 * var route = Route('/:foo/:bar');
 * @example
 * var route = Route('/:foo/:bar');
 * @param {string} spec -  the string specification of the route.
 *     use :param for single portion captures, *param for splat style captures,
 *     and () for optional route branches
 * @constructor
 */
export class Route {
  /**
   * We're going to use a pool of routes to make it easier to compare instances.
   *
   * We want it so that `new Route('/foo/bar') === new Route('/foo/bar')` return the same
   */
  static #routePool = new Map();

  constructor(spec) {
    if (typeof spec === "undefined") {
      throw new Error("A route spec is required");
    }
    if (Route.#routePool.has(spec)) {
      return Route.#routePool.get(spec);
    }
    this.spec = spec;
    this.ast = parser.parse(spec);
    Route.#routePool.set(spec, this);
  }
  /**
   * Match a path against this route, returning the matched parameters if
   * it matches, false if not.
   * @example
   * var route = new Route('/this/is/my/route')
   * route.match('/this/is/my/route') // -> {}
   * @example
   * var route = new Route('/:one/:two')
   * route.match('/foo/bar/') // -> {one: 'foo', two: 'bar'}
   * @param  {string} path the path to match this route against
   * @return {(Object.<string,string>|false)} A map of the matched route
   * parameters, or false if matching failed
   */
  match(path) {
    var re = RegexpVisitor.visit(this.ast);
    var matched = re.match(path);

    return matched !== null ? matched : false;
  }
  /**
   * Reverse a route specification to a path, returning false if it can't be
   * fulfilled
   * @example
   * var route = new Route('/:one/:two')
   * route.reverse({one: 'foo', two: 'bar'}) -> '/foo/bar'
   * @param  {Object} params The parameters to fill in
   * @return {(String|false)} The filled in path
   */
  reverse(params) {
    return ReverseVisitor.visit(this.ast, params);
  }
}
