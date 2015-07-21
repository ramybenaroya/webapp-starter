var gulp = require("gulp");
var babelify = require("babelify");
var source = require("vinyl-source-stream");
var rename = require("gulp-rename");
var buffer = require("vinyl-buffer");
var eslint = require("gulp-eslint");
var browserify = require("browserify");
var uglify = require("gulp-uglify");
var sourcemaps = require("gulp-sourcemaps");
var gulpsync = require("gulp-sync")(gulp);
var isProduction = require("../tasks-config").isProduction;

gulp.task("browserify", ["lint"], function(cb) {
	var b = browserify({
		entries: "./lib/main.js",
		debug: true,
		transform: [babelify.configure({
			stage: 0
		})]
	});

	var bundle = b.bundle()
		.pipe(source("app.js"))
		.pipe(buffer());

	if (!isProduction) {
		bundle = bundle.pipe(sourcemaps.init({
			loadMaps: true
		}));
	}

	if (isProduction) {
		bundle = bundle
			.pipe(uglify());
	}

	if (!isProduction) {
		bundle = bundle.pipe(sourcemaps.write("./"));
	}

	bundle = bundle.pipe(gulp.dest("./dist/assets"));

	return bundle;
});

gulp.task("lint", function(cb) {
	return gulp.src(["lib/**/*.js"])
		.pipe(eslint())
		.pipe(eslint.format());
});

gulp.task("js", ["browserify"]);

gulp.task("watch_js", function(cb) {
	gulp.watch("lib/**/*.js", gulpsync.sync(["js", "reload"]));
});
