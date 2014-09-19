(function (window, document, undefined) {
	"use strict";

	var _,
	    conditionalComment = function (_condition) {
			var div = document.createElement("div"), 
			    italics = div.getElementsByTagName("i"),
				notIE = (_condition === "if !IE");

			div.innerHTML = "<!--[" + _condition + "]>" + (notIE ? " -->" : "") +
			                "<i></i>" +
			                (notIE ? "<!--" : "") + "<![endif]-->";

			return !!italics[0];
		};

  	QUnit.module("localStorage", {
  		setup : function () {
			if ( window.localStorage && !_ ) {
				_ = window.localStorage;
			}
  		},
  		teardown : function () {
  		}
  	});

	QUnit.asyncTest("length", 0, function (assert) {
		var func = function () {
				QUnit.expect(6);

				_.clear();

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

				QUnit.start();
			};

		if ( _ ) {
			if ( _.isLoaded ) {
				_.isLoaded(func);
			} else {
				func.call(this);
			}
		} else {
			QUnit.start();
		}
	});

	QUnit.asyncTest("key(index)", 0, function (assert) {
		var func = function () {
				QUnit.expect(6);

				_.clear();

				_.setItem("Test1", "1");
				_.setItem("Test2", "2");
				_.setItem("Test3", "3");

				// If we have globalStorage as our emulated localStorage
				// we account for the order of the keys.
				// For some reason Firefox and PhantomJS put the items in 
				// the order:
				// 		Test1
				// 		Test3
				// 		Test2
				// whereas other browsers put them in the order that it was 
				// set.
				if ( window.localStorage instanceof window.GlobalStorage ||
				     ( !window.localStorage.isLoaded && 
					   window.InstallTrigger && 
					   !document.getElementById("container").outerHTML
					 ) ) {
					assert.strictEqual(
						_.key(0),
						"Test2",
						"Testing index 2 of storage after 3 items is added"
					);
					assert.strictEqual(
						_.key(1),
						"Test1",
						"Testing index 0 of storage after 3 items is added"
					);
					assert.strictEqual(
						_.key(2),
						"Test3",
						"Testing index 1 of storage after 3 items is added"
					);
				} else if ( window.InstallTrigger || 
				     		location.href.match(/(\?|&)gruntReport($|&|=)/) ) {
					assert.strictEqual(
						_.key(0),
						"Test1",
						"Testing index 0 of storage after 3 items is added"
					);
					assert.strictEqual(
						_.key(1),
						"Test3",
						"Testing index 1 of storage after 3 items is added"
					);
					assert.strictEqual(
						_.key(2),
						"Test2",
						"Testing index 2 of storage after 3 items is added"
					);
				} else {
					assert.strictEqual(
						_.key(0),
						"Test1",
						"Testing index 0 of storage after 3 items is added"
					);
					assert.strictEqual(
						_.key(1),
						"Test2",
						"Testing index 1 of storage after 3 items is added"
					);
					assert.strictEqual(
						_.key(2),
						"Test3",
						"Testing index 2 of storage after 3 items is added"
					);
				}
				_.removeItem("Test2");
				assert.strictEqual(
					_.key(1),
					"Test3",
					"Testing index 1 of storage after the item at index " + 
					"1 is removed"
				);
				_.setItem("Test1", "BOO");
				assert.strictEqual(
					_.key(0),
					"Test1",
					"Testing index 0 of storage after element in index 0 " +
					"has been reassigned"
				);
				_.clear();

				// IE throws Error on native localStorage object if key is not 
				// there.
				if ( ( conditionalComment("if lte IE 9") && 
				       !window.localStorage.isLoaded ) ||
					 ( window.InstallTrigger && 
					   !window.localStorage.isLoaded &&
					   !document.getElementById("container").outerHTML
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
						(_.key(0) === null || _.key(0) === undefined),
						"Testing index 0 is null as the storage is empty"
					);
				}

				QUnit.start();
			};

		if ( _ ) {
			if ( _.isLoaded ) {
				_.isLoaded(func);
			} else {
				func.call(this);
			}
		} else {
			QUnit.start();
		}
	});

	QUnit.asyncTest("getItem()", 0, function (assert) {
		var func = function () {
				QUnit.expect(5);

				_.clear();

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

				QUnit.start();
			};
		if ( _ ) {
			if ( _.isLoaded ) {
				_.isLoaded(func);
			} else {
				func.call(this);
			}
		} else {
			QUnit.start();
		}
	});

	QUnit.asyncTest("setItem()", 0, function (assert) {
		var func = function () {
				QUnit.expect(11);

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
					_.getItem("Test3") === "null" || 
					_.getItem("Test3") === "" ||
					_.getItem("Test3") === "[object Object]" ||
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
					_.getItem("Test7") === "[object Window]",
					"Testing that key 'Test7' holds the right value when " +
					"the data is an Object"
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

				QUnit.start();
			};

		if ( _ ) {
			if ( _.isLoaded ) {
				_.isLoaded(func);
			} else {
				func.call(this);
			}
		} else {
			QUnit.start();
		}
	});

	QUnit.asyncTest("removeItem()", 0, function (assert) {
		var func = function () {
				QUnit.expect(6);

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
					_.getItem("Test3"),
					null,
					"Testing that key 'Test3' has been removed"
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

				QUnit.start();
			};

		if ( _ ) {
			if ( _.isLoaded ) {
				_.isLoaded(func);
			} else {
				func.call(this);
			}
		} else {
			QUnit.start();
		}
	});

	QUnit.asyncTest("clear()", 0, function (assert) {
		var func = function () {
				QUnit.expect(2);

				_.clear();
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

				QUnit.start();
			};

		if ( _ ) {
			if ( _.isLoaded ) {
				_.isLoaded(func);
			} else {
				func.call(this);
			}
		} else {
			QUnit.start();
		}
	});

}(window, window.document, void(0)));
