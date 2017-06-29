(function (window, document, undefined) {
	"use strict";

	var _,
	    timer;

  	QUnit.module("SessionStorage", {
  		beforeEach : function () {
			if ( window.SessionStorage.available ) {
				_ = window.SessionStorage();
                _.clear();
			}
			timer = null;
  		},
  		afterEach : function () {
			_ = timer = undefined;
  		}
  	});

	QUnit.test("length", function (assert) {
		var done = assert.async();
		assert.expect(0);

		if ( _ ) {
			assert.expect(6);
			timer = setInterval(function () {
				if ( _.isLoaded() ) {
					clearInterval(timer);
					timer = null;

					assert.equal(
						_.length,
						0,
						"Testing that the storage is empty when clear has " + 
						"been called"
					);
					_.setItem("Test1", "1");
					assert.equal(
						_.length,
						1,
						"Testing that the storage holds one item after " + 
						"adding an item"
					);
					_.setItem("Test2", "2");
					assert.equal(
						_.length,
						2,
						"Testing that the storage holds two items after " + 
						"adding another item"
					);
					_.removeItem("Test1");
					assert.equal(
						_.length,
						1,
						"Testing that the storage holds one item after " + 
						"removing one item"
					);
					_.setItem("Test1", "1");
					_.setItem("Test2", "2");
					_.setItem("Test3", "3");
					assert.equal(
						_.length,
						3,
						"Testing that the storage holds three items after " + 
						"adding two new and overriding one item"
					);
					_.removeItem("Test1");
					_.removeItem("Test2");
					_.removeItem("Test3");
					assert.equal(
						_.length,
						0,
						"Testing that the storage is empty after removing " + 
						"all items"
					);

					done();
				}
			}, 10);
		} else {
			done();
		}
	});

	QUnit.test("key(index)", function (assert) {
		var done = assert.async();
		assert.expect(0);

		if ( _ ) {
			assert.expect(8);
			timer = setInterval(function () {
				if ( _.isLoaded() ) {
					clearInterval(timer);
					timer = null;

					_.setItem("Test1", "1");
					_.setItem("Test2", "2");
					_.setItem("Test3", "3");
					assert.ok(
						_.key(0) === "Test1" || 
                        _.key(0) === "Test2" || 
                        _.key(0) === "Test3",
						"Testing index 0 of storage after 3 items is added"
					);
					assert.ok(
						_.key(1) === "Test1" || 
                        _.key(1) === "Test2" || 
                        _.key(1) === "Test3",
						"Testing index 1 of storage after 3 items is added"
					);
					assert.ok(
						_.key(2) === "Test1" || 
                        _.key(2) === "Test2" || 
                        _.key(2) === "Test3",
						"Testing index 2 of storage after 3 items is added"
					);
					_.removeItem("Test2");
					assert.ok(
						_.key(0) === "Test1" || 
                        _.key(0) === "Test3",
						"Testing index 0 of storage after one item is removed" 
					);
					assert.ok(
						_.key(1) === "Test1" || 
                        _.key(1) === "Test3",
						"Testing index 1 of storage after one item is removed" 
					);
					_.setItem("Test1", "BOO");
					assert.ok(
						_.key(0) === "Test1" || 
                        _.key(0) === "Test3",
						"Testing index 0 of storage after an item has been " + 
                        "reassigned" 
					);
					assert.ok(
						_.key(1) === "Test1" || 
                        _.key(1) === "Test3",
						"Testing index 1 of storage after one item is removed" 
					);
					_.clear();
					assert.strictEqual(
						_.key(0),
						null,
						"Testing index 0 is null as the storage is empty"
					);				

					done();
				}
			}, 10);
		} else {
			done();
		}
	});

	QUnit.test("getItem()", function (assert) {
		var done = assert.async();
		assert.expect(0);

		if ( _ ) {
			assert.expect(5);
			timer = setInterval(function () {
				if ( _.isLoaded() ) {
					clearInterval(timer);
					timer = null;

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
				}
			}, 10);
		} else {
			done();
		}
	});

	QUnit.test("setItem()", function (assert) {
		var toString, done = assert.async();
		assert.expect(0);

		if ( _ ) {
			assert.expect(4);
			timer = setInterval(function () {
				if ( _.isLoaded() ) {
					clearInterval(timer);
					timer = null;

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
                            var regexpQuota = /quota/i,
                                regexpError = /error/i;
                            return regexpQuota.test(err.name) || 
                                   regexpQuota.test(err.message) ||
                                   regexpError.test(err.name);
						},
						"Testing that SessionStorage throws exception if " + 
                        "data exceeds limit."
					);

					_.clear();

					done();
				}
			}, 10);
		} else {
			done();
		}
	});

	QUnit.test("removeItem()", function (assert) {
		var toString, done = assert.async();
		assert.expect(0);

		if ( _ ) {
			assert.expect(9);
			timer = setInterval(function () {
				if ( _.isLoaded() ) {
					clearInterval(timer);
					timer = null;

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
					assert.strictEqual(
						_.Test2,
						undefined,
						"Testing that attribute key 'Test2' has been removed"
					);
					assert.strictEqual(
						_.getItem("Test3"),
						null,
						"Testing that key 'Test3' has been removed"
					);
					assert.strictEqual(
						_.Test3,
						undefined,
						"Testing that attribute key 'Test3' has been removed"
					);
					assert.equal(
						_.length,
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
				}
			}, 10);
		} else {
			done();
		}
	});

	QUnit.test("clear()", function (assert) {
		var done = assert.async();
		assert.expect(0);

		if ( _ ) {
			assert.expect(2);
			timer = setInterval(function () {
				if ( _.isLoaded() ) {
					clearInterval(timer);
					timer = null;

					_.setItem("Test1", "1");
					_.setItem("Test2", "2");
					_.setItem("Test3", "3");
					assert.equal(
						_.length,
						3,
						"Testing that 3 items has been put into the storage"
					);
					_.clear();
					assert.equal(
						_.length,
						0,
						"Testing that the storage is empty when clear has " + 
						"been called"
					);				

					done();
				}
			}, 10);
		} else {
			done();
		}
	});

	QUnit.test("StorageEvent", function (assert) {
		var iframe, timer,
            counter    = 0,
            done       = assert.async(),
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

                if (_event.storageArea === window.localStorage) {
                    return;
                }

				if ( _event.domain ) {
                    assert.expect(10);
                    switch (counter) {
                        case 0:
                        case 1:
                        case 2:
                        case 3:
                        case 4:
                            assert.strictEqual(_event.type, "storage");
                            assert.strictEqual(_event.domain, document.domain);
                            break;
                        case 5:
                            assert.strictEqual(_event.type, "storage");
                            assert.strictEqual(_event.domain, document.domain);

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
                    assert.expect(24);
                    switch (counter) {
                        case 2:
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
                        case 3:
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
                        case 4:
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
                        case 5:
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
                        case 6:
                            assert.strictEqual(
                                _event.key, 
                                "TEST1", 
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
                                "TEST1",
                                "Tests that new value is set with correct value"
                            );
                            assert.strictEqual(
                                _event.type, 
                                "storage",
                                "Tests that type of the event is correct"
                            );
                            break;
                        case 7:
                            assert.ok(
                                _event.key === "TEST" ||
                                _event.key === "TEST1",
                                "Tests that key is a previously stored key " +
                                "since sessionStorage doesn't clear it"
                            );
                            assert.ok(
                                _event.oldValue === "TEST" ||
                                _event.oldValue === "TEST1",
                                "Tests that oldValue is a previously stored " + 
                                "value since sessionStorage doesn't clear it"
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
            };

		assert.expect(0);

		if ( _ ) {
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
            iframe.setAttribute("src", "SessionStorage.html"); 
            appendChild(document.getElementById("qunit-fixture"), iframe);

            timer = setTimeout(function () {
                clearTimeout(timer);
                timer = undefined;
                done();
            }, 1000);
		} else {
			done();
		}
   });

}(window, window.document, void(0)));
