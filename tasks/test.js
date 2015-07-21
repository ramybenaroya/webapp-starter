var gulp = require("gulp");
var eslint = require("gulp-eslint");
var mocha = require("gulp-mocha");
var isProduction = require("../tasks-config").isProduction;

gulp.task("lint-test", function(cb) {
	return gulp.src(["test/unit/**/*.js"])
		.pipe(eslint({
			configFile: "./test/.eslintrc"
		}))
		.pipe(eslint.format());
});

gulp.task("test", ["lint-test"], function() {
	return gulp.src("test/test.js")
		.pipe(mocha())
		.once("error", function() {
			process.exit(1);
		})
		.once("end", function() {
			process.exit();
		});
});
