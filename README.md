## What is it?

A isomorphic, bullet-proof, ninja-ready route parsing, matching, and reversing library for Javascript in Node and the browser.

## Is it any good?

Yes.

## Why do I want it?

You want to write routes in a way that makes sense, capture named parameters, add additional constraints to routing, and be able to generate links using your routes. You don't want to be surprised by limitations in your router or hit a spiral of additional complexity when you need to do more advanced tasks.


## How do I install it?

```Shell
npm install --save route-parser
```

## How do I use it?

```javascript
Route = require('route-parser');
var route = new Route('/my/fancy/route/page/:page');
route.match('/my/fancy/route/page/7') // { page: 7 }
route.reverse({page: 3}) // -> '/my/fancy/route/page/3'
```
## What can I use in my routes?

| Example         | Description          |
| --------------- | -------- |
| `:name`         |  a parameter to capture from the route up to `/`, `?`, or end of string  |
| `*splat`        |  a splat to capture from the route up to `?` or end of string |
| `()`            |  Optional group that doesn't have to be part of the query. Can contain nested optional groups, params, and splats
| anything else   | free form literals |

Some examples:

* `/some/(optional/):thing`
* `/users/:id/comments/:comment/rating/:rating`
* `/*a/foo/*b`
* `/books/*section/:title`
* `/books?author=:author&subject=:subject`


## How does it work?

We define a grammar for route specifications and parse the route. Matching is done by generating a regular expression from that tree, and reversing is done by filling in parameter nodes in the tree.