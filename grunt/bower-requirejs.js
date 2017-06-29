module.exports = function (grunt) {
	"use strict";

	grunt.config("bowerRequirejs", {
		all : {
			rjsConfig: "<%= src %>/config.js",
			options: {
				excludeDev : false,
				transitive : true
			}
		}
	});

	grunt.loadNpmTasks("grunt-bower-requirejs");
};
