var gulp = require("gulp");
var sourcemaps = require("gulp-sourcemaps");
var prefix = require("gulp-autoprefixer");
var sass = require("gulp-sass");
var gulpsync = require("gulp-sync")(gulp);
var cssmin = require("gulp-cssmin");
var isProduction = require("../tasks-config").isProduction;

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
