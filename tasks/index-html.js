var gulp = require("gulp");
var embedLivereload = require("gulp-embedlr");
var gulpsync = require("gulp-sync")(gulp);
var isProduction = require("../tasks-config").isProduction;

gulp.task("copy-index-html", function(cb) {
	return gulp.src("./index.html")
		.pipe(gulp.dest("./dist"));
});

gulp.task("add-livereload-script", ["copy-index-html"], function(cb) {
	return gulp.src("./dist/index.html")
		.pipe(embedLivereload())
		.pipe(gulp.dest("./dist/"));
});

gulp.task("index-html", isProduction ? ["copy-index-html"] : ["add-livereload-script"]);

gulp.task("watch_index", function(cb) {
	gulp.watch("./index.html", gulpsync.sync(["index-html", "reload"]));
});
