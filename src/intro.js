;(function (window, document, location, navigator, undefined, docElem) {
	"use strict";

	var swfURL,
        javaURL,
		log,

        // Cached strings
        ON              = "on",
        DU              = "__",
        APP             = "application",
        KEY             = "key",
		LOG             = "log",
        URL             = "url",
        GUID            = "guid",
        TYPE            = "type",
        AREA            = "area",
		TRUE            = "true",
		NAME            = "name",
		HOST            = "host",
		BODY            = "body",
		HTML            = "html",
		LOCAL           = "local",
		EMBED           = "embed",
		OBJECT          = "object",
		COMMENT         = "comment",
		DOMAIN          = "domain",
		ONUNLOAD        = "onunload",
		SCRIPT          = "script",
		ENABLED         = "Enabled",
		TITLE           = "title",
		HEAD            = "head",
		DIV             = "div",
		NONE            = "none",
		PARAM           = "param",
		VALUE           = "value",
		STRING          = "String",
		FUNCTION        = "Function",
		NUMBER          = "Number",
		USERDATA        = "UserData",
        EVENT           = "Event",
		RAM             = "RAM",
		JAVA            = "Java",
		FLASH           = "Flash",
		COOKIE          = "Cookie",
		STORAGE         = "Storage",
		SESSION         = "Session",
		GLOBAL          = "Global",
        AVAILABLE       = "available",
        READY           = DU + "ready" + DU,
		OUTOFMEMORY     = " is out of memory",
		FLASHMIME       = APP+"/x-shockwave-flash",
		FLASHAOX        = "ShockwaveFlash.ShockwaveFlash",
        JAVAMIME        = APP+"/x-java-applet",
	    FLASHPLUGIN     = "Shockwave Flash",
		restricted      = [
			"toString",
			"toLocaleString",
			"valueOf",
			"hasOwnProperty",
			"isPrototypeOf",
			"propertyIsEnumerable",
			"constructor",
			"init", 
			"length", 
			KEY, 
			"getItem", 
			"setItem", 
			"clear", 
			"removeItem", 
			"isLoaded",
			READY,
			AVAILABLE,
            TYPE
	    ],	

        // Cached objects
		protocol        = location.protocol || document.protocol,
		body            = document.body || 
						  document.getElementsByTagName(BODY)[0],
		oProto          = Object.prototype,
		toString        = oProto.toString,
		hasOwnProperty  = oProto.hasOwnProperty,

        // Cached functions
        guid = function () {
            return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
                /[xy]/g, 
                function(c) {
                    var r = Math.random()*16|0, v = c === "x" ? r : (r&0x3|0x8);
                    return v.toString(16);
                }
            );
        },
		isString = function (_arg) {
			return toString.call(_arg) === "[" + OBJECT + " " + STRING + "]";
		},
		isBoolean = function (_arg) {
			return _arg === false || _arg === true || 
                   toString.call(_arg) === "[" + OBJECT + " Boolean]";
		},
		isUndefined = function (_arg) {
			return _arg === undefined;
		},
		isNull = function (_arg) {
			return _arg === null;
		},
		isObject = function (_arg) {
			return _arg === Object(_arg);
		},
		isFunction = function (_arg) {
			return typeof _arg === FUNCTION.toLowerCase() || 
				   toString.call(_arg) === "[" + OBJECT + " " + FUNCTION + "]";
		},
		isNumber = function (_arg) {
			return toString.call(_arg) === "[" + OBJECT + " " + NUMBER + "]" && 
                   !isNaN(_arg);
		},
        isArguments = function (_arg) {
            return toString.call(_arg) === "["+OBJECT+" Arguments]" || 
                   (!!_arg && hasOwnProperty.call(_arg, "callee"));
        },
		isIE = function () {
			var result = false;

			/* jshint ignore:start */
			result = new Function("return/*@cc_on!@*/!1")() || 
					 ( isNumber(document.documentMode) && 
					   document.documentMode <= 10 );
			/* jshint ignore:end */

			return result;
		},
		attribute = function (_element, _key, _value) {
			if ( !!_element.setAttribute ) {
				_element.setAttribute(_key, _value);
			} else {
				_element[_key] = _value;
			}
		},
		each = function (_array, _callback) {
			var len = _array.length;
			while (len) {
				len -= 1;
				if ( !isUndefined(_array.key) ) {
					if (_callback.call(this, _array.key(len), len) === false) {
						break;
					}
				} else {
					if (_callback.call(this, _array[len], len) === false) {
						break;
					}
				}
			}
		},
		forEach = function (_object, _callback) {
			var key = null;
			for (key in _object) {
				if (_object.hasOwnProperty(key)) {
					if (_callback.call(key, _object[key], key) === false) {
						break;
					}
				}
			}
		},
		indexOf = function (_array, _object) {
			var i, len = _array.length >>> 0;

			if (len === 0) {
				return -1;
			}

			i = 0;
			while (i < len) {
				if (_array[i] === _object) {
					return i;
				}
				i += 1;
			}
			return -1;
		},
		element = function (_arg) {
			return document.createElement(_arg);
		},
		appendChild = function (_parent, _child) {
			_parent.insertBefore(
				_child, 
				_parent.lastChild ? 
				_parent.lastChild.nextSibling : 
				_parent.lastChild
			);
		},
	    toWindow = function (_name, _object) {
			try {
				Object.defineProperty(window, _name, {
                    value : _object,
                    writeable : true
                }); 
			} catch (ignore) {
                try {
			        window[_name] = _object; 
			    } catch (ignore) {}
			}

            return window[_name] === _object;
        },
        scripts = document.scripts || document.getElementsByTagName(SCRIPT),
		source  = scripts[scripts.length-1].src.split("?");

		if (source[1]) {
			each(source[1].split("&"), function (_arg) {
				var data = _arg.split("=");

				switch (data[0]) {
					case "javaURL":
						javaURL = 
                            decodeURIComponent(data[1].replace(/\+/g,  " "));
                        break;
					case "swfURL":
						swfURL = 
                            decodeURIComponent(data[1].replace(/\+/g,  " "));
						break;
					case LOG:
						log = 
                            decodeURIComponent(data[1].replace(/\+/g,  " "));
						break;
				}
			});	
		}
