module.exports = function (grunt) {
	"use strict";

	grunt.config("wiredep", {
		dev : {
			options : {
			dependencies : true,
				devDependencies : true,
				overrides : {
					"blanket" : {
						"main" : [
							"dist/qunit/blanket.js", 
							"dist/qunit/grunt-reporter.js"
						]
					},
					"firebug-lite" : {
						"main" : [
							"build/firebug-lite.js"
						]
					}
				},
				fileTypes : {
					html: {
						block:
	/((\[*)<!--\s*bower:*(\S*)\s*-->)(\n|\r|.)*?(<!--\s*endbower\s*-->)/gi,
						detect: {
							js: /<script.*src=['"]([^'"]+)/gi,
							css: /<link.*href=['"]([^'"]+)/gi
						},
						replace: {
							js: function (filePath) {
								var b = filePath.indexOf("blanket.js"),
									f = filePath.indexOf("firebug-lite.js");

								if ( b !== -1) {
									return "\t\t<script " + 
										"type=\"text/javascript\" " + 
										"src=\"" + filePath + "\" " + 
										"data-cover-flags=\"debug\">" +
										"</script>";
								} else if ( f !== -1) {
									return "\t\t<!--[if lt IE 8]>\n" + 
										"\t\t\t<script " +
										"type=\"text/javascript\" " + 
										"src=\"" + filePath +"\">" + 
										"</script>\n\t\t<![endif]-->";
								} else {
									return "\t\t<script " +
										"type=\"text/javascript\" " + 
										"src=\"" + filePath +"\">" + 
										"</script>";
								}
							},
							css: "\t\t<link rel=\"stylesheet\" " + 
								"type=\"text/css\" " + 
								"media=\"all\" " + 
								"href=\"{{filePath}}\" />"
						}
					}
				}
			},
			src : [
				"<%= test %>/index.html"
			]
		}
	});

	grunt.loadNpmTasks("grunt-wiredep");
};
