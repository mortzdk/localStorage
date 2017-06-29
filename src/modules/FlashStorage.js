/* globals swfURL:false, LOCAL:false, TYPE:false, isFunction:false, NONE:false, 
           forEach:false, OBJECT:false, DU:false, PARAM:false, NAME:false, 
           VALUE:false, FLASHMIME:false, STORAGE:false, each:false, isIE:false,
           element:false, appendChild:false, FLASHPLUGIN:false, body:false, 
           FLASH:false, OUTOFMEMORY:false, FLASHAOX:false, isObject:false, 
           isUndefined:false, restricted:false, indexOf:false, log:false, 
           toWindow:false, AVAILABLE:false, LOG:false, READY:false, 
           attribute:false
*/
define(
	"modules/FlashStorage",
	["modules/StorageListener", "modules/FlashQuotaExceededError"], 
	function (StorageListener, FlashQuotaExceededError) {
	"use strict";

	var store, cTimer, eTimer, proto,
        dirtyKey   = DU + FLASH + STORAGE + DU,
		ready      = false,
		isLoaded   = false,
		clearTimer = function () {
			clearInterval(cTimer);
			clearTimeout(eTimer);
			eTimer = cTimer = undefined;
		},
		toInt = function (_arg) {
			return parseInt(_arg, 10);
		},
		hasFlash = function () {
			var flash, desc;
			try {
				flash = new ActiveXObject(FLASHAOX);
				if ( flash ) {
					desc = flash.GetVariable("$version");	
					if ( desc && 
						 toInt(desc.split(" ")[1].split(",")[0]) >= 9 ) {
						return true;
					}
				}
				return false;
			} catch (ignore) {
				if ( isObject(navigator.plugins[FLASHPLUGIN]) && 
					 !isUndefined(navigator.mimeTypes) && 
					 !isUndefined(navigator.mimeTypes[FLASHMIME]) ) {
					desc = navigator.plugins[FLASHPLUGIN].description;
					if ( navigator.mimeTypes[FLASHMIME].enabledPlugin && 
						 !isUndefined(desc) ) {
						desc = desc.replace(
							/^.*\s+(\S+\s+\S+$)/, 
							"$1"
						);
						if ( toInt(desc.replace(/^(.*)\..*$/, "$1")) >= 9 ) {
							return true;
						}
					}
				}
				return false;
			}
		},
		getFlashObject = function () {
            var key = LOCAL + STORAGE + FLASH;
			return document[key] || 
				   document.getElementById(key);
	    },
		createFlashObject = function () {
			var owner,
                key   = LOCAL + STORAGE + FLASH,
				logFn = isUndefined(log) ? "" : "&" + LOG + "Fn=" + log,
			    url   = swfURL || LOCAL + STORAGE + ".swf",
			    attrs = "",
		        attributes = {
		        	"id"     : key,
		        	"name"   : key,
		        	"width"  : 1,
		        	"height" : 1
		        },
		        parameters = {
		        	allowScriptAccess : "always",
		        	wmode             : "transparent",
		        	flashvars         : "readyFn=window." + FLASH + STORAGE + 
						"." + READY + "&dirtyKey=" + dirtyKey + logFn
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
					"clsid:d27cdb6e-ae6d-11cf-96b8-444553540000";
				parameters.movie = url;

				forEach(attributes, function (_value, _key) {
					attrs += _key + "=\"" + _value + "\" ";
				});

				owner = element(
					"<" + OBJECT + " " + attrs + ">"
				);

				forEach(parameters, function (_value, _key) {
					var par = element(
						"<" + PARAM + " " + NAME + "='" + _key + "' " + 
						VALUE + "='" + _value + "'>"
					);
					appendChild(owner, par); 
				});

				window.attachEvent(onunload, unload);
			} catch (ignore) {
				owner = element(OBJECT);

				if ( !isIE() ) {
					delete attributes.classid;
					delete parameters.movie;

					attribute(owner, TYPE, FLASHMIME);
					attribute(owner, "data", url);
				}

				forEach(parameters, function (_value, _key) {
					var par = element(PARAM);
					attribute(par, NAME, _key);
					attribute(par, VALUE, _value);
					appendChild(owner, par);
				});

				forEach(attributes, function (_value, _key) {
					attribute(owner, _key, _value);
				});
			}

			appendChild(body, owner);

			return owner;
		}, 
        FlashStorage = StorageListener.extend({
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
                    // Flash object is ready so use it
                    initialize();
                } else if ( getFlashObject() ) {
                    if (isUndefined(eTimer) && isUndefined(cTimer) && !ready) {
                        // Flash object failed loading
                        if ( isFunction(_onerror) )  {
                            _onerror.call(self);
                        }
                    } else {
                        // Flash object is not yet ready, but it is created
                        timer = setInterval(function () {
                            if ( !!store || ready ) {
                                clearInterval(timer);
                                timer = undefined;

                                store = getFlashObject();

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
                    // Flash object is not yet created
                    object = createFlashObject.call(self);
                    cTimer = setInterval(function () {
                        if ( (hasOwnProperty.call(object, "PercentLoaded") &&
                              object.PercentLoaded() === 100               && 
                              ready) || ready ) {
                            clearTimer.call();

                            store = getFlashObject();

                            initialize();

                            isLoaded = true;
                        }
                    }, 10);
                    eTimer = setTimeout(function () {
                        clearTimer.call();
                        if ( !!getFlashObject() ) {
                            getFlashObject().parentNode.removeChild(
                                getFlashObject()
                            );
                        }
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
                    throw new FlashQuotaExceededError(
                        FLASH + STORAGE + OUTOFMEMORY
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

		"type" : FLASH + STORAGE
    });

    proto                   = FlashStorage.prototype;
	proto.constructor       = FlashStorage;
	FlashStorage[READY]     = function (_bool) {ready = _bool;};
	FlashStorage[AVAILABLE] = hasFlash();
    toWindow(FLASH+STORAGE, FlashStorage);

	return FlashStorage;
});
