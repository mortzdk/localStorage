module.exports = function (grunt) {
	"use strict";

	grunt.config("bower", {
		install: {
			options : {
				layout: "byType",
				copy: false,
				bowerOptions : {
					forceLatest: true, // Force latest version on conflict
					production: false 
				},
				install: true,
				verbose: true
			}
		}
	});

	grunt.loadNpmTasks("grunt-bower-task");
};
