module.exports = function (grunt) {
	"use strict";

	grunt.config("clean", {
		bower : [
			"<%= vendors %>"
		],
		rjs : [
			"<%= src %>/config.js"
		],
		dev : [
            "<%= tmp %>",
			"<%= test %>",
			"<%= flash %>/<%= pkg.name %>.swf",
			"<%= java %>/<%= pkg.name %>.jar",
			"<%= java %>/<%= pkg.name %>.jar.pack.gz",
			"<%= java %>/<%= pkg.name %>.class",
			"<%= coverage %>"
		],
		prod : [
			"<%= dist %>",
			"<%= docs %>"
		]
	});

	grunt.loadNpmTasks("grunt-contrib-clean");
};
