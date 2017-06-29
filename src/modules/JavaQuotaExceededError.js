define(
	[],
	function (){
		"use strict";

        var proto;

		/**
		 * An error object thrown when flash storage is exceeded.
		 * @class JavaQuotaExceededError
		 * @augments Error
		 * @param {String} _message - The message that should be assigned to 
		 * the error.
		 */
		function JavaQuotaExceededError(_message) {
			var self = this,
				err  = new Error();
			
			if ( !!err.stack ) {
				self.stack   = this.name + " at " + err.stack.match(/[^\s]+$/);
			}

			self.message = _message;
		}

		/* jshint ignore:start */
		if ( !!Object.setPrototypeOf ) {
			Object.setPrototypeOf(JavaQuotaExceededError, Error);
		} else {
			JavaQuotaExceededError.__proto__ = Error;
		}
		/* jshint ignore:end */

		JavaQuotaExceededError.prototype = "create" in Object ? 
            Object.create(Error.prototype) : new Error();

        proto             = JavaQuotaExceededError.prototype;
		proto.name        = "JavaQuotaExceededError";
		proto.message     = "";
		proto.constructor = JavaQuotaExceededError;

		return JavaQuotaExceededError;
	}
);
