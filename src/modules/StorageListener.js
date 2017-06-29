/* globals forEach:false, each:false, isUndefined:false, isNull:false, 
           STORAGE:false, restricted:false, indexOf:false, isNumber:false,
           scripts:false, isBoolean:false, isFunction:false, guid:false, 
           isString:false, EVENT:false, KEY:false, TYPE:false, URL:false, 
           AREA:false, GUID:false, DU:false, ON:false
*/
define(
    "modules/StorageListener", 
    ["modules/Class", "modules/StorageEvent"], 
    function (Class, StorageEvent) {
	"use strict";

    var StorageListener,

        MUTATIONEVENT       = "MutationEvent",
        PROPERTYCHANGE      = "propertychange",
        DOMATTRMODIFIED     = "DOMAttrModified",
        TEST                = DU + "TEST" + DU,

        elem                = scripts[scripts.length-1],
        s                   = STORAGE.toLowerCase(),
        storages            = {},
        events              = [],
        listeners           = {
            "onstorage" : [],
            "storage"   : [],
        },
        attachEvent         = window.attachEvent,
        detachEvent         = window.detachEvent,
        dispatchEvent       = window.dispatchEvent,
        fireEvent           = window.fireEvent,
        addEventListener    = window.addEventListener,
        removeEventListener = window.removeEventListener,
        MutationObserver    = window.MutationObserver || 
                              window.WebKitMutationObserver,
        toInt               = function (_str) {
            return parseInt(_str, 10);
        },
        createStorageEvent  = function (_type, _name) {
            var evt;
            try {
                evt = new window.StorageEvent(_type);
            } catch (ignore) {
                try {
                    evt = document.createEvent(_name);
                } catch (ignore) {
                    evt = new StorageEvent(_type);
                }
            }
            return evt;
        },
        fireMessage         = function (_event) {
			var self = this,
			    message = "";

			if ( !isUndefined(_event.key) && !isNull(_event.key) ) {
				message += KEY + "=" + _event.key + ",";
			}

            message += "rand=" + guid() + ",";

			if ( !isUndefined(_event.type) && !isNull(_event.type) ) {
				message += TYPE + "=" + _event.type + ",";
			}

			if ( !isUndefined(_event.url) && !isNull(_event.url) ) {
				message += URL + "=" + _event.url + ",";
			} 

			message += s + AREA + "=" + self.type + ",";
			message += GUID + "=" + window.name;

			self.setItem(DU + self.type + DU, message);
        },
        parseMessage = function (_data) {
            var type, url, evt, storageArea,
                newValue = "",
                oldValue = "",
                key      = "",
                guid     = "",
                data     = _data.split(",");

            each(data, function (_value) {
                var value = _value.split("=");
                switch (value.shift()) {
                    case GUID:
                        guid        = value.join("");
                        break;
                    case KEY:
                        key         = value.join("");
                        break;
                    case URL:
                        url         = value.join("");
                        break;
                    case TYPE:
                        type        = value.join("");
                        break;
                    case s + AREA:
                        storageArea = value.join("");
                        break;
                }
            });

            if ( !isNull(guid)         && 
                 window.name !== guid  && 
                 type === s            &&
                 storages[storageArea]) {

                storageArea = storages[storageArea].storage;
                if ( !isNull(key) && key !== "" && !isNull(storageArea) ) {
                    oldValue = isString(storageArea[key]) ? 
                        storageArea[key].slice(0) : "";
                    newValue = storageArea.getItem(key) || "";
                    if ( indexOf(restricted, key) === -1 ) {
                        storageArea[key] = newValue;
                    }
                }

                evt = createStorageEvent(type, STORAGE+EVENT);
                evt.initStorageEvent(
                    type, false, false, key, oldValue, newValue, url, null
                );
                evt.storage = storageArea;

                if ( window.dispatchEvent ) {
                    window.dispatchEvent(evt);
                } else {
                    window.fireEvent(ON + s, evt);
                }
            }
        },
        dirtyCheck = function () {
            forEach(storages, function (_value, _key) {
                var msg, DIRTY;

                if ( _value.storage.isLoaded() ) {
                    DIRTY = DU + _key + DU;
                    msg   = _value.storage.getItem(DIRTY);

                    if ( !!msg ) {
                        if (_value.message !== msg ) { 
                            _value.message = msg;
                            parseMessage.call(_value.storage, msg);
                        } else {
                            _value.storage.removeItem(DIRTY);
                        }
                    }
                }
            });
        },
        addListener = function (_elm, _name, _callback) {
            if ( _elm.addEventListener ) {
                _elm.addEventListener(_name, _callback, false);
            } else if ( _elm.attachEvent ) {
                _elm.attachEvent(ON + _name, _callback);
            } 
        },
        removeListener = function (_elm, _name, _callback) {
            if ( _elm.removeEventListener ) {
                _elm.removeEventListener(_name, _callback, false);
            } else if ( _elm.detachEvent ) {
                _elm.detachEvent(ON + _name, _callback);
            } 
        },
        isDOMAttrModifiedSupported = function () {
            var flag = false,
                func = function() {flag = true;};

            addListener(elem, DOMATTRMODIFIED, func);
            elem.setAttribute(TEST, true);
            elem.removeAttribute(TEST);
            removeListener(elem, DOMATTRMODIFIED, func);

            return flag;
        },
        watch = function (_elm, _func) {
            var observer, options, proto, setAttribute, removeAttribute;

            if ( MutationObserver ) {
                options = {
                    subtree           : false,
                    attributes        : true,
                    attributeOldValue : _elm.getAttribute(s)
                };
                observer = new MutationObserver(function(_mutations) {
                    _mutations.forEach(_func);
                });
                observer.observe(_elm, options);
            } else if ( (isBoolean(isDOMAttrModifiedSupported)  && 
                         isDOMAttrModifiedSupported)            || 
                        (isFunction(isDOMAttrModifiedSupported) &&
                         isDOMAttrModifiedSupported()) ) {
                isDOMAttrModifiedSupported = true;
                addListener(_elm, DOMATTRMODIFIED, _func);
            } else if ( ON+PROPERTYCHANGE in _elm ) {
                isDOMAttrModifiedSupported = false;
                addListener(_elm, PROPERTYCHANGE, _func);
            } else {
                isDOMAttrModifiedSupported = true;
                proto           = HTMLElement.prototype;
                setAttribute    = proto.setAttribute;
                removeAttribute = proto.removeAttribute;

                proto.setAttribute = function(_name, _value) {
					var val, evt,
                        self = this,
                        prev = self.getAttribute(_name);

					setAttribute.call(self, _name, _value);

					val = self.getAttribute(_name);
					if ( val !== prev ) {
						evt = document.createEvent(MUTATIONEVENT);
						evt.initMutationEvent(
                            DOMATTRMODIFIED, true, false, self, 
                            prev || "", val || "", _name, 
                            (prev === null) ? evt.ADDITION : evt.MODIFICATION);
						self.dispatchEvent(evt);
					}
				};

				proto.removeAttribute = function(_name) {
					var evt, 
                        self = this,
                        prev = self.getAttribute(_name);

					removeAttribute.call(self, _name);

					evt = document.createEvent(MUTATIONEVENT);
					evt.initMutationEvent(
                        DOMATTRMODIFIED, true, false, self, 
                        prev, "", _name, evt.REMOVAL);
					self.dispatchEvent(evt);
				};

                addListener(_elm, DOMATTRMODIFIED, _func);
            }

            return observer;
        },
        unwatch = function (_elm, _func) {
            if ( MutationObserver ) {
                _elm.disconnect();
            } else if ( isDOMAttrModifiedSupported ) {
                removeListener(_elm, DOMATTRMODIFIED, _func);
            } else if ( ON+PROPERTYCHANGE in _elm ) {
                removeListener(_elm, PROPERTYCHANGE, _func);
            } else {
                removeListener(_elm, DOMATTRMODIFIED, _func);
            }
        };

    StorageListener = Class.extend({
        "init" : function () {
            var self = this;

            storages[self.type] = {
                storage : self,
                message : self.getItem("__" + self.type + "__")
            };

            if ( "addEventListener" in window && 
                 !isNumber(toInt(elem.getAttribute(s))) ) {
                elem.setAttribute(s, -1);

                window.addEventListener = function (type, callback) {
                    var l;
                    if ( s === type ) {
                        listeners[type].push({
                            action : function (event) {
                                var idx = toInt(elem.getAttribute(s));
                                if ( event.attrName      === s ||
                                     event.attributeName === s ||
                                     event.propertyName  === s ) {
                                    callback.call(
                                        window, 
                                        events[idx]
                                    );
                                    events[idx] = undefined;
                                }
                            },
                            callback : callback
                        });
                        if ( !listeners.timer ) {
                            listeners.timer = setInterval(dirtyCheck, 100);
                        }
                        l          = listeners[type][listeners[type].length-1];
                        l.observer = watch(elem, l.action);
                    }
                    addEventListener.apply(window, arguments);
                };
            
                window.removeEventListener = function (type, callback) {
                    if ( s === type ) {
                        each(listeners[type], function (_l, _i) {
                            var l;
                            if ( _l.callback === callback ){
                                l = listeners[type].splice(_i, 1)[0];
                                unwatch(l.observer || elem, l.action);
                                return false;
                            }
                        });
                        if ( listeners[type].length === 0 ) {
                            clearInterval(listeners.timer);
                            delete listeners.timer;
                        }
                    }
                    removeEventListener.apply(window, arguments);
                };
            
                window.dispatchEvent = function (event) {
                    var idx;
                    if ( s === event.type && !event.storageArea ) {
                        idx = toInt(elem.getAttribute(s));
                        events[idx+1] = event;
                        elem.setAttribute(s, idx+1);
                    } else {
                        dispatchEvent.apply(window, arguments);
                    }
                };
            }
            
            if ( "attachEvent" in window && 
                 !isNumber(toInt(elem.getAttribute(s))) ) {
                elem.setAttribute(s, -1);
            
                window.attachEvent = function (type, callback) {
                    var l;
                    if ( ON + s === type ) {
                        listeners[type].push({
                            action : function (event) {
                                var idx=toInt(elem.getAttribute(s));
                                if ( event.attrName      === s ||
                                     event.attributeName === s ||
                                     event.propertyName  === s ) {
                                    callback.call(
                                        window, 
                                        events[idx]
                                    );
                                    events[idx] = undefined;
                                }
                            },
                            callback : callback
                        });
                        if ( !listeners.timer ) {
                            listeners.timer = setInterval(dirtyCheck, 100);
                        }
                        l          = listeners[type][listeners[type].length-1];
                        l.observer = watch(elem, l.action);
                    }
                    attachEvent(type, callback);
                };
            
                window.detachEvent = function (type, callback) {
                    if ( ON + s === type ) {
                        each(listeners[type], function (_l, _i) {
                            var l;
                            if ( _l.callback === callback ) {
                                l = listeners[type].splice(_i, 1)[0];
                                unwatch(l.observer || elem, l.action);
                                return false;
                            }
                        });
                        if ( listeners[type].length === 0 ) {
                            clearInterval(listeners.timer);
                            delete listeners.timer;
                        }
                    }
                    detachEvent(type, callback);
                };
            
                window.fireEvent = function (type, event) {
                    var idx;
                    if ( ON + s === type && !event.storageArea ) {
                        idx = toInt(elem.getAttribute(s));
                        events[idx+1] = event;
                        elem.setAttribute(s, idx+1);
                    } else {
                        fireEvent(type, event);
                    }
                };
            }
        },

        "setItem" : function (_key, _oldValue, _newValue) {
            var evt,
                self  = this,
                DIRTY = DU + self.type + DU;

            if ( _key !== DIRTY ) {
                evt = createStorageEvent(s, STORAGE+EVENT);
                evt.initStorageEvent(
                    s, false, false, _key, _oldValue, 
                    _newValue, location.href, null
                );
                evt.storage = storages[self.type].storage;

                if ( indexOf(restricted, _key) === -1 ) {
                    self[_key] = _newValue;
                }

                fireMessage.call(self, evt);
            }
        },

        "removeItem" : function (_key, _oldValue) {
            var evt, 
                self  = this,
                DIRTY = DU + self.type + DU;

            if ( _key !== DIRTY ) {
                evt = createStorageEvent(s, STORAGE+EVENT);
                evt.initStorageEvent(
                    s, false, false, _key, _oldValue, "", location.href, null
                );
                evt.storage = storages[self.type].storage;

                if ( indexOf(restricted, _key) === -1 ) {
                    delete self[_key];
                }

                fireMessage.call(self, evt);
            }
        },

        "clear" : function () {
            var evt, 
                self = this;

            evt = createStorageEvent(s, STORAGE+EVENT);
			evt.initStorageEvent(
				s, false, false, "", "", "", location.href, null
			);
            evt.storage = storages[self.type].storage;

            fireMessage.call(self, evt);
        }
	});
	StorageListener.prototype.constructor = StorageListener;
    window.StorageListener                = StorageListener;

	return StorageListener;
});
