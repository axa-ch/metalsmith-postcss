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

Pass your PostCSS plugins to `metalsmith-postcss` as follows:

```js
var postcss = require('metalsmith-postcss');

var pseudoelements = require('postcss-pseudoelements');
var nested = require('postcss-nested');

metalsmith.use(postcss([pseudoelements(), nested()]));
```

## Sourcemaps

This plugin doesn't generate sourcemaps by default. However, you
can enable them using several ways.

### Inline sourcemaps

Add `map: true` to the `options` argument to get your
sourcemaps written into the source file.

```js
metalsmith.use(postcss([...], {
  map: true
}));
```

Behind the scenes, this resolves to the following:

```js
metalsmith.use(postcss([...], {
  map: {
    inline: true
  }
}));
```

### External sourcemaps

If you don't want to have your files polluted with sourcemaps,
just set `inline: false`. Using that, you'll get `.map` files
generated beside your sources.

```js
metalsmith.use(postcss([...], {
  map: {
    inline: false
  }
}));
```

## Test

To run the tests use:

```sh
npm test
```
