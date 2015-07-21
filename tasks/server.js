var gulp = require("gulp");
var exec = require("child_process").exec;
var isProduction = require("../tasks-config").isProduction;

gulp.task("server", function(cb) {
	return exec("node server.js", function(err, stdout, stderr) {
		console.log(stdout);
		console.log(stderr);
		cb(err);
	}).stdout.on("data", function(data) {
		console.log(data);
	});
});
