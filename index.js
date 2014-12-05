var postcss = require('postcss');
var minimatch = require('minimatch');

module.exports = main;

function main(plugins) {
  var plugins = plugins || [];

  var processor = postcss();

  plugins.forEach(function(plugin) {
    processor.use(plugin);
  });

  return function (files, metalsmith, done) {
    var styles = Object.keys(files).filter(minimatch.filter("*.css", { matchBase: true }));
    styles.forEach(function (file, index, arr) {
      files[file].contents = new Buffer(postcss.process(files[file].contents.toString()).css);
    });
    done();
  }
}
