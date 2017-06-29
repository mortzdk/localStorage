/* globals navigator:false, COOKIE:false, each:false, OUTOFMEMORY:false, 
           STORAGE:false, ENABLED:false, TRUE:false, restricted:false, 
           indexOf:false, isNull:false, toWindow:false, AVAILABLE:false, 
           DU:false
*/
define(
	"modules/CookieStorage", 
	["modules/StorageListener", "modules/CookieQuotaExceededError"], 
	function (StorageListener, CookieQuotaExceededError) {
	"use strict";

	var proto,
        DIRTY   = DU + COOKIE + STORAGE + DU,
        RESET   = "; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/",
        EXPIRES = "; expires=Tue, 19 Jan 2038 03:14:07 GMT; path=/",
		getAll  = function () {
			var keys = document.cookie.replace(/\s*\=(?:.(?!;))*$/, "")
				                      .split(/\s*\=(?:[^;](?!;))*[^;]?;\s*/)
				                      .sort();
            return keys.length === 1 && keys[0] === "" ? [] : keys;
	    },
		CookieStorage = StorageListener.extend({
		"init" : (function () {
            var init = function init () {
                var self = this,
                    keys = getAll();

                // Leak keys as attributes of storage object
                each(keys, function (_key) {
                    if (indexOf(restricted, _key) === -1 && DIRTY !== _key) {
                        self[_key] = self.getItem(_key);
                    }
                });

                proto.length = proto.len = 
                    keys.length -(indexOf(keys, DIRTY) !== -1);

                init.$super.apply(self, arguments);
            };
            return init;
		}()),

		"key" : function (_index) {
			var key, keys = getAll();

			_index = _index+(indexOf(keys, DIRTY) <= _index);

			if ( _index >= keys.length || _index < 0 ) {
				return null;
			}

			key = window.unescape(keys[_index]);

			return key === "" ? null : key;
		},

		"getItem" : function (_key) {
			var item = document.cookie.indexOf(_key + "=") === -1 ? 
			    "" : window.unescape(
					document.cookie.replace(
						new RegExp(
							"(?:^|.*;\\s*)" +
							window.escape(_key).replace(/[\-\.\+\*]/g, "\\$&") +
							"\\s*\\=\\s*((?:[^;](?!;))*[^;]?).*"
						),
						"$1"
					)
				);
			return item === "" ? null : item;
		},

		"setItem" : (function () {
            var setItem = function setItem(_key, _data) {
                var self  = this,
                    dirty = !isNull(self.getItem(DIRTY)) || _key === DIRTY,
                    old   = self.getItem(_key),
                    count = 0, 
                    cook  = window.escape(_key) + "=" + window.escape(_data) + 
                        EXPIRES;

                if ( old === _data ) {
                    return;
                }

                if ( cook.length > 4093 ) {
                    throw new CookieQuotaExceededError(
                        COOKIE + STORAGE + OUTOFMEMORY
                    );
                }

                document.cookie = cook;
                count           = document.cookie.match(/\=/g);
                proto.length    = proto.len = 
                    !!count && count.length - dirty || 0;

                setItem.$super.call(self, _key, old, _data);
            };
            return setItem;
		}()),

		"removeItem" : (function () {
            var removeItem = function removeItem(_key) {
                var self     = this,
                    dirty    = !isNull(self.getItem(DIRTY)),
                    old      = self.getItem(_key),
                    count    = 0;

                document.cookie = window.escape(_key) + "=" + RESET;

                count        = document.cookie.match(/\=/g);
                proto.length = proto.len = 
                    !!count && count.length - dirty || 0;

                removeItem.$super.call(self, _key, old);
            };
            return removeItem;
		}()),

		"clear" : (function () {
            var clear = function clear () {
                var self  = this,
                    dirty = !isNull(self.getItem(DIRTY)),
                    keys  = getAll();

                each(keys, function (_key) {
                    var count;

                    document.cookie = window.escape(_key) + "=" + RESET;
                    count           = document.cookie.match(/\=/g);
                    proto.length    = proto.len = 
                        (!!count && count.length - dirty) || 0;

                    if ( indexOf(restricted, _key) === -1) {
                        delete self[_key];
                    }
                });	

                clear.$super.call(self);
            };
            return clear;
		}()),

		"isLoaded" : function () {
			return true;
		},

		"type" : COOKIE + STORAGE 
	});

	/**
	 * Determine if cookies are available
	 */
	if ( navigator.cookieEnabled ) {
		document.cookie = ENABLED + "=" + TRUE + EXPIRES;
		CookieStorage[AVAILABLE] = 
			document.cookie.indexOf(ENABLED+"=") !== -1;
		document.cookie = ENABLED + "=" + RESET;
	} else {
        CookieStorage[AVAILABLE] = false;
    }

    proto             = CookieStorage.prototype;
	proto.constructor = CookieStorage;

    toWindow(COOKIE + STORAGE, CookieStorage);

	return CookieStorage;
});
