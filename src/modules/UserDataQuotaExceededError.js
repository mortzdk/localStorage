define(
	[],
	function (){
		"use strict";

        var proto;

		/**
		 * An error object thrown when flash storage is exceeded.
		 * @class UserDataQuotaExceededError
		 * @augments Error
		 * @param {String} _message - The message that should be assigned to 
		 * the error.
		 */
		function UserDataQuotaExceededError(_message) {
			var self = this,
				err  = new Error();
			
			if ( !!err.stack ) {
				self.stack   = this.name + " at " + err.stack.match(/[^\s]+$/);
			}

			self.message = _message;
		}

		/* jshint ignore:start */
		if ( !!Object.setPrototypeOf ) {
			Object.setPrototypeOf(UserDataQuotaExceededError, Error);
		} else {
			UserDataQuotaExceededError.__proto__ = Error;
		}
		/* jshint ignore:end */

		UserDataQuotaExceededError.prototype = "create" in Object ? 
            Object.create(Error.prototype) : new Error();

        proto             = UserDataQuotaExceededError.prototype;
		proto.name        = "UserDataQuotaExceededError";
		proto.message     = "";
		proto.constructor = UserDataQuotaExceededError;

		return UserDataQuotaExceededError;
	}
);
