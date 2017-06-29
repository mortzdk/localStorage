module.exports = function (grunt) {
	"use strict";

	grunt.config("shell", {
		flash : {
			options : {
				execOptions : {
					cwd : "<%= flash %>"
				}
			},
			command : "as3compile <%= pkg.name %>.as -MlocalStorage -T9"
		},
        javac : {
			options : {
				execOptions : {
					cwd : "<%= java %>"
				}
			},
            command : "javac -encoding UTF-8 " + 
                      "-cp /usr/share/icedtea-web/netx.jar:" + 
                      "/usr/share/icedtea-web/plugin.jar -g " +
                      "*.java"
        },
        jar : {
			options : {
				execOptions : {
					cwd : "<%= java %>"
				}
			},
			command : "jar -cfemv localStorage.jar " + 
                      "LocalStorageApplet " + 
                      "META-INF/MANIFEST.MF " + 
                      "*.class"
        },
        jarsigner : {
			options : {
				execOptions : {
					cwd : "<%= java %>"
				}
			},
			command : "jarsigner -keystore .keystore/keystore.jks " + 
                      "-tsa http://timestamp.digicert.com " +
                      "localStorage.jar localStorage"
        },
        pack200 : {
			options : {
				execOptions : {
					cwd : "<%= java %>"
				}
			},
			command : "pack200 localStorage.jar.pack.gz localStorage.jar"
        },
        symlink : {
			options : {
				execOptions : {
					cwd : "<%= test %>"
				}
			},
			command : "ln -s " + __dirname + "/../test/ ."
        }
	});

	grunt.loadNpmTasks("grunt-shell");
};
