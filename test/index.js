var path = require('path');
var fixture = path.resolve.bind(path, __dirname, 'fixtures');
var assert = require('assert');
var equal = require('assert-dir-equal');
var Metalsmith = require('metalsmith');
var postcss = require('..');

describe('metalsmith-postcss', function () {

  describe('sourcemaps', function () {

    it('should not add sourcemaps at all', function (done) {
      var metalsmith = Metalsmith(fixture('no-sourcemaps'));
      metalsmith
        .use(postcss([], {
        }))
        .build(function (err) {
          if (err) return done(err);
          equal(fixture('no-sourcemaps/build'), fixture('no-sourcemaps/expected'));
          done();
        });
    });

    it('should add inline sourcemaps', function (done) {
      var metalsmith = Metalsmith(fixture('inline-sourcemaps'));
      metalsmith
        .use(postcss([], {
          map: true
        }))
        .build(function (err) {
          if (err) return done(err);
          equal(fixture('inline-sourcemaps/build'), fixture('inline-sourcemaps/expected'));
          done();
        });
    });

    it('should add external sourcemap files', function (done) {
      var metalsmith = Metalsmith(fixture('external-sourcemaps'));
      metalsmith
        .use(postcss([], {
          map: {
            inline: false
          }
        }))
        .build(function (err) {
          if (err) return done(err);
          equal(fixture('external-sourcemaps/build'), fixture('external-sourcemaps/expected'));
          done();
        });
    });

    it('should rename sourcemap files');

    it('should find and use previous sourcemaps');
  });
});
