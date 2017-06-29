module.exports = function (grunt) {
	"use strict";

	grunt.config("qunit", {
		all: {
			options: {
				urls: [
					"http://localhost:8000/index.html"
				]
			}
		}
	});

	grunt.loadNpmTasks("grunt-contrib-qunit");
};
