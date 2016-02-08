var postcss = require('postcss');
var minimatch = require('minimatch');
var Promise = require('promise');

module.exports = main;

function main(options) {

  var options = options || {};
  var pluginsConfig = options.plugins;
  if (!Object.keys(pluginsConfig).length) {
    return;
  }

  var plugins = [];

  // Require each plugin, pass it it’s options
  // and add it to the plugins array.
  Object.keys(pluginsConfig).forEach(function(pluginName) {
    var value = pluginsConfig[pluginName];
    if (value === false) return;
    var pluginOptions = value === true ? {} : value;
    var plugin = require(pluginName);
    plugins.push(plugin(pluginOptions));
  });

  var map = normalizeMapOptions(options.map);

  var processor = postcss(plugins);

  return function (files, metalsmith, done) {
    var styles = Object.keys(files).filter(minimatch.filter("*.css", { matchBase: true }));

    if(styles.length == 0) {
      done();
      return;
    }

    var promises = [];

    styles.forEach(function (file) {
      var contents = files[file].contents.toString();

      var promise = processor
        .process(contents, {
          from: file,
          to: file,
          map: map
        })
        .then(function (result) {
          files[file].contents = new Buffer(result.css);

           if (result.map) {
             files[file + '.map'] = {
               contents: new Buffer(JSON.stringify(result.map)),
               mode: files[file].mode,
               stats: files[file].stats
             };
           }
        });

        promises.push(promise);
    });

    Promise.all(promises)
      .then(function(results) {
        done();
      })
      .catch(function(error) {
        done(new Error("Error during postcss processing: " + JSON.stringify(error)));
      });

  }
}

function normalizeMapOptions(map) {
  if (!map) return undefined;

  return {
    inline: map === true ? true : map.inline,
    prev: false, // Not implemented yet
    sourcesContent: undefined,  // Not implemented yet
    annotation: undefined // Not implemented yet
  };
}
