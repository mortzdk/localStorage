/* globals each:false, ENABLED:false, TRUE:false, restricted:false, DU:false,
           isNull:false, indexOf:false, toWindow:false, SESSION:false, 
           STORAGE:false, AVAILABLE:false 
 */
define(
	"modules/SessionStorage",
	["modules/StorageListener"], 
	function (StorageListener) {

	"use strict";

	var store, proto,

        DIRTY           = DU + SESSION+STORAGE + DU,

	    SessionStorage = StorageListener.extend({
		"init" : function () {
            var self  = this,
                dirty = !isNull(self.getItem(DIRTY));

            proto.length = proto.len = store.length - dirty;

            each(store, function (_key) {
                if ( indexOf(restricted, _key) === -1 ) {
                    self[_key] = self.getItem(_key);
                }
            });
		},

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
			return store.getItem(_key);
		},

		"setItem" : function (_key, _data) {
            var self  = this,
                old   = self.getItem(_key),
                dirty = !isNull(self.getItem(DIRTY)) || _key === DIRTY;

            if ( old === _data ) {
                return;
            }

            store.setItem(_key, _data);
            proto.length = proto.len = store.length-dirty;

            if ( indexOf(restricted, _key) === -1 ) {
                self[_key] = _data;
            }
		},

		"removeItem" : function (_key) {
            var self  = this,
                dirty = !isNull(self.getItem(DIRTY)) || _key === DIRTY;

            store.removeItem(_key);
            proto.length = proto.len = store.length-dirty;

            if ( indexOf(restricted, _key) === -1 ) {
                delete self[_key];
            }
		},

		"clear" : function () {
            var self  = this,
                dirty = !isNull(self.getItem(DIRTY));

            each(store, function (_key) {
                if ( _key === DIRTY ) {
                    return;
                }

                store.removeItem(_key);
                proto.length = proto.len = store.length-dirty;

                if ( indexOf(restricted, _key) === -1) {
                    delete self[_key];
                }
            });
        },

		"isLoaded" : function () {
			return true;
		},

        "type" : SESSION+STORAGE
	});

	if ( SESSION.toLowerCase() + STORAGE in window ) {
		try {
			store = window.sessionStorage;
			store.setItem(ENABLED, TRUE);
			SessionStorage[AVAILABLE] = 
                (store.getItem(ENABLED).value === TRUE ||
                 store.getItem(ENABLED)       === TRUE);
			store.removeItem(ENABLED);
		} catch (ignore) {
            console.log(ignore);
			SessionStorage[AVAILABLE] = false;
		}
	}
    proto             = SessionStorage.prototype;
	proto.constructor = SessionStorage;
    toWindow(SESSION+STORAGE, SessionStorage);

	return SessionStorage;
});
