var gulp = require("gulp");
var babelify = require("babelify");
var rename = require("gulp-rename");
var buffer = require("vinyl-buffer");
var eslint = require("gulp-eslint");
var exec = require("child_process").exec;
var browserify = require("browserify");
var uglify = require("gulp-uglify");
var sourcemaps = require("gulp-sourcemaps");
var gutil = require("gulp-util");
var source = require("vinyl-source-stream");
var del = require("del");
var prefix = require("gulp-autoprefixer");
var sass = require("gulp-sass");
var livereload = require("gulp-livereload");
var embedLivereload = require("gulp-embedlr");
var gulpsync = require("gulp-sync")(gulp);
var cssmin = require("gulp-cssmin");
var mocha = require("gulp-mocha");

var isProduction = process.env.NODE_ENV === "production";

/** JS tasks**/
{
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


}

/* End of JS tasks*/
{
	gulp.task("styles", function(cb) {
		var css = gulp.src("./styles/app.scss");

		if (!isProduction) {
			css = css.pipe(sourcemaps.init());
		}

		css = css.pipe(sass().on("error", sass.logError))
			.pipe(prefix("last 1 version", "> 1%", "ie 8", "ie 7"));

		if (isProduction) {
			css = css.pipe(cssmin());
		}

		if (!isProduction) {
			css = css.pipe(sourcemaps.write("./"));
		}

		css = css.pipe(gulp.dest("./dist/assets"));

		return css;
	});

	gulp.task("watch_styles", function(cb) {
		gulp.watch("styles/**/*.scss", gulpsync.sync(["styles", "reload"]));
	});
}
/* End of Styles tasks*/

/* index.html tasks */
{
	gulp.task("copy-index-html", function(cb) {
		return gulp.src("./index.html")
			.pipe(gulp.dest("./dist"));
	});

	gulp.task("add-livereload-script", ["copy-index-html"], function(cb) {
		return gulp.src("./dist/index.html")
			.pipe(embedLivereload())
			.pipe(gulp.dest("./dist/"));
	});

	gulp.task("index-html", ["add-livereload-script"]);

	gulp.task("watch_index", function(cb) {
		gulp.watch("./index.html", gulpsync.sync(["index-html", "reload"]));
	});
}
/* End of index.html tasks */

/* Test tasks */
{
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
}
/* End of Test tasks */

/* Livereload tasks */
{
	gulp.task("listen", function() {
		return livereload.listen();
	});

	gulp.task("reload", function() {
		return livereload.reload();
	});
}
/* End of Livereload tasks */

/* Server tasks */
{
	gulp.task("server", function(cb) {
		return exec("node server.js", function(err, stdout, stderr) {
			console.log(stdout);
			console.log(stderr);
			cb(err);
		}).stdout.on("data", function(data) {
			console.log(data);
		});
	});

}
/* End of Server tasks */

/* General tasks */
{
	gulp.task("watch", ["lint-gulpfile", "server", "listen", "default", "watch_js", "watch_styles", "watch_index"]);

	gulp.task("clean", function(cb) {
		del([
				"dist"
			], {
				force: true
			},
			cb);
	});

	gulp.task("lint-gulpfile", function(cb) {
		return gulp.src(["./Gulpfile.js"])
			.pipe(eslint({
				"rules": {
					"strict": 0,
					"no-lone-blocks": 0,
					"no-unused-vars": 0,
					"no-process-exit": 0
				},
				"env": {
					"node": true
				}

			}))
			.pipe(eslint.format());
	});

	gulp.task("default", gulpsync.sync(["lint-gulpfile", "clean", "index-html", "js", "styles"]));

}
/* End of General tasks */
