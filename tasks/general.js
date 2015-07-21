var gulp = require("gulp");
var eslint = require("gulp-eslint");
var del = require("del");
var gulpsync = require("gulp-sync")(gulp);
var ghpages = require("gh-pages");
var tasksConfig = require("../tasks-config");

gulp.task("watch", ["lint-gulp", "server", "listen", "default", "watch_js", "watch_styles", "watch_index"]);

gulp.task("clean", function(cb) {
	del([
			"dist"
		], {
			force: true
		},
		cb);
});

gulp.task("lint-gulp", function(cb) {
	return gulp.src(["./Gulpfile.js", "./tasks/**/*.js"])
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

gulp.task("default", gulpsync.sync(["lint-gulp", "clean", "index-html", "js", "styles"]));

gulp.task("gh-pages", function(cb){
	ghpages.publish(tasksConfig.distAbsolutePath, cb);
});
