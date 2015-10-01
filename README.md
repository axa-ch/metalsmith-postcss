# metalsmith-postcss

> A Metalsmith plugin that sends your CSS
> through any [PostCSS](https://github.com/postcss/postcss) plugins.

## Installation

```sh
npm install metalsmith-postcss
```

## Getting Started

If you haven't checked out [Metalsmith](http://metalsmith.io/) before,
head over to their website and check out the documentation.

## JavaScript API

Using the JavaScript api for Metalsmith,
just require the module and add it to your
`.use()` directives. Here is an example using
`postcss-pseudoelements` and `postcss-nested` to
transform your source files.

```js
var postcss = require('metalsmith-postcss');

var pseudoelements = require('postcss-pseudoelements');
var nested = require('postcss-nested');

metalsmith.use(postcss([
  pseudoelements(),
  nested()
]));
```

## CLI Usage

It's currently *NOT* possible to use this plugin from your
`metalsmith.json` file.
