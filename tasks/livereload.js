var gulp = require("gulp");
var livereload = require("gulp-livereload");

gulp.task("listen", function() {
	return livereload.listen();
});

gulp.task("reload", function() {
	return livereload.reload();
});
