module.exports = function (grunt) {
	"use strict";

	grunt.config("jshint", {
		options: { 
			verbose: true
		},
		dev : {
			options : {
				jshintrc: ".strict.jshintrc",
			},
			src: "<%= scripts %>"
		},
		test : {
			options : {
				jshintrc: ".jshintrc",
			},
			src: ["<%= js %>/<%= pkg.name %>.js"]
		}
	});

	grunt.loadNpmTasks("grunt-contrib-jshint");
};
