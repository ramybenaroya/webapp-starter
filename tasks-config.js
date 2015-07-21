var path = require("path");

module.exports = {
	isProduction: process.env.NODE_ENV === "production",
	distAbsolutePath: path.join(__dirname, '/dist')
};
