metalsmith-postcss
===============

A [PostCSS](https://github.com/postcss/postcss) plugin for Metalsmith.

## Installation

```sh
npm install --save metalsmith-postcss
```

## Getting Started

If you haven't checked out [Metalsmith](http://metalsmith.io/) before, head over to their website and check out the
documentation.

## CLI Usage

TBD

## JavaScript API

If you are using the JS Api for Metalsmith, then you can require the module and add it to your
`.use()` directives:

```js
var postcss = require('metalsmith-postcss');

metalsmith.use(postcss(plugins));
```

## Plugins

Pass an array of postcss plugins to be applied.
