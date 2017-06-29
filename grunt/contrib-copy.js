module.exports = function (grunt) {
	"use strict";

	grunt.config("copy", {
		dev : {
			files : [
				{
					expand : true,
					cwd    : "<%= tests %>",
					src    : ["**"],
					dest   : "<%= unit %>"
				},
				{
					expand : true,
					cwd    : "<%= flash %>", 
					src    : ["**"], 
					dest   : "<%= test %>/flash"
				},
				{
					expand : true,
					cwd    : "<%= java %>", 
					src    : ["*.jar", "*.jar.pack.gz"], 
					dest   : "<%= test %>/java"
				}
			]
		},
		prod : {
			files : [
				{
					expand : true,
					cwd    : "<%= js %>", 
					src    : ["**"], 
					dest   : "<%= dist %>"
				},
				{
					expand : true,
					cwd    : "<%= test %>/flash", 
					src    : ["**"], 
					dest   : "<%= dist %>"
				},
				{
					expand : true,
					cwd    : "<%= test %>/java", 
					src    : ["**"], 
					dest   : "<%= dist %>"
				},
			]
		}
	});

	grunt.loadNpmTasks("grunt-contrib-copy");
};
