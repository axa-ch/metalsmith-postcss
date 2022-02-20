# @metalsmith/postcss

A [Metalsmith](http://metalsmith.io) plugin that sends your CSS through any [PostCSS](https://github.com/postcss/postcss) plugins.

[![metalsmith: plugin][metalsmith-badge]][metalsmith-url]
[![npm: version][npm-badge]][npm-url]
[![ci: build][ci-badge]][ci-url]
[![code coverage][codecov-badge]][codecov-url]
[![license: MIT][license-badge]][license-url]

## Installation

NPM:

```sh
npm install @metalsmith/postcss
```

Yarn:

```sh
yarn add @metalsmith/postcss
```

_Note_: you need to install `postcss` and postcss plugins separately

## Usage

Add the postcss package name, optionally with its options, to your `.use()` directives.
Here is an example using `postcss-pseudoelements` and `postcss-nested` to transform your source files:

```js
const postcss = require('@metalsmith/postcss');

// defaults with 2 plugins:
metalsmith.use(postcss({ plugins: {
  'postcss-pseudoelements': {}
  'postcss-nested': {}
}}))

// explicit defaults with 2 plugins:
metalsmith.use(postcss({
  pattern: '**/*.css',
  plugins: {
    'postcss-pseudoelements': {}
    'postcss-nested': {}
  },
  map: false
}));
```

### Options

- **pattern** `{string|string[]}` _(optional)_ - Pattern of CSS files to match relative to `Metalsmith.source()`. Defaults to `**/*.css`
- **plugins** `{Object|Array<Object|string>}` _(optional)_ - An object with PostCSS plugin names as keys and their options as values, or an array of PostCSS plugins as names, eg `'postcss-plugin'`or objects in the format `{ 'postcss-plugin': {...options}}`
- **map** {boolean|{inline:boolean}}`*(optional)* - Pass`true`for inline sourcemaps, or`{ inline: false }` for external source maps

By default, files with `.css` extension will be parsed. This may be overridden
by providing a custom pattern e.g.

```js
metalsmith.use(postcss({
  pattern: '*.postcss',
  plugins: { ... }
}));
```

## Alternative plugin definition syntax

Sometimes plugins need to be defined in a certain order and JavaScript Objects cannot guarantee the order of keys in an object. You can also specify PostCSS plugins using an array of objects:

```js
metalsmith.use(
  postcss({
    pattern: "*.postcss",
    plugins: [
      "postcss-pseudoelements",
      { "postcss-nested": { some: "config" } },
    ],
  })
);
```

## Sourcemaps

This plugin supports generating source maps. To do so, pass `map: true` for inline source maps (written into the CSS file), or `map: { inline: false }` for external source maps (written as `file.css.map`):

```js
metalsmith.use(
  postcss({
    plugins: {},
    map: true, // same as { inline: false }
  })
);
```

Example config for external source maps

```js
metalsmith.use(
  postcss({
    plugins: {},
    map: {
      inline: false,
    },
  })
);
```

Source maps generation is compatible with [`@metalsmith/sass`](https://github.com/metalsmith/sass) and will find correct file paths from .scss source all the way through the last PostCSS transforms:

```js
metalsmith
  .use(sass({
    entries: {
      'src/index.scss': 'index.css'
    }
  })
  .use(postcss({
    map: true,
  }))
```

## CLI usage

To use this plugin with the Metalsmith CLI, add `@metalsmith/postcss` to the `plugins` key in your `metalsmith.json` file:
Here is an example using `postcss-pseudoelements` and `postcss-nested` to transform your source files.

```json
{
  "plugins": [
    {
      "@metalsmith/postcss": {
        "plugins": {
          "postcss-pseudoelements": {},
          "postcss-nested": {}
        },
        "map": true
      }
    }
  ]
}
```

## Credits

Thanks to [AXA Switzerland](https://github.com/axa-ch) for developing the [initial versions of this plugin](https://github.com/axa-ch/@metalsmith/postcss) on which this plugin is based.

## License

[MIT][license-url]

## Test

To run the tests use:

```sh
npm test
```

To view end-to-end tests in browser, use:

```sh
npm run test:e2e
```

[npm-badge]: https://img.shields.io/npm/v/@metalsmith/postcss.svg
[npm-url]: https://www.npmjs.com/package/@metalsmith/postcss
[ci-url]: https://github.com/metalsmith/postcss/actions/workflows/test.yml
[ci-badge]: https://github.com/metalsmith/postcss/actions/workflows/test.yml/badge.svg
[metalsmith-badge]: https://img.shields.io/badge/metalsmith-core_plugin-green.svg?longCache=true
[metalsmith-url]: https://metalsmith.io
[codecov-badge]: https://img.shields.io/coveralls/github/metalsmith/postcss
[codecov-url]: https://coveralls.io/github/metalsmith/postcss
[license-badge]: https://img.shields.io/github/license/metalsmith/postcss
[license-url]: LICENSE
