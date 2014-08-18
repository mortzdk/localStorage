module.exports = function (grunt) {
	"use strict";
	grunt.initConfig({
		pkg: grunt.file.readJSON("package.json"),
		concat: {
			options: {
				separator : ";"
			},
			dist: {
				src: ["src/*.js"],
				dest: "dist/<%= pkg.name %>.js"
			}
		},
		uglify: {
			options: {
				banner : "/* <%= pkg.name %> - Version <%= pkg.version %> - <%= grunt.template.today('dd-mm-yyyy') %> */\n"
			},
			dist: {
				files: {
					"dist/<%= pkg.name %>.min.js": ["<%= concat.dist.dest %>"]
				}
			}
		},
		jshint: {
			files: ["Gruntfile.js", "src/*.js", "test/js/tests/**/*.js"],
			options: {
				camelcase: true,
				curly: true,
				eqeqeq: true,
				es3: true,
				forin: true,
				freeze: true,
				immed: true,
				indent: 4,
				latedef: true,
				newcap: true,
				noarg: true,
				noempty: true,
				nonbsp: true,
				nonew: true,
				plusplus: true,
				quotmark: "double",
				undef: true,
				unused: true,
				strict: true,
				trailing: true,
				browser: true,
				devel: true,
				globals: {
					jQuery: true,
					module: true,
					QUnit: true,
					ActiveXObject: true,
					GarbageCollect: true
				}
			}
		},
		watch: {
			files: [
				"<%= jshint.files %>", 
				"src/*.as",
				"test/*.html"
			],
			tasks: [
				"clean",
				"jshint", 
				"shell",
				"copy", 
				"blanket_qunit"
			]
		},
		clean: {
			test: {
				src: [
					"test/js/*.js",
					"test/js/*.swf"
				]
			},
			dist: {
				src: ["dist"]
			}
		},
		copy : {
			test : {
				files: [{
					expand: true,
					cwd: "src",
					src: ["*.js", "*.swf"],
					dest: "test/js/"
				},
				{
					expand: true,
					cwd: "src",
					src: ["*.swf"],
					dest: "dist/"
				}]
			}
		},
		shell : {
			flash : {
				command : "mxmlc <%= pkg.name %>.as",
				options : {
					stderr : false,
					execOptions : {
						cwd : "src"
					}
				}
			}
		}
		/* jshint ignore:start */
		,blanket_qunit : {
			all : {
				options : {
					urls : ["test/index.html?coverage=true&gruntReport"],
					threshold : 26 
				}
			}
		}
		/* jshint ignore:end */
	});
	
	grunt.loadNpmTasks("grunt-shell");
	grunt.loadNpmTasks("grunt-contrib-copy");
	grunt.loadNpmTasks("grunt-contrib-clean");
	grunt.loadNpmTasks("grunt-contrib-uglify");
	grunt.loadNpmTasks("grunt-contrib-jshint");
	grunt.loadNpmTasks("grunt-blanket-qunit");
	grunt.loadNpmTasks("grunt-contrib-watch");
	grunt.loadNpmTasks("grunt-contrib-concat");

	grunt.registerTask(
		"clear", 
		["clean"]
	);
	grunt.registerTask(
		"test", 
		[
			"clean",
			"jshint", 
			"shell",
			"copy", 
			"blanket_qunit"
		]
	);
	grunt.registerTask(
		"dist", 
		[
			"clean", 
			"jshint", 
			"shell",
			"copy", 
			"blanket_qunit", 
			"concat", 
			"uglify"
		]
	);
	grunt.registerTask(
		"default",
		[
			"watch"
		]
	);
};
