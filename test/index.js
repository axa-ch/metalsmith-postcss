const path = require("path");
const assert = require("assert");
const { describe, it } = require('mocha')
const fixture = path.resolve.bind(path, __dirname, "fixtures");
const equal = require("assert-dir-equal");
const Metalsmith = require("metalsmith");
const { name } = require("../package.json");
const postcss = require("..");

describe("@metalsmith/postcss", function () {
  it("should export a named plugin function matching package.json name", function () {
    const namechars = name.split("/")[1];
    const camelCased = namechars.split("").reduce((str, char, i) => {
      str +=
        namechars[i - 1] === "-"
          ? char.toUpperCase()
          : char === "-"
          ? ""
          : char;
      return str;
    }, "");
    assert.strictEqual(postcss().name, camelCased);
  });

  it("should not crash the metalsmith build when using default options", function (done) {
    Metalsmith(fixture("no-sourcemaps"))
      .use(postcss())
      .build((err) => {
        assert.strictEqual(err, null);
        equal(
          fixture("no-sourcemaps/build"),
          fixture("no-sourcemaps/expected")
        );
        done();
      });
  });

  describe("sourcemaps", function () {
    it("should not add sourcemaps at all", function (done) {
      const metalsmith = Metalsmith(fixture("no-sourcemaps"));
      metalsmith
        .use(
          postcss({
            plugins: {},
          })
        )
        .build(function (err) {
          if (err) return done(err);
          equal(
            fixture("no-sourcemaps/build"),
            fixture("no-sourcemaps/expected")
          );
          done();
        });
    });

    it("should add inline sourcemaps", function (done) {
      const metalsmith = Metalsmith(fixture("inline-sourcemaps"));
      metalsmith
        .use(
          postcss({
            plugins: {},
            map: true,
          })
        )
        .build(function (err) {
          if (err) return done(err);
          equal(
            fixture("inline-sourcemaps/build"),
            fixture("inline-sourcemaps/expected")
          );
          done();
        });
    });

    it("should add external sourcemap files", function (done) {
      const metalsmith = Metalsmith(fixture("external-sourcemaps"));
      metalsmith
        .use(
          postcss({
            plugins: {},
            map: {
              inline: false,
            },
          })
        )
        .build(function (err) {
          if (err) return done(err);
          equal(
            fixture("external-sourcemaps/build"),
            fixture("external-sourcemaps/expected")
          );
          done();
        });
    });

    it("should pass absolute paths to postcss", function (done) {
      const metalsmith = Metalsmith(fixture("use-absolute-paths"));
      metalsmith
        .use(
          postcss({
            plugins: {
              "postcss-import": {},
            },
            map: {
              inline: false,
            },
          })
        )
        .build(function (err) {
          if (err) return done(err);
          equal(
            fixture("use-absolute-paths/build"),
            fixture("use-absolute-paths/expected")
          );
          done();
        });
    });

    it("should be able to use arrays as a way to define plugins", function (done) {
      const metalsmith = Metalsmith(fixture("use-absolute-paths"));
      metalsmith
        .use(
          postcss({
            plugins: [
              {
                "postcss-import": {},
              },
            ],
            map: {
              inline: false,
            },
          })
        )
        .build(function (err) {
          if (err) return done(err);
          equal(
            fixture("use-absolute-paths/build"),
            fixture("use-absolute-paths/expected")
          );
          done();
        });
    });
  });
});
