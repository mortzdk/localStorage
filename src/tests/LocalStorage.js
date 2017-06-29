(function (window, document, undefined) {
	"use strict";

	var _,
        timeout = 3000;

  	QUnit.module("localStorage", {
  		beforeEach : function () {
			if ( "localStorage" in window ) {
				_ = window.localStorage;
			}
  		},
  		afterEach : function () {
			_ = undefined;
  		}
  	});

	QUnit.test("length", function (assert) {
		var done = assert.async(),
		    func = function () {
                // Clear any earlier data
                _.clear();

				assert.expect(6);

				assert.equal(
					_.len || _.length,
					0,
					"Testing that the storage is empty when clear has " + 
					"been called"
				);
				_.setItem("Test1", "1");
				assert.equal(
					_.len || _.length,
					1,
					"Testing that the storage holds one item after " + 
					"adding an item"
				);
				_.setItem("Test2", "2");
				assert.equal(
					_.len || _.length,
					2,
					"Testing that the storage holds two items after " + 
					"adding another item"
				);
				_.removeItem("Test1");
				assert.equal(
					_.len || _.length,
					1,
					"Testing that the storage holds one item after " + 
					"removing one item"
				);
				_.setItem("Test1", "1");
				_.setItem("Test2", "2");
				_.setItem("Test3", "3");
				assert.equal(
					_.len || _.length,
					3,
					"Testing that the storage holds three items after " + 
					"adding two new and overriding one item"
				);
				_.removeItem("Test1");
				_.removeItem("Test2");
				_.removeItem("Test3");
				assert.equal(
					_.len || _.length,
					0,
					"Testing that the storage is empty after removing " + 
					"all items"
				);

				done();
			};

		assert.expect(0);

		if ( _ ) {
			if ( _.isLoaded ) {
				_.isLoaded(func);
			} else {
				func.call(this);
			}
		} else {
			done();
		}
	});

	QUnit.test("key(index)", function (assert) {
		var done     = assert.async(),
		    contains = function(_array, _object) {
		    	var i = _array.length-1;
		    	while ( i > -1 ) {
		    		if (_array[i] === _object) {
		    			return true;
		    		}
					i -= 1;
		    	}
		    	return false;
		    },
		    func     = function () {
				var i,
				    ok   = true,
				    keys = ["Test1", "Test2", "Test3"];

                // Clear any earlier data
                _.clear();

				assert.expect(3);

				for (i = 0; i < keys.length; i+=1) {
					_.setItem(keys[i], i+1);
				}

				for (i = 0; i < _.length; i+=1) {
					if ( !contains(keys, _.key(i)) ) {
						ok = false;
						break;
					}
				}

				assert.ok(
					ok,
					"Testing that keys exists"
				);

				_.removeItem("Test2");
				keys = ["Test1", "Test3"];
				ok   = true;

				for (i = 0; i < _.length; i+=1) {
					if ( !contains(keys, _.key(i)) ) {
						ok = false;
						break;
					}
				}

				assert.ok(
					ok,
					"Testing that keys exists after one key is removed"
				);

				_.clear();

				// Old firefox version throws error if length===0 and key is 
				// called 
                // TODO: What do we do about it?
				if ( ( window.InstallTrigger && 
					   !window.localStorage.isLoaded &&
					   !document.getElementById("qunit").outerHTML
					 ) ) {
					assert.throws(
						function () {
							_.key(0);
						},
						function (err) {
							return /^error$|index_size_err/i.test(err.name);
						},
						"Testing index 0 is null as the storage is empty"
					);
				} else {
					assert.ok(
						_.key(0) === null,
						"Testing index 0 is null as the storage is empty"
					);
				}

				done();
			};

		assert.expect(0);

		if ( _ ) {
			if ( _.isLoaded ) {
				_.isLoaded(func);
			} else {
				func.call(this);
			}
		} else {
			done();
		}
	});

	QUnit.test("getItem()", function (assert) {
		var done = assert.async(),
		    func = function () {
                // Clear any earlier data
                _.clear();

				assert.expect(5);

				_.setItem("Test1", "1");
				_.setItem("Test2", "2");
				_.setItem("Test3", "3");
				assert.strictEqual(
					_.getItem("Test1"),
					"1",
					"Testing that key 'Test1' holds the right value"
				);
				assert.strictEqual(
					_.getItem("Test2"),
					"2",
					"Testing that key 'Test2' holds the right value"
				);
				assert.strictEqual(
					_.getItem("Test3"),
					"3",
					"Testing that key 'Test3' holds the right value"
				);
				_.setItem("Test2", "new 2");
				assert.strictEqual(
					_.getItem("Test2"),
					"new 2",
					"Testing that key 'Test2' holds the right value " + 
					"after reassignment"
				);				
				_.clear();
				assert.strictEqual(
					_.getItem("Test2"),
					null,
					"Testing that the key does not hold any value when " + 
					"storage is empty"
				);

				done();
			};

		assert.expect(0);

		if ( _ ) {
			if ( _.isLoaded ) {
				_.isLoaded(func);
			} else {
				func.call(this);
			}
		} else {
			done();
		}
	});

	QUnit.test("setItem()", function (assert) {
		var toString, done = assert.async(),
		    func = function () {
                // Clear any earlier data
                _.clear();

				assert.expect(13);

				toString = _.toString;
				_.setItem("toString", "testing");
				assert.strictEqual(
					_.toString,
					toString,
					"Testing that attribute key 'toString' is not " +
					"overridden since the attribute is restricted"
				);

				_.clear();

				_.setItem("Test1", "1");
				_.setItem("Test1", "2");
				_.setItem("Test1", "3");
				assert.strictEqual(
					_.getItem("Test1"),
					"3",
					"Testing that key 'Test1' holds the right value " + 
					"after multiple reassignments"
				);

				assert.strictEqual(
					_.Test1,
					"3",
					"Testing that attribute key 'Test1' holds the right " + 
					"value after multiple reassignments"
				);

				_.clear();

				_.setItem("Test1", {});
				_.setItem("Test2", true);
				_.setItem("Test3", null);
				_.setItem("Test4", [1,2,3]);
				_.setItem("Test5", 2);
				_.setItem("Test6", function () {});
				_.setItem("Test7", undefined);
				_.setItem("Test8", new Error("test"));
				_.setItem("Test9", arguments);

				assert.strictEqual(
					_.getItem("Test1"),
					"[object Object]",
					"Testing that key 'Test1' holds the right value when " +
					"the data is an Object"
				);
				assert.ok(
					_.getItem("Test2") === "true" ||
					_.getItem("Test2") === "[object Boolean]",
					"Testing that key 'Test2' holds the right value when " +
					"the data is an Boolean"
				);
				assert.ok(
					_.getItem("Test3") === null || 
					_.getItem("Test3") === "null" || 
					_.getItem("Test3") === "" ||
					_.getItem("Test3") === "[object Object]" ||
					_.getItem("Test3") === "[object Null]" ||
					_.getItem("Test3") === "[object Window]",
					"Testing that key 'Test3' holds the right value when " +
					"the data is a Null"
				);
				assert.ok(
					_.getItem("Test4") === "1,2,3" ||
					_.getItem("Test4") === "[object Array]",
					"Testing that key 'Test4' holds the right value when " +
					"the data is an Array"
				);
				assert.ok(
					_.getItem("Test5") === "2" ||
					_.getItem("Test5") === "[object Number]",
					"Testing that key 'Test5' holds the right value when " +
					"the data is a Number"
				);
				assert.ok(
					/^function(%20?)%28%29(%20?)%7B(.*)%7D$/.test(
						window.escape(_.getItem("Test6"))
					) || _.getItem("Test6"),
					"Testing that key 'Test6' holds the right value when " +
					"the data is an Function"
				);
				assert.ok(
					_.getItem("Test7") === "undefined" ||
					_.getItem("Test7") === "[object Object]" ||
					_.getItem("Test7") === "[object Undefined]" ||
					_.getItem("Test7") === "[object Window]",
					"Testing that key 'Test7' holds the right value when " +
					"the data is undefined"
				);
				assert.ok(
					_.getItem("Test8") === "Error: test" ||
					_.getItem("Test8") === "[object Error]",
					"Testing that key 'Test8' holds the right value when " +
					"the data is an Error"
				);
				assert.ok(
					/\[object (Arguments|Object)\]/.test(_.getItem("Test9")),
					"Testing that key 'Test9' holds the right value when " +
					"the data is an Arguments"
				);

				_.clear();

				assert.throws(
					function () {
						var bool = true, 
						    longString = "1";
						while (bool) {
							try {
								longString += longString;
								_.setItem("Quota", longString);
								_.removeItem("Quota");
							} catch (e) {
								bool = false;
								throw {
									"name" : e.name,
									"message" : e.message
								};
							}
						}
					},
					function (err) {
						return /quota|error/i.test(err.name) ||
							   /quota/i.test(err.message);
					},
					"Testing that localStorage throws exception if data " +
					"exceeds limit."
				);

				_.clear();

				done();
			};

		assert.expect(0);

		if ( _ ) {
			if ( _.isLoaded ) {
				_.isLoaded(func);
			} else {
				func.call(this);
			}
		} else {
			done();
		}
	});

	QUnit.test("removeItem()", function (assert) {
		var toString, done = assert.async(),
		    func = function () {
                // Clear any earlier data
                _.clear();

				assert.expect(9);

				toString = _.toString;
				_.removeItem("toString");
				assert.strictEqual(
					_.toString,
					toString,
					"Testing that attribute key 'toString' is not " +
					"removed since the attribute is restricted"
				);

				_.clear();
				_.setItem("Test1", "1");
				_.setItem("Test2", "2");
				_.setItem("Test3", "3");
				_.removeItem("Test2");
				_.removeItem("Test3");
				
				assert.strictEqual(
					_.getItem("Test1"),
					"1",
					"Testing that key 'Test1' holds the right value"
				);
				assert.strictEqual(
					_.getItem("Test2"),
					null,
					"Testing that key 'Test2' has been removed"
				);
				assert.ok(
					(_.Test2 === undefined || _.Test2 === null),
					"Testing that attribute key 'Test2' has been removed"
				);
				assert.strictEqual(
					_.getItem("Test3"),
					null,
					"Testing that key 'Test3' has been removed"
				);
				assert.ok(
					(_.Test3 === undefined || _.Test3 === null),
					"Testing that attribute key 'Test3' has been removed"
				);
				assert.equal(
					_.len || _.length,
					1,
					"Testing length is one as 2 of 3 items has been removed"
				);
				_.setItem("Test2", "new 2");
				_.removeItem("Test1");
				_.removeItem("Test1");
				assert.strictEqual(
					_.getItem("Test2"),
					"new 2",
					"Testing that key 'Test2' holds the right value " + 
					"after reassignment"
				);
				assert.strictEqual(
					_.getItem("Test1"),
					null,
					"Testing that key 'Test1' has been removed"
				);
				_.clear();

				done();
			};

		assert.expect(0);

		if ( _ ) {
			if ( _.isLoaded ) {
				_.isLoaded(func);
			} else {
				func.call(this);
			}
		} else {
			done();
		}
	});

	QUnit.test("clear()", function (assert) {
		var done = assert.async(),
			func = function () {
                // Clear any earlier data
                _.clear();

				assert.expect(2);

				_.setItem("Test1", "1");
				_.setItem("Test2", "2");
				_.setItem("Test3", "3");
				assert.equal(
					_.len || _.length,
					3,
					"Testing that 3 items has been put into the storage"
				);
				_.clear();
				assert.equal(
					_.len || _.length,
					0,
					"Testing that the storage is empty when clear has " + 
					"been called"
				);				

				done();
			};

		assert.expect(0);

		if ( _ ) {
			if ( _.isLoaded ) {
				_.isLoaded(func);
			} else {
				func.call(this);
			}
		} else {
			done();
		}
	});

	QUnit.test("StorageEvent", function (assert) {
		var iframe, timer,
            counter     = 0,
            number      = 4,
            done        = assert.async(),
            appendChild = function (_parent, _child) {
                _parent.insertBefore(
                    _child, 
                    _parent.lastChild ? 
                    _parent.lastChild.nextSibling : 
                    _parent.lastChild
                );
            },
            checkEvent = function (_event) {
                clearTimeout(timer);
                timer = undefined;

                if (counter === 0 && _event.key !== "TEST" && !_event.domain) {
                    if ( !window.localStorage.isLoaded ) {
                        number -= 2;
                    }

                    if ( window.sessionStorage ) {
                        number -= 2;
                    }
                }

                // Old firefox doesn't set oldValue, newValue and key
				if ( _event.domain ) {
                    assert.expect(10);
                    switch (counter) {
                        case 4-number:
                        case 5-number:
                        case 6-number:
                        case 7-number:
                            assert.strictEqual(
                                _event.type, 
                                "storage",
                                "Tests that type of the event is correct"
                            );
                            assert.strictEqual(
                                _event.domain, 
                                document.domain,
                                "Tests that the domain is correct"
                            );
                            break;
                        case 8-number:
                            assert.strictEqual(
                                _event.type, 
                                "storage",
                                "Tests that type of the event is correct"
                            );
                            assert.strictEqual(
                                _event.domain, 
                                document.domain,
                                "Tests that the domain is correct"
                            );

                            // Remove listener
                            if ( "removeEventListener" in window ) {
                                window.removeEventListener(
                                    "storage", checkEvent, false
                                );
                            } else {
                                window.detachEvent(
                                    "onstorage", checkEvent
                                );
                            }

                            done();
                            break;
                    }
                } else {
                    assert.expect(20);
                    switch (counter) {
                        case 4-number:
                            assert.strictEqual(
                                _event.key, 
                                "TEST", 
                                "Tests that key attribute of event has " + 
                                "correct value"
                            );
                            assert.ok(
                                _event.oldValue === null || 
                                _event.oldValue === "",
                                "Tests that old value is empty"
                            );
                            assert.strictEqual(
                                _event.newValue, 
                                "123",
                                "Tests that new value is set with correct value"
                            );
                            assert.strictEqual(
                                _event.type, 
                                "storage",
                                "Tests that type of the event is correct"
                            );
                            break;
                        case 5-number:
                            assert.strictEqual(
                                _event.key, 
                                "TEST", 
                                "Tests that key attribute of event has " + 
                                "correct value"
                            );
                            assert.strictEqual(
                                _event.oldValue, 
                                "123",
                                "Tests that the oldValue is the old value of " +
                                "the object"
                            );
                            assert.strictEqual(
                                _event.newValue, 
                                "456",
                                "Tests that new value is set with correct value"
                            );
                            assert.strictEqual(
                                _event.type, 
                                "storage",
                                "Tests that type of the event is correct"
                            );
                            break;
                        case 6-number:
                            assert.strictEqual(
                                _event.key, 
                                "TEST", 
                                "Tests that key attribute of event has " + 
                                "correct value"
                            );
                            assert.strictEqual(
                                _event.oldValue, 
                                "456",
                                "Tests that the oldValue is the old value of " +
                                "the object"
                            );
                            assert.ok(
                                _event.newValue === null ||
                                _event.newValue === "",
                                "Tests that the newValue is empty since item " +
                                "was removed"
                            );
                            assert.strictEqual(
                                _event.type, 
                                "storage",
                                "Tests that type of the event is correct"
                            );
                            break;
                        case 7-number:
                            assert.strictEqual(
                                _event.key, 
                                "TEST", 
                                "Tests that key attribute of event has " + 
                                "correct value"
                            );
                            assert.ok(
                                _event.oldValue === null || 
                                _event.oldValue === "",
                                "Tests that old value is empty"
                            );
                            assert.strictEqual(
                                _event.newValue, 
                                "TEST",
                                "Tests that new value is set with correct value"
                            );
                            assert.strictEqual(
                                _event.type, 
                                "storage",
                                "Tests that type of the event is correct"
                            );
                            break;
                        case 8-number:
                            assert.ok(
                                _event.key === "" || _event.key === null,
                                "Tests that key is empty since storage has " + 
                                "been cleared"
                            );
                            assert.ok(
                                _event.oldValue === null || 
                                _event.oldValue === "",
                                "Tests that old value is empty since storage " +
                                "has been cleared"
                            );
                            assert.ok(
                                _event.newValue === null ||
                                _event.newValue === "",
                                "Tests that new value is empty since storage " +
                                "has been cleared"
                            );
                            assert.strictEqual(
                                _event.type, 
                                "storage",
                                "Tests that type of the event is correct"
                            );

                            // Remove listener
                            if ( "removeEventListener" in window ) {
                                window.removeEventListener(
                                    "storage", checkEvent, false
                                );
                            } else {
                                window.detachEvent(
                                    "onstorage", checkEvent
                                );
                            }

                            done();
                            break;
                    }
                }
                
                counter+=1;
            },
            func = function () {
                _.clear();

                window.addListener = function () {
                    if ( "addEventListener" in window ) {
                        window.addEventListener(
                            "storage", checkEvent, false
                        );
                    } else {
                        window.attachEvent(
                            "onstorage", checkEvent
                        );
                    }
                };

                iframe = document.createElement("iframe");
                iframe.setAttribute("src", "LocalStorage.html"); 
                appendChild(document.getElementById("qunit-fixture"), iframe);

                timer = setTimeout(function () {
                    clearTimeout(timer);
                    timer = undefined;
                    done();
                }, timeout);
            };

		assert.expect(0);

		if ( _ ) {
            if ( _.isLoaded ) {
                _.isLoaded(func);
            } else {
                func();
            }
		} else {
			done();
		}
	});

}(window, window.document, void(0)));
