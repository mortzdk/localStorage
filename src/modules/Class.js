/* globals isFunction:false, forEach:false, isArguments:false */
define("modules/Class", [], function () {
	"use strict";

	function Class() {} 
	Class.prototype.constructor = Class;

	Class.extend = function extend(_values) {
		var Self        = this,
			create      = Object.create,
			superClass  = Self.prototype,
			protoClass  = !!create ? create(superClass) : new Self(this);
	
		// Copy the properties over onto the new prototype
		forEach(_values, function (_value, _name) {
			// Check if we're overwriting an existing function
            if ( isFunction(_value) && isFunction(superClass[_name]) ) {
                _value.$super = superClass[_name];
            }

			protoClass[_name] = _value;
		});
	
		function Class () {
			var self = this,
			    args = arguments;

            if ( isArguments(args[0]) ) {
                args = args[0];
            }

			if ( !(self instanceof Class) ) {
				return new Class(args);
			}

			if ( args[0] !== Class && self.init ) {
				self.init.apply(self, args);
			}
		}

		Class.prototype             = protoClass;
		Class.prototype.constructor = Class;
		Class.extend                = Self.extend;

		return Class;
	};

	return Class;
});
