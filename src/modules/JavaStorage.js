/* globals javaURL:false, isFunction:false, DU:false, STORAGE:false, JAVA:false,
           OUTOFMEMORY:false, isUndefined:false, restricted:false, each:false, 
           indexOf:false, toWindow:false, AVAILABLE:false, READY:false, 
           attribute:false, isIE:false, onunload:false, forEach:false, 
           COMMENT:false, EMBED:false, LOCAL:false, log:false, NONE:false, 
           element:false, OBJECT:false, PARAM:false, NAME:false, VALUE:false, 
           appendChild:false, JAVAMIME:false, body:false, isObject:false,
           isNull:false
*/
define(
	"modules/JavaStorage",
	["modules/StorageListener", "modules/JavaQuotaExceededError"], 
	function (StorageListener, JavaQuotaExceededError) {
	"use strict";

	var store, cTimer, eTimer, proto,

        DIRTY            = DU + JAVA + STORAGE + DU,
        CODE             = "LocalStorageApplet.class",

		ready            = false,
		isLoaded         = false,
		clearTimer       = function () {
			clearInterval(cTimer);
			clearTimeout(eTimer);
			eTimer = cTimer = undefined;
		},
        hasJava          = function () {
            var i, j, m, type, desc, str,
                REGEXP   = /^application\/x-java-applet;(jpi-)?version=(.*)$/,
                version  = false,
                versions = ["9", "1.8", "1.7", "1.6", "1.5"];

			if ( "ActiveXObject" in window ) {
                for (i = versions.length-1; i > -1; i-=1) {
                    str = "JavaWebStart.isInstalled." + versions[i] + ".0";
                    if ( versions[i] !== "9" ) {
                        str+= ".0";
                    }
                    try {
                        if ( !isNull(new ActiveXObject(str)) ) {
                            version = true;
                            break;
                        }
                    } catch (ignore){}
                }
            }

            if ( !version && isObject(navigator.mimeTypes) ) {
                for (i = navigator.mimeTypes.length-1; i > -1; i-=1) {
                    type = navigator.mimeTypes[i].type;
                    m    = type.match(REGEXP); 
                    if ( !isNull(m) ) {
                        for (j = versions.length-1; j > -1; j-=1) {
                            if ( versions[j] === m[2] ) {
                                version = true;
                                break;
                            }
                        }
                        if ( version ) {
                            break;
                        }
                    }
                }
            }

			if ( !version && isObject(navigator.plugins) ) {
                for (i = navigator.plugins.length-1; i > -1; i-=1) {
                    desc = navigator.plugins[i].description;
                    if ( desc.search(/^Java/) !== -1 ) {
                        version = true;
                        break;
                    }
                }
            }
            
            return (navigator.javaEnabled() && version) || ready || isLoaded;
        },
        createJavaObject = function () {
            var owner, comment, embed,
                key   = LOCAL + STORAGE + JAVA,
                attrs = "",
		        attributes = {
		        	"id"       : key,
		        	"name"     : key,
                    "code"     : CODE,
                    "archive"  : javaURL, 
		        	"width"    : 500,
		        	"height"   : 500,
                    "type"     : JAVAMIME
		        },
		        parameters = {
                    "code"           : CODE,
                    "archive"        : javaURL, 
                    "java_arguments" : "-Djnlp.packEnabled=true",
                    "logFn"          : log,
                    "dirtyKey"       : DIRTY,
                    "readyFn"        : READY
		        }, 
                unload = function () {
			    	var timer;

			    	window.detachEvent(onunload, unload);
			    	
			    	owner.style.display = NONE;
			    	timer = setInterval(function () {
			    		if (owner.readyState === 4) {
			    			clearInterval(timer);
                            timer = undefined;

			    			each(owner, function (_arg, _index) {
			    				if ( isFunction(_arg) ) {	
			    					owner[_index] = undefined;
			    				}
			    			});
			    			owner.parentNode.removeChild(owner);
			    		}
			    	}, 10);
			    };

			try {
				attributes.classid = 
					"clsid:8AD9C840-044E-11D1-B3E9-00805F499D93";

				forEach(attributes, function (_value, _key) {
                    if ( _key !== "code" && _key !== "archive" ) {
					    attrs += _key + "=\"" + _value + "\" ";
                    }
				});
                attrs = attrs.substr(0, attrs.length-1);
				owner = element("<" + OBJECT + " " + attrs + ">");

				forEach(parameters, function (_value, _key) {
					var par = element(
						"<" + PARAM + " " + NAME + "=\"" + _key + "\" " + 
						VALUE + "=\"" + _value + "\">"
					);
					appendChild(owner, par); 
				});

				window.attachEvent(onunload, unload);
			} catch (ignore) {
				owner   = element(OBJECT);
                comment = element(COMMENT);
                embed   = element(EMBED);

                if ( !isIE() ) {
					delete attributes.classid;
				}

				forEach(parameters, function (_value, _key) {
					var par = element(PARAM);
					attribute(par, NAME, _key);
					attribute(par, VALUE, _value);
					appendChild(owner, par);
                    if ( _key !== "code" && _key !== "archive" ) {
					    appendChild(embed, par.cloneNode());
                    }
				});

				forEach(attributes, function (_value, _key) {
                    if ( _key !== "code"    && 
                         _key !== "archive" && 
                         _key !== "name" ) {
					    attribute(owner, _key, _value);
                    }

                    if ( _key !== "classid"  && 
                         _key !== "codebase" &&
                         _key !== "id" ) {
					    attribute(embed, _key, _value);
                    }
				});
			}

            if ( !!comment && !!embed ) {
                appendChild(comment, embed);
                appendChild(owner, comment);
            }
			appendChild(body, owner);

			return owner;
        },
        getJavaObject    = function () {
            var key = LOCAL + STORAGE + JAVA;
			return document[key] || 
				   document.getElementById(key) || 
                   document.embeds[key];
        },
        JavaStorage = StorageListener.extend({
    	"init" : (function () {
            var init = function init(_onerror, _timeout) {
                var object, timer,
                    self       = this,
                    timeout    = _timeout || 3000,
                    initialize = function () {
                        var i, key;

                        proto.length = proto.len = store.length();

                        for (i = 0; i < proto.length; i += 1) {
                            key = self.key(i);
                            if ( indexOf(restricted, key) === -1 ) {
                                self[key] = self.getItem(key);
                            }
                        }

                        init.$super.call(self);
                    };

                if ( !!store ) {
                    // Java object is ready so use it
                    initialize();
                } else if ( getJavaObject() ) {
                    if (isUndefined(eTimer) && isUndefined(cTimer) && !ready) {
                        // Java object failed loading
                        if ( isFunction(_onerror) )  {
                            _onerror.call(self);
                        }
                    } else {
                        // Java object is not yet ready, but it is created
                        timer = setInterval(function () {
                            if ( !!store || ready ) {
                                clearInterval(timer);
                                timer = undefined;

                                store = getJavaObject();

                                initialize();

                                isLoaded = true;
                            } else if ( isUndefined(eTimer) && 
                                        isUndefined(cTimer) ) {
                                clearInterval(timer);
                                timer = undefined;

                                if ( isFunction(_onerror) )  {
                                    _onerror.call(self);
                                }
                            }
                        }, 10);
                    }
                } else {
                    // Java object is not yet created
                    object = createJavaObject.call(self);

                    cTimer = setInterval(function () {
                        try {
                            if ( (hasOwnProperty.call(object, "isActive") &&
                                  object.isActive()                       && 
                                  ready) || ready ) {
                                clearTimer.call();

                                store = getJavaObject();

                                initialize();

                                isLoaded = true;
                            }
                        } catch (ignore){}
                    }, 10);
                    eTimer = setTimeout(function () {
                      //  var obj = getJavaObject();

                        clearTimer.call();

                       // if ( !!obj ) {
                       //     obj.parentNode.removeChild(obj);
                       // }

                        if ( isFunction(_onerror) )  {
                            _onerror.call(self);
                        }
                    }, timeout);
                }
            };
            return init;
    	}()),

        "key" : function (_index) {
            if ( _index >= proto.length || _index < 0 ) {
                return null;
            }

            return store.key(_index);
        },

        "getItem" : function (_key) {
            return store.getItem(_key);		
        },

        "setItem" : (function () {
            var setItem = function setItem(_key, _data) {
                var self = this,
                    old  = self.getItem(_key);
                
                if ( old === _data ) {
                    return;
                }

                if ( !store.setItem(_key, _data) ) {
                    throw new JavaQuotaExceededError(
                        JAVA + STORAGE + OUTOFMEMORY
                    );
                }

                proto.length = proto.len = store.length(); 

                setItem.$super.call(self, _key, old, _data);
            };
            return setItem;
        }()),

        "removeItem" : (function () {
            var removeItem = function removeItem(_key) {
                var self = this,
                    old  = self.getItem(_key);

                store.removeItem(_key);
                proto.length = proto.len = store.length();

                removeItem.$super.call(self, _key, old);
            };
            return removeItem;
        }()),

        "clear" : (function () {
            var clear = function clear() {
                var i, key,
                    self = this;

                for (i = 0; i < store.length(); i+=1) {
                    key = self.key(i);
                    if ( indexOf(restricted, key) === -1 ) {
                        delete self[key];
                    }
                }

                store.clear();
                proto.length = proto.len = store.length();

                clear.$super.apply(self, arguments);
            };
            return clear;
        }()),

    	"isLoaded" : function () {
    		return isLoaded;
    	},

		"type" : JAVA + STORAGE
    });

    proto                  = JavaStorage.prototype;
	proto.constructor      = JavaStorage;
	JavaStorage[READY]     = function (_bool) {ready = _bool;};
	JavaStorage[AVAILABLE] = hasJava();
    toWindow(JAVA+STORAGE, JavaStorage);

	return JavaStorage;
});
