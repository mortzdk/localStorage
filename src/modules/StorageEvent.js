/* globals toWindow:false, STORAGE:false, EVENT:false */
define("modules/StorageEvent", [], function () {
	"use strict";

    var StorageEvent,
        CustomEvent,

        CUSTOMEVENT = "Custom" + EVENT;

    try {
        CustomEvent = new CustomEvent(STORAGE.toLowerCase()) && 
            window.CustomEvent;
    } catch (ignore) {
        try {
            CustomEvent = document.createEvent(CUSTOMEVENT) && 
                function CustomEvent ( event, params ) {
                    var evt;

                    params = params || {
                        bubbles: false, 
                        cancelable: false, 
                        detail: undefined
                    };

                    evt = document.createEvent(CUSTOMEVENT);
                    evt.initCustomEvent(
                        event, params.bubbles, params.cancelable, params.detail
                    );
                    return evt;
                };
            CustomEvent.prototype = window.Event.prototype;
        } catch (ignore) {
            CustomEvent = undefined;
        }
    }

    if ( CustomEvent ) {
        StorageEvent = CustomEvent;
    } else {
        StorageEvent = function StorageEvent(_type) {
            var self = this;

            self.target         = null;
            self.isTrusted      = false;
            self.eventPhase     = 0;
            self.defaultPrevent = false;
            self.bubbles        = false;
            self.cancelable     = false;
            self.timeStamp      = new Date().getTime();
            self.type           = _type || "";
            self.key            = null;
            self.oldValue       = null;
            self.newValue       = null;
            self.storageArea    = null;
            self.url            = "";
        };
    }

    StorageEvent.prototype.initStorageEvent = function (_type, _bubble, 
            _cancelable, _key, _oldValue, _newValue, _url, _storageArea) {
        var self = this;

        try {
            self.type        = _type       || "";
            self.bubbles     = _bubble     || false;
            self.cancelable  = _cancelable || false;
        } catch (ignore) {}

        self.key         = _key         || null;
        self.oldValue    = _oldValue    || null;
        self.newValue    = _newValue    || null;
        self.url         = _url         || "";
        self.storageArea = _storageArea || null;
    };
    StorageEvent.prototype.constructor = StorageEvent;

    if ( !(STORAGE+EVENT in window) ) {
        toWindow(STORAGE+EVENT, StorageEvent);
    }

	return StorageEvent;
});
