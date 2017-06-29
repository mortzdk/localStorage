module.exports = function (grunt) {
	"use strict";

	grunt.config("requirejs", {
		all : {
			options : {
				name: "main",
				baseUrl: "<%= src %>",
				mainConfigFile: "<%= src %>/config.js",
				paths : {
					modules: "modules",
				},
				optimize: "none",
				optimizeCss: "none",
				useStrict: true,
				skipModuleInsertion: true,
				findNestedDependencies: true,
				out : "<%= js %>/<%= pkg.name %>.js",
				onModuleBundleComplete: function(data) {
					var fs         = require("fs"),
					    amdclean   = require("amdclean"),
					    outputFile = data.path,
					    intro      = fs.readFileSync("src/intro.js", "utf8"),
					    outro      = fs.readFileSync("src/outro.js", "utf8");


					fs.writeFileSync(
					   outputFile, 
					   amdclean.clean({
					   	filePath: outputFile,
					   	escodegen: {
					   		comment: true,
					   		format: {
					   			indent: {
					   				style: "    ",
					   				adjustMultilineComment: true,
					   				base : 1
					   			},
					   			newline: "\n",
					   			space: " ",
					   			quotes: "double"
					   		}
					   	},
					   	prefixMode : "camelCase",
					   	createAnonymousAMDModule: true,
					   	wrap : {
					   		start : intro,
					   		end : outro
					   	}
					   })
					);
				}
			}
		}
	});

	grunt.loadNpmTasks("grunt-contrib-requirejs");
};
