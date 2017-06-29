/* globals LOCAL:false, HOST:false, DOMAIN:false, isObject:false, each:false,
           ENABLED:false, TRUE:false, restricted:false, isNull:false, DU:false,
           GLOBAL:false, indexOf:false, toWindow:false, AVAILABLE:false, 
           STORAGE:false
 */
define(
	"modules/GlobalStorage",
	["modules/StorageListener"], 
	function (StorageListener) {

	"use strict";

	var store, proto,

        DIRTY         = DU + GLOBAL + STORAGE + DU,

	    GlobalStorage = StorageListener.extend({
		"init" : (function () {
			var init = function init() {
                var self  = this,
                    dirty = !isNull(self.getItem(DIRTY));

                proto.length = proto.len = store.length - dirty;

                each(store, function (_key) {
                    if ( indexOf(restricted, _key) === -1 ) {
                        self[_key] = self.getItem(_key);
                    }
                });

                init.$super.apply(self, arguments);
            };
            return init;
		}()),

		"key" : function (_index) {
            var idx = store.length;

            each(store, function (_key, _idx) {
                if ( _key === DIRTY ) {
                    idx = _idx;
                    return false;
                }
            });
                  
			_index = _index+(idx <= _index);

		    return _index >= store.length || _index < 0 ? 
                null : store.key(_index);
		},

		"getItem" : function (_key) {
			var object = store.getItem(_key);
			if ( isObject(object) ) {
				return object.value;
			}
			return object;
		},

		"setItem" : (function () {
            var setItem = function setItem(_key, _data) {
                var self  = this,
                    old   = self.getItem(_key),
                    dirty = !isNull(self.getItem(DIRTY)) || _key === DIRTY;

                if ( old === _data ) {
                    return;
                }

                store.setItem(_key, _data);
                proto.length = proto.len = store.length-dirty;

                setItem.$super.call(self, _key, old, _data);
            };
            return setItem;
		}()),

		"removeItem" : (function () {
            var removeItem = function removeItem(_key) {
                var self  = this,
                    old   = self.getItem(_key),
                    dirty = !isNull(self.getItem(DIRTY)) || 
                            _key === DIRTY;

                store.removeItem(_key);
                proto.length = proto.len = store.length-dirty;

                removeItem.$super.call(self, _key, old);
            };
            return removeItem;
		}()),

		"clear" : (function () {
            var clear = function clear() {
                var self  = this,
                    dirty = !isNull(self.getItem(DIRTY));

                each(store, function (_key) {
                    if ( _key === DIRTY ) {
                        return;
                    }

                    store.removeItem(_key);

                    if ( indexOf(restricted, _key) === -1) {
                        delete self[_key];
                    }
                });

                proto.length = proto.len = store.length-dirty;

                clear.$super.call(self);
            };
            return clear;
		}()),

		"isLoaded" : function () {
			return true;
		},

        "type" : GLOBAL+STORAGE
	});

	if ( GLOBAL.toLowerCase() + STORAGE in window ) {
		try {
			if ( location.hostname === LOCAL + HOST ) {
				store = window.globalStorage[
					LOCAL + HOST + "." + LOCAL + DOMAIN
				];
			} else {
				store = window.globalStorage[location.hostname];
			}

			store.setItem(ENABLED, TRUE);
			GlobalStorage[AVAILABLE] = 
				(store.getItem(ENABLED).value === TRUE || 
				 store.getItem(ENABLED) === TRUE);
			store.removeItem(ENABLED);
		} catch (ignore) {
			GlobalStorage[AVAILABLE] = false;
		}
	}
    proto             = GlobalStorage.prototype;
	proto.constructor = GlobalStorage;
    toWindow(GLOBAL + STORAGE, GlobalStorage);

	return GlobalStorage;
});
