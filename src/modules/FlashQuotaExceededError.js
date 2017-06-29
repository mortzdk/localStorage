define(
	[],
	function (){
		"use strict";

        var proto;

		/**
		 * An error object thrown when flash storage is exceeded.
		 * @class FlashQuotaExceededError
		 * @augments Error
		 * @param {String} _message - The message that should be assigned to 
		 * the error.
		 */
		function FlashQuotaExceededError(_message) {
			var self = this,
				err  = new Error();
			
			if ( !!err.stack ) {
				self.stack   = this.name + " at " + err.stack.match(/[^\s]+$/);
			}

			self.message = _message;
		}

		/* jshint ignore:start */
		if ( !!Object.setPrototypeOf ) {
			Object.setPrototypeOf(FlashQuotaExceededError, Error);
		} else {
			FlashQuotaExceededError.__proto__ = Error;
		}
		/* jshint ignore:end */

		FlashQuotaExceededError.prototype = "create" in Object ? 
            Object.create(Error.prototype) : new Error();

        proto             = FlashQuotaExceededError.prototype;
		proto.name        = "FlashQuotaExceededError";
		proto.message     = "";
		proto.constructor = FlashQuotaExceededError;

		return FlashQuotaExceededError;
	}
);
