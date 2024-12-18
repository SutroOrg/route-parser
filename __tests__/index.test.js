/* global describe, it */

"use strict";

import { describe, it, expect } from "vitest";
import {Route as RouteParser} from "../index.js";

describe("Route", function () {
  it("should create", function () {
    expect(new RouteParser("/foo")).toBeDefined();
  });

  it("should create with new", function () {
    expect(new RouteParser("/foo")).toBeDefined();
  });

  it("should have proper prototype", function () {
    var routeInstance = new RouteParser("/foo");
    expect(routeInstance instanceof RouteParser).toBeDefined();;
  });

  it("should throw on no spec", function () {
    expect(
      function () {
        new RouteParser();
      }).toThrowError(
      
      /spec is required/
    );
  });

  describe("basic", function () {
    it("should match /foo with a path of /foo", function () {
      var route = new RouteParser("/foo");
      expect(route.match("/foo")).toBeDefined();
    });

    it("should match /foo with a path of /foo?query", function () {
      var route = new RouteParser("/foo");
      expect(route.match("/foo?query")).toBeDefined();;
    });

    it("shouldn't match /foo with a path of /bar/foo", function () {
      var route = new RouteParser("/foo");
      expect(route.match("/bar/foo")).toBeFalsy();
    });

    it("shouldn't match /foo with a path of /foobar", function () {
      var route = new RouteParser("/foo");
      expect(route.match("/foobar")).toBeFalsy();
    });

    it("shouldn't match /foo with a path of /bar", function () {
      var route = new RouteParser("/foo");
      expect(route.match("/bar")).toBeFalsy();
    });
  });

  describe("basic parameters", function () {
    it("should match /users/:id with a path of /users/1", function () {
      var route = new RouteParser("/users/:id");
      expect(route.match("/users/1")).toBeDefined();;
    });

    it("should not match /users/:id with a path of /users/", function () {
      var route = new RouteParser("/users/:id");
      expect(route.match("/users/")).toBeFalsy();
    });

    it("should match /users/:id with a path of /users/1 and get parameters", function () {
      var route = new RouteParser("/users/:id");
      expect(route.match("/users/1")).toEqual( { id: "1" });
    });

    it("should match deep pathing and get parameters", function () {
      var route = new RouteParser(
        "/users/:id/comments/:comment/rating/:rating"
      );
      expect(route.match("/users/1/comments/cats/rating/22222")).toEqual( {
        id: "1",
        comment: "cats",
        rating: "22222",
      });
    });
  });

  describe("splat parameters", function () {
    it("should handle double splat parameters", function () {
      var route = new RouteParser("/*a/foo/*b");
      expect(route.match("/zoo/woo/foo/bar/baz")).toEqual( {
        a: "zoo/woo",
        b: "bar/baz",
      });
    });
  });

  describe("mixed", function () {
    it("should handle mixed splat and named parameters", function () {
      var route = new RouteParser("/books/*section/:title");
      expect(route.match("/books/some/section/last-words-a-memoir")).toEqual( {
        section: "some/section",
        title: "last-words-a-memoir",
      });
    });
  });

  describe("optional", function () {
    it("should allow and match optional routes", function () {
      var route = new RouteParser("/users/:id(/style/:style)");
      expect(route.match("/users/3")).toEqual( { id: "3", style: undefined });
    });

    it("should allow and match optional routes", function () {
      var route = new RouteParser("/users/:id(/style/:style)");
      expect(route.match("/users/3/style/pirate")).toEqual( {
        id: "3",
        style: "pirate",
      });
    });

    it("allows optional branches that start with a word character", function () {
      var route = new RouteParser("/things/(option/:first)");
      expect(route.match("/things/option/bar")).toEqual( { first: "bar" });
    });

    describe("nested", function () {
      it("allows nested", function () {
        var route =new  RouteParser("/users/:id(/style/:style(/more/:param))");
        var result = route.match("/users/3/style/pirate");
        var expected = { id: "3", style: "pirate", param: undefined };
        expect(result).toEqual( expected);
      });

      it("fetches the correct params from nested", function () {
        var route = new RouteParser("/users/:id(/style/:style(/more/:param))");
        expect(route.match("/users/3/style/pirate/more/things")).toEqual( {
          id: "3",
          style: "pirate",
          param: "things",
        });
      });
    });
  });

  describe("reverse", function () {
    it("reverses routes without params", function () {
      var route = new RouteParser("/foo");
      expect(route.reverse()).toEqual( "/foo");
    });

    it("reverses routes with simple params", function () {
      var route =new  RouteParser("/:foo/:bar");
      expect(route.reverse({ foo: "1", bar: "2" })).toEqual( "/1/2");
    });

    it("reverses routes with optional params", function () {
      var route = new RouteParser("/things/(option/:first)");
      expect(route.reverse({ first: "bar" })).toEqual( "/things/option/bar");
    });

    it("reverses routes with unfilled optional params", function () {
      var route = new RouteParser("/things/(option/:first)");
      expect(route.reverse()).toEqual( "/things/");
    });

    it("reverses routes with optional params that can't fulfill the optional branch", function () {
      var route = new RouteParser("/things/(option/:first(/second/:second))");
      expect(route.reverse({ second: "foo" })).toEqual( "/things/");
    });

    it("returns false for routes that can't be fulfilled", function () {
      var route = new RouteParser("/foo/:bar");
      expect(route.reverse({})).toEqual( false);
    });

    it("returns false for routes with splat params that can't be fulfilled", function () {
      var route = new RouteParser("/foo/*bar");
      expect(route.reverse({})).toEqual( false);
    });

    // https://git.io/vPBaA
    it("allows reversing falsy valued params", function () {
      var path = "/account/json/wall/post/:id/comments/?start=:start&max=:max";
      var vars = {
        id: 50,
        start: 0,
        max: 12,
      };
      expect(
        new  RouteParser(path).reverse(vars)).toEqual(
        "/account/json/wall/post/50/comments/?start=0&max=12"
      );
    });
  });
});
