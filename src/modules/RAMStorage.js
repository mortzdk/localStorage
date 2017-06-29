/* globals forEach:false, indexOf:false, restricted:false, toWindow:false,
           RAM:false, STORAGE:false, AVAILABLE:false, hasOwnProperty:false
 */
define(
	"modules/RAMStorage",
	["modules/StorageListener"], 
	function (StorageListener) {
	"use strict";

	var proto,
        store      = {},
		RAMStorage = StorageListener.extend({
		"init" : function () {
			var self = this;
			forEach(store, function (_val, _key) {
				if ( indexOf(restricted, _key) === -1 ) {
					self[_key] = _val;
				}
			});
            proto.length = proto.len = 0;
		},

		"key" : function (_index) {
			var item = null, 
                i    = 0;
			forEach(store, function (_value, _key) {
				if ( i === _index ) {
					item = _key;
					return false;
				}
				i += 1;
			});
			return item;
		},

		"getItem" : function (_key) {
			return hasOwnProperty.call(store, _key) ? store[_key] : null;
		},

		"setItem" : function (_key, _data) {
			if ( !hasOwnProperty.call(store, _key) ) {
				proto.length = proto.len += 1;
			} else if ( store[_key] === _data ) {
                return;
            }
			store[_key] = _data;
			if ( indexOf(restricted, _key) === -1 ) {
				this[_key] = _data;
			}
		},

		"removeItem" : function (_key) {
			if ( hasOwnProperty.call(store, _key) ) {
				if ( indexOf(restricted, _key) === -1 ) {
					delete this[_key];
				}
				delete store[_key];
				proto.length = proto.len -= 1;
			}
		},

		"clear" : function () {
			var self = this;
			forEach(store, function (_value, _key) {
				self.removeItem(_key);
			});	
		},

		"isLoaded" : function () {
			return true;
		},

        "type" : RAM+STORAGE
	});

    proto                 = RAMStorage.prototype;
	proto.constructor     = RAMStorage;
	RAMStorage[AVAILABLE] = true;
    toWindow(RAM+STORAGE, RAMStorage);

	return RAMStorage;
});
