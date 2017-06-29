module.exports = function (grunt) {
	"use strict";

	grunt.config("includeSource", {
		options : {
			templates : {
				html: {
					js: "<script type=\"text/javascript\" " + 
						"src=\"{filePath}\"></script>",
					css: "<link rel=\"stylesheet\" type=\"text/css\" " + 
						 "media=\"all\" href=\"{filePath}\" />",
					tmpl: "<script type=\"text/template\" " + 
						  "src=\"{filePath}\"></script>",
					testjs: "<script type=\"text/javascript\" " + 
						"src=\"{filePath}\"></script>",
					test: "<script type=\"text/javascript\" " + 
						"src=\"{filePath}\"></script>"
				}
			},
			ordering : "top-down"
		},
		dev : {
			options : {
				basePath: "<%= test %>",
				baseUrl : ""
			},
			files : {
				"<%= test %>/index.html" : "<%= templates %>/index.html",
				"<%= test %>/CookieStorage.html" : 
                    "<%= templates %>/CookieStorage.html",
				"<%= test %>/GlobalStorage.html" : 
                    "<%= templates %>/GlobalStorage.html",
				"<%= test %>/UserDataStorage.html" : 
                    "<%= templates %>/UserDataStorage.html",
				"<%= test %>/FlashStorage.html" : 
                    "<%= templates %>/FlashStorage.html",
				"<%= test %>/LocalStorage.html" : 
                    "<%= templates %>/LocalStorage.html",
				"<%= test %>/SessionStorage.html" : 
                    "<%= templates %>/SessionStorage.html"
			}
		}
	});

	grunt.loadNpmTasks("grunt-include-source");
};
