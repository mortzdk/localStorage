module.exports = function (grunt) {
	"use strict";

	grunt.config("qunit", {
        options: {
            "--web-security": "no",
            "--ignore-ssl-errors": "true",
            coverage : {
                disposeCollector  : true,
                linesThresholdPct : 80,
                instrumentedFiles : "<%= tmp %>",
                lcovReport        : "<%= coverage %>",
                src               : ["<%= js %>/*.js"],
                baseUrl           : "test/"
            }
        },
        all : {
            options : {
                urls : ["<%= test %>/index.html"]
            }
        }
	});

	grunt.loadNpmTasks("grunt-qunit-istanbul");
};
