import example from "../../lib/example-module";

var assert = require("assert");

describe("Example module test", function() {
	describe("it works", function() {
		it("returns true", function() {
			assert.ok(example());
		});
	});
});
