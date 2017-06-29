module.exports = function (grunt) {
	"use strict";

	grunt.config("uglify", {
		options : {
			quoteStyle : 2,
		},
		dev : {
			options : {
                output : {
                    "width"        : 80,
                    "indent_level" : 4,
                    "quote_style"  : 2,
                    "comments"     : /^!|@preserve|@license|@cc_on|jshint/i
                },
                report    : "gzip",
				sourceMap : false,
				compress  : false,
				mangle    : false,
				beautify  : true
			},
			files: {
				"<%= js %>/<%= pkg.name %>.js" : [
					"<%= js %>/<%= pkg.name %>.js"
				]
			}
		},
		prod : {
			options: {
                output : {
                    "width"        : 80,
                    "indent_level" : 4,
                    "quote_style"  : 2,
                    "comments"     : /^!|@preserve|@license|@cc_on/i
                },
				mangle : {
                    properties : false
				},
				reserveDOMProperties : true,
				exceptionsFiles      : [".mangle.json"],
				report               : "gzip",
				sourceMap            : true,
				compress             : {
					"dead_code"     : true,
                    "properties"    : true,
                    "drop_debugger" : true,
                    "conditionals"  : true,
                    "comparisons"   : true,
                    "evaluate"      : true,
                    "booleans"      : true,
                    "loops"         : true,
                    "unused"        : true,
                    "toplevel"      : true,
                    "if_return"     : true,
                    "join_vars"     : true,
                    "cascade"       : true,
                    "collapse_vars" : true,
                    "reduce_vars"   : true,
                    "warnings"      : true,
                    "negate_iife"   : true,
                    "drop_console"  : true,
                    "passes"        : 3,
                    "keep_infinity" : true,
                    "unsafe"        : true
				}
			},
			files: {
				"<%= dist %>/<%= pkg.name %>.min.js" : [
					"<%= js %>/<%= pkg.name %>.js"
				]
			}
		}
	});

	grunt.loadNpmTasks("grunt-contrib-uglify");
};
