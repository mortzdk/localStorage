module.exports = function (grunt) {
	"use strict";

	grunt.config("watch", {
		files: [].concat.apply([
			"<%= scripts %>"
		]), 
		tasks: ["__watch__"],
		options: {
			livereload: true,
			spawn: false,
			dateFormat: function (time) {
				grunt.log.writeln("The watch finished in " + time + 
					"ms at " + (new Date()).toString());
			}
		}
	});

	grunt.loadNpmTasks("grunt-contrib-watch");
};
