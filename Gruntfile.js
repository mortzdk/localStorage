module.exports = function (grunt) {
	"use strict";
    
    // TODO grunt coverage:

	var tasks = {
			"init" : ["connect"],
			"dev"  : [
				// Bower
				"bower:install",

				// JS
				"jshint:dev",
				"bowerRequirejs",
				"requirejs",
				"uglify:dev",
				"jshint:test",
				"shell:flash",
                "shell:javac",
                "shell:jar",
//                "shell:jarsigner",
                "shell:pack200",
				"copy:dev",
				"includeSource:dev",
				"wiredep:dev",
                "shell:symlink",
				"qunit"
			],
			"prod" : [
				// Copy
				"copy:prod",

				// Prod
				"uglify:prod"

			],
			"clean" : [
				"clean:bower", 
				"clean:rjs", 
				"clean:dev", 
				"clean:prod"
			]
		},
		prod = function () {
			grunt.task.run(
				tasks.clean
					.concat(tasks.init)
					.concat(tasks.dev)
					.concat(["clean:rjs", "clean:prod"])
					.concat(tasks.prod)
			);
		},
		dev = function () { 
			grunt.task.run(
				["clean:dev"]
					.concat(tasks.init)
					.concat(tasks.dev)
			);
		},
		clear = function () {
			grunt.task.run(
				tasks.clean
			);
		},
		watch = function () { 
			grunt.task.run(
				["clean:dev"]
					.concat(tasks.dev)
			);
		};

	grunt.initConfig({
		pkg           : grunt.file.readJSON("package.json"),

		// State
		production    : false,

		// Directories
		dist          : "dist",
		test          : "test",
		src           : "src",
		tasks         : "grunt",
		coverage      : "coverage",
		docs          : "docs",
		modules       : "node_modules",
		templates     : "<%= src %>/templates",
		tests         : "<%= src %>/tests", 
		flash         : "<%= src %>/flash",
		java          : "<%= src %>/java",
		js            : "<%= test %>/js",
		css           : "<%= test %>/css",
		unit          : "<%= test %>/unit", 
		vendors       : "<%= test %>/vendors",
		tmp           : "<%= test %>/tmp",

		// Files
		scripts       : [
			"Gruntfile.js",
			"<%= src %>/**/*.js",
			"<%= tasks %>/**/*.js",
			"<%= tests %>/**/*.js",
			"!<%= src %>/intro.js", 
			"!<%= src %>/outro.js", 
		],
		swfs          : [
			"<%= flash %>/**/*.swf",
			"<%= flash %>/**/*.fla"
		]
	});

	grunt.loadTasks(grunt.config.data.tasks);

	grunt.registerTask("__watch__", watch);

	// "grunt clear" or "grunt clean" clears all temporary and production files
	grunt.registerTask("clear", clear);

	// "grunt dev", "grunt test" or "grunt development" runs development task
	grunt.registerTask("development", dev);
	grunt.registerTask("dev", dev);
	grunt.registerTask("test", dev);

	// "grunt prod", "grunt production", "grunt dist" runs production task
	grunt.registerTask("production", prod);
	grunt.registerTask("prod", prod);
	grunt.registerTask("dist", prod);

	// "grunt" or "grunt watch" runs watch
	grunt.registerTask("default", ["clear", "connect", "watch"]);
};
