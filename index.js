const postcssLib = require('postcss');
const minimatch = require('minimatch');
const path = require('path');

function normalizeMapOptions(map) {
  if (!map) return undefined;

  return {
    inline: map === true ? true : map.inline,
    prev: false, // Not implemented yet
    sourcesContent: undefined,  // Not implemented yet
    annotation: undefined // Not implemented yet
  };
}

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
    const styles = Object.keys(files).filter(minimatch.filter(options.pattern || '*.css', { matchBase: true }));

    if(styles.length == 0) {
      done();
      return;
    }

    const promises = [];

    styles.forEach(function (file) {
      const contents = files[file].contents.toString();
      const absolutePath = path.resolve(metalsmith.source(), file);

      const promise = processor
        .process(contents, {
          from: absolutePath,
          to: absolutePath,
          map: map
        })
        .then(function (result) {
          files[file].contents = Buffer.from(result.css);

          if (result.map) {
            files[file + '.map'] = {
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

module.exports = initP;