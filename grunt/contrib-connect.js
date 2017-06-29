module.exports = function (grunt) {
	"use strict";

	grunt.config("connect", {
		server: {
			options: {
				port: 8000,
				base: "<%= test %>",
				livereload:true
			}
		}
	});

	grunt.loadNpmTasks("grunt-contrib-connect");
};
