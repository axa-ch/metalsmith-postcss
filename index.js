var postcss = require('postcss');
var minimatch = require('minimatch');

module.exports = main;

function main(plugins, options) {
  var plugins = plugins || [];
  var options = options || {};
  var map = normalizeMapOptions(options.map);

  var processor = postcss(plugins);

  return function (files, metalsmith, done) {
    var styles = Object.keys(files).filter(minimatch.filter("*.css", { matchBase: true }));

    styles.forEach(function (file) {
      var contents = files[file].contents.toString();

      processor
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
    });
    done();
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
