/* globals LOCAL:false, STORAGE:false, each:false, isNumber:false, 
           toString:false, hasOwnProperty:false, isUndefined:false, 
           isFunction:false, isNull:false, guid:false, isString:false, 
           toWindow:false, indexOf:false, restricted:false, ENABLED:false,
           TRUE:false, AVAILABLE:false
*/
define([
	"modules/CookieStorage",
	"modules/FlashStorage",
	"modules/GlobalStorage",
	"modules/JavaStorage",
	"modules/RAMStorage",
	"modules/SessionStorage",
	"modules/UserDataStorage"
], function (CookieStorage, FlashStorage, GlobalStorage, JavaStorage, 
             RAMStorage, SessionStorage, UserDataStorage) {
	"use strict";

	var Storage,
	    object,

        LEN = "len",

	    protos = [
			RAMStorage, 
			SessionStorage, 
			CookieStorage, 
			JavaStorage, 
			FlashStorage, 
			UserDataStorage, 
			GlobalStorage
		],
        
        override = function (_object) {
            var Storage    = window.Storage,
                key        = Storage.prototype.key,
                setItem    = Storage.prototype.setItem,
                getItem    = Storage.prototype.getItem,
                removeItem = Storage.prototype.removeItem,
                clear      = Storage.prototype.clear;

            Storage.prototype.setItem = function (_key, _value) {
                var self = this;
                if ( self === window.localStorage ) {
                    _object.setItem(_key, _value);
                    if ( indexOf(restricted, _key) === -1 ) {
                        try {
                            self[_key] = _value;
                        } catch (ignore) {
                            Object.defineProperty(self, _key, {
                                value: _value,
                                writable: true
                            });
                        }
                    }
                    Object.defineProperty(self, LEN, {
                        value: _object.length,
                        writable: true
                    });
                } else {
                    setItem.apply(self, arguments);
                }
            };

            Storage.prototype.getItem = function (_key) {
                var self = this;
                if ( self === window.localStorage ) {
                    Object.defineProperty(self, LEN, {
                        value: _object.length,
                        writable: true
                    });
                    return _object.getItem(_key);
                }
                return getItem.apply(self, arguments);
            };

            Storage.prototype.removeItem = function (_key) {
                var self = this;
                if ( self === window.localStorage ) {
                    _object.removeItem(_key);
                    if ( indexOf(restricted, _key) === -1 ) {
                        try {
                            delete self[_key];
                        } catch (ignore) {
                            Object.defineProperty(self, _key, {
                                value: undefined,
                                writable: true
                            });
                        }
                    }
                    Object.defineProperty(self, LEN, {
                        value: _object.length,
                        writable: true
                    });
                } else {
                    removeItem.apply(self, arguments);
                }
            };

            Storage.prototype.key = function (_index) {
                var self = this;
                if ( self === window.localStorage ) {
                    Object.defineProperty(self, LEN, {
                        value: _object.length,
                        writable: true
                    });
                    return _object.key(_index);
                }
                return key.apply(self, arguments);
            };

            Storage.prototype.clear = function () {
                var self = this;
                if ( self === window.localStorage ) {
                    each(_object, function (_key) {
                        if ( indexOf(restricted, _key) === -1 ) {
                            try {
                                delete self[_key];
                            } catch (ignore) {
                                Object.defineProperty(self, _key, {
                                    value: undefined,
                                    writable: true
                                });
                            }
                        }
                    });
                    _object.clear();
                    Object.defineProperty(self, LEN, {
                        value: _object.length,
                        writable: true
                    });
                } else {
                    clear.apply(self, arguments);
                }
            };

            Storage.prototype.isLoaded = function (_callback) {
                var self = this;
                if ( self === window.localStorage ) {
                    _object.isLoaded(function () {
                        each(_object, function (_key) {
                            var value;
                            if ( indexOf(restricted, _key) === -1 ) {
                                value = _object.getItem(_key);
                                try {
                                    self[_key] = value;
                                } catch (ignore) {
                                    Object.defineProperty(self, _key, {
                                        value : value,
                                        writable: true
                                    });
                                }
                            }
                        });
                        Object.defineProperty(self, LEN, {
                            value: _object.length,
                            writable: true
                        });
                        _callback.call(self);
                    });
                } else {
                    _callback.call(self);
                }
            };
        };

    if ( !window.name ) {
        window.name = guid();
    }

	try {
		window.localStorage.setItem(ENABLED, TRUE);
		if ( window.localStorage.getItem(ENABLED) !== TRUE ) {
            throw Error(LOCAL + STORAGE + " un" + AVAILABLE);
        }
		window.localStorage.removeItem(ENABLED);
	} catch (ignore) {
		each(protos, function (_proto) {
			if ( !_proto.available ) {
				return;
			}

			Storage = _proto.extend({
				"key" : (function () {
                    var key = function key(_index) {
                        var self = this;
                        if ( isNumber(_index) && 
                             _index < self.length && 
                             _index >= 0 ) {
                            return key.$super.call(self, _index);
                        }
                        return null;
                    };
                    return key;
				}()),

				"getItem" : (function () {
                    var getItem = function getItem(_key) {
                        var self = this;
                        if ( isString(_key) ) {
                            return getItem.$super.call(self, _key);
                        }
                        return null;
                    };
                    return getItem;
				}()),

				"setItem" : (function () {
                    var setItem = function setItem(_key, _val) {
                        var self  = this,
                            value = isString(_val) ? _val : 
                                (!(isNull(_val) || isUndefined(_val)) && 
                                 hasOwnProperty.call(_val, "toString") ? 
                                 _val.toString() : toString.call(_val));

                        if ( isString(_key) ) {
                            setItem.$super.call(self, _key, value);
                        }
                    };
                    return setItem;
				}()),

				"removeItem" : (function () {
                    var removeItem = function removeItem(_key) {
                        var self = this;
                        if ( isString(_key) ) {
                            removeItem.$super.call(self, _key);
                        }
                    };
                    return removeItem;
				}()),

				"isLoaded" : (function () {
                    var isLoaded = function isLoaded(_callback) {
                        var timer, 
                            self = this;

                        if ( !isFunction(_callback) ) {
                            return isLoaded.$super.call(self);
                        }

                        if ( isLoaded.$super.call(self) ) {
                            return _callback.call(self);
                        }

                        timer = setInterval(function () {
                            if ( isLoaded.$super.call(self) ) {
                                clearInterval(timer);
                                timer = undefined;
                                _callback.call(self);
                            }
                        }, 10);
                    };
                    return isLoaded;
				}())
			});
			Storage.prototype.constructor = Storage;

			return false;
		});

		object = new Storage(function () {
			var object;

			if (CookieStorage.available) {
				object = new CookieStorage();
			} else if (SessionStorage.available) {
				object = new SessionStorage();
            } else {
				object = new RAMStorage();
			}

            if ( !toWindow(LOCAL+STORAGE, object) ) {
                override(object);
            }
		});

        if ( !toWindow(LOCAL+STORAGE, object) ) {
            override(object);
        } else {
			toWindow(STORAGE, Storage);
        }
	}
});
