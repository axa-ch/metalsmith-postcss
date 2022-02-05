const postcssLib = require('postcss');
const minimatch = require('minimatch');
const path = require('path');

function normalizeMapOptions(map) {
  if (!map) return undefined;

  return {
    inline: map === true ? true : map.inline,
    prev: true,
    sourcesContent: true
  };
}

/**
 * @typedef {Object} SourceMapOptions 
 * @property {boolean} [inline]
 */

/**
 * A metalsmith plugin that sends your CSS through any [PostCSS](https://github.com/postcss/postcss) plugins
 * @param {Object} options
 * @param {string|string[]} [options.pattern] Pattern(s) of CSS files to match relative to `Metalsmith.source()`. Default is `**\/*.css`
 * @param {boolean|SourceMapOptions} [options.map] Pass `true` for inline sourcemaps, or `{ inline: false }` for external source maps
 * @param {string|{'postcss-plugin': Object}|Array<{'postcss-plugin': Object}|string>} options.plugins
 * An object with PostCSS plugin names as keys and their options as values, or an array of PostCSS plugins as names, eg `'postcss-plugin'`
 * or objects in the format `{ 'postcss-plugin': {...options}}`
 * @returns {import('metalsmith').Plugin}
 */
function initPostcss(options) {

  options = options || {};
  const pluginsConfig = Array.isArray(options.plugins) ? options.plugins : [options.plugins];
  const plugins = [];

  // Require each plugin, pass its options
  // and add it to the plugins array.
  pluginsConfig.forEach(function (pluginsObject) {
    if (typeof pluginsObject === 'string') {
      plugins.push(require(pluginsObject)({}));
    } else {
      Object.keys(pluginsObject).forEach(function (pluginName) {
        const value = pluginsObject[pluginName];
        if (value === false) return;
        const pluginOptions = value === true ? {} : value;
        plugins.push(require(pluginName)(pluginOptions));
      });
    }
  });

  const map = normalizeMapOptions(options.map);

  const processor = postcssLib(plugins);

  return function postcss(files, metalsmith, done) {
    const styles = Object.keys(files).filter(minimatch.filter(options.pattern || '**/*.css'));

    if(styles.length == 0) {
      done();
      return;
    }

    const promises = [];

    styles.forEach(function (file) {
      const contents = files[file].contents.toString();
      const absolutePath = path.resolve(metalsmith.source(), file);

      // if a previous source map has been generated for this file (eg through sass),
      // pass its contents onto postcss
      const prevMap = files[`${file}.map`];
      if (map && prevMap) {
        map.prev = prevMap.contents.toString();
      }

      const promise = processor
        .process(contents, {
          from: absolutePath,
          to: absolutePath,
          map: map
        })
        .then(function (result) {
          files[file].contents = Buffer.from(result.css);

          if (result.map) {
            files[`${file}.map`] = {
              contents: Buffer.from(JSON.stringify(result.map)),
              mode: files[file].mode,
              stats: files[file].stats
            };
          }
        });

      promises.push(promise);
    });

    Promise.all(promises)
      .then(function() {
        done();
      })
      .catch(function(error) {
        // JSON.stringify on an actual error object yields 0 key/values
        if (error instanceof Error) {
          return done(error);
        }
        done(new Error('Error during postcss processing: ' + JSON.stringify(error)));
      });

  };
}

module.exports = initPostcss;