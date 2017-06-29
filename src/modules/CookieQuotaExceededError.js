define(
	[],
	function (){
		"use strict";

        var proto;

		/**
		 * An error object thrown when cookie storage is exceeded.
		 * @class CookieQuotaExceededError
		 * @augments Error
		 * @param {String} _message - The message that should be assigned to 
		 * the error.
		 */
		function CookieQuotaExceededError(_message) {
			var self = this,
				err  = new Error();
			
			if ( !!err.stack ) {
				self.stack   = this.name + " at " + err.stack.match(/[^\s]+$/);
			}

			self.message = _message;
		}

		/* jshint ignore:start */
		if ( !!Object.setPrototypeOf ) {
			Object.setPrototypeOf(CookieQuotaExceededError, Error);
		} else {
			CookieQuotaExceededError.__proto__ = Error;
		}
		/* jshint ignore:end */

		CookieQuotaExceededError.prototype = "create" in Object ? 
            Object.create(Error.prototype) : new Error();

        proto             = CookieQuotaExceededError.prototype;
		proto.name        = "CookieQuotaExceededError";
		proto.message     = "";
		proto.constructor = CookieQuotaExceededError;

		return CookieQuotaExceededError;
	}
);
