/* globals HTML:false, HEAD:false, TITLE:false, LOCAL:false, STORAGE:false, 
           BODY:false, SCRIPT:false, TYPE:false, DOMAIN:false, protocol:false, 
           NONE:false, USERDATA:false, DIV:false, element:false, docElem:false,
           OUTOFMEMORY:false, each:false, body:false, appendChild:false, 
           isFunction:false, toWindow:false, restricted:false, indexOf:false, 
           isNull:false, DU:false, AVAILABLE:false, ONUNLOAD:false
*/
define(
	"modules/UserDataStorage",
	["modules/StorageListener", "modules/UserDataQuotaExceededError"], 
	function (StorageListener, UserDataQuotaExceededError) {
	"use strict";

	var store, attributes, AXO, owner, proto,

        DIRTY = DU + USERDATA + STORAGE + DU,

		docDomain = document.domain,
		garbage = function () {
			var gc = CollectGarbage;

			window.detachEvent(ONUNLOAD, garbage);
			AXO = owner = store = null;

			if ( isFunction(gc) ) {
				gc.call();
			}
		},
		fixKey = function (_key) {
			var forbidden = new RegExp(
				"[!\"#$%&'()*+,/\\\\:;<=>?@[\\]^`{|}~]", "g"
			);
			return _key.replace(/^d/, "___$&").replace(forbidden, "___");
		},
		conditionalComment = function (_condition) {
			var div     = element(DIV), 
			    italics = div.getElementsByTagName("i"),
				notIE   = (_condition === "if !IE");

			div.innerHTML = "<!--[" + _condition + "]>" + 
							(notIE ? " -->" : "") +
			                "<i></i>" +
			                (notIE ? "<!--" : "") + "<![endif]-->";

			return !!italics[0];
		},
        reload  = function () {
            appendChild(owner, store); 
            store.style.display = NONE;
            store.addBehavior("#default#userData");
            store.load(LOCAL+STORAGE + "_" + docDomain);
            attributes = store.XMLDocument.documentElement.attributes;
        },
        UserDataStorage = StorageListener.extend({
		"init" : (function () {
            var init = function init() {
                var self = this,
                    keys = [];

                if ( !store ) {
                    try {
                        AXO = new ActiveXObject(HTML + "file");
                        AXO.open();
                        AXO.write(
                            "<" + HTML + "><" + HEAD + "><" + TITLE + ">" + 
                            LOCAL+STORAGE + "</" + TITLE + ">" + 
                            "<" + SCRIPT + " " + TYPE + "=\"text/javascript\">"+
                            "document." + DOMAIN + " = '" + protocol + "//" + 
                            docDomain + "';" + "</" + SCRIPT + ">" +
                            "</" + HEAD + "><" + BODY + "></" + BODY + ">" + 
                            "</" + HTML + ">"
                        );
                        AXO.close();
                        owner = AXO.body;
                        store = AXO.createElement(DIV);


                        window.attachEvent(ONUNLOAD, garbage);
                    } catch (ignore) {
                        owner = body;
                        store = element(DIV);
                    }
                }

                // Reload data
                reload.call(self);

                // Leak keys as attributes of storage object
                each(attributes, function (_attribute) {
                    var key = _attribute.name;

                    keys.push(key);

                    if ( indexOf(restricted, key) === -1 && DIRTY !== key ) {
                        self[key] = self.getItem(key);
                    }
                });

                proto.length = proto.len = attributes.length - 
                    (indexOf(keys, DIRTY) !== -1);

                init.$super.apply(self, arguments);
            };
            return init;
        }()),

		"key" : function (_index) {
			var idx, 
                self   = this,
                result = null;

			try {
                // Reload data
                reload.call(self);

                idx = attributes.length;
                each(attributes, function (_attribute, _idx) {
                    if (_attribute.name === DIRTY) {
                        idx = _idx;
                        return false;
                    }
                });

			    _index = _index+(idx <= _index);

				result = _index >= attributes.length || _index < 0 ? 
                    null : attributes[_index].name;
			} catch (ignore) {}
			
			return result;
		},

		"getItem" : function (_key) {
            // Reload data
            reload.call(this);

            return store.getAttribute(fixKey(_key));
		},

		"setItem" : (function () {
            var setItem = function setItem(_key, _data) {
                var old, dirty, self = this;

                try {
                    // Reload data
                    reload.call(self);

                    dirty = !isNull(self.getItem(DIRTY)) || _key === DIRTY;
                    old   = self.getItem(_key);

                    if ( old === _data ) {
                        return;
                    }

                    store.setAttribute(fixKey(_key), _data);
                    store.save(LOCAL+STORAGE + "_" + docDomain);
                    proto.length = proto.len = attributes.length-dirty || 0;

                    setItem.$super.call(self, _key, old, _data);
                } catch (e) {
                    throw new UserDataQuotaExceededError( 
                        USERDATA + STORAGE + OUTOFMEMORY
                    );
                }
            };
            return setItem;
		}()),

		"removeItem" : (function () {
            var removeItem = function removeItem(_key) {
                var old, dirty, self = this;

                // Reload data
                reload.call(self);

                dirty = !isNull(self.getItem(DIRTY)) || _key === DIRTY;
                old = self.getItem(_key);

			    store.removeAttribute(fixKey(_key));
			    store.save(LOCAL+STORAGE + "_" + docDomain);
                proto.length = proto.len = attributes.length-dirty || 0;

                removeItem.$super.call(self, _key, old);
            };
            return removeItem;
		}()),

		"clear" : (function () {
            var clear = function clear() {
                var dirty, self = this;

                // Reload data
                reload.call(self);

                dirty = !isNull(self.getItem(DIRTY));

                each(attributes, function (_attribute) {
                    var key = _attribute.name;

                    if ( key === DIRTY ) {
                        return;
                    }

                    store.removeAttribute(fixKey(key));
                    store.save(LOCAL+STORAGE + "_" + docDomain);
                    proto.length = proto.len = attributes.length - dirty || 0;

                    if ( indexOf(restricted, key) === -1 ) {
                        delete self[key];
                    }
                });

                clear.$super.call(self);
            };
            return clear;
		}()),

		"isLoaded" : function () {
			return true;
		},

        "type" : USERDATA+STORAGE
	});

	UserDataStorage[AVAILABLE] = !!docElem && !!docElem.addBehavior && 
        conditionalComment("if lte IE 8");

    proto = UserDataStorage.prototype;
	proto.constructor = UserDataStorage;
    toWindow(USERDATA+STORAGE, UserDataStorage);

	return UserDataStorage;
});
