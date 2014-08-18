(function (window, document, undefined) {
	"use strict";

	var _,
	    timer;

  	QUnit.module("CookieStorage", {
  		setup : function () {
			if ( navigator.cookieEnabled && !_ ) {
				_ = window.CookieStorage();
			}
			timer = null;
  		},
  		teardown : function () {
			timer = undefined;
  		}
  	});

	QUnit.asyncTest("length", 0, function (assert) {
		if ( _ ) {
			QUnit.expect(6);
			timer = setInterval(function () {
				if ( _.isLoaded() ) {
					clearInterval(timer);
					timer = null;

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
				}
			}, 10);
		} else {
			QUnit.start();
		}
	});

	QUnit.asyncTest("key(index)", 0, function (assert) {
		if ( _ ) {
			QUnit.expect(6);
			timer = setInterval(function () {
				if ( _.isLoaded() ) {
					clearInterval(timer);
					timer = null;

					_.clear();

					_.setItem("Test1", "1");
					_.setItem("Test2", "2");
					_.setItem("Test3", "3");
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
					assert.strictEqual(
						_.key(0),
						null,
						"Testing index 0 is null as the storage is empty"
					);				

					QUnit.start();
				}
			}, 10);
		} else {
			QUnit.start();
		}
	});

	QUnit.asyncTest("getItem()", 0, function (assert) {
		if ( _ ) {
			QUnit.expect(5);
			timer = setInterval(function () {
				if ( _.isLoaded() ) {
					clearInterval(timer);
					timer = null;

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
				}
			}, 10);
		} else {
			QUnit.start();
		}
	});

	QUnit.asyncTest("setItem()", 0, function (assert) {
		var i, longString = "1";
		if ( _ ) {
			QUnit.expect(2);
			timer = setInterval(function () {
				if ( _.isLoaded() ) {
					clearInterval(timer);
					timer = null;

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

					for (i = 12; i > -1; i -= 1) {
						longString += longString;
					}
					
					assert.throws(
						function () {
							_.setItem("Exceed", longString);
						},
						function (err) {
							return err.name === "CookieQuotaExceeded";
						},
						"Testing that CookieStorage throws exception if data " +
						"exceeds 4093 characters."
					);

					_.clear();

					QUnit.start();
				}
			}, 10);
		} else {
			QUnit.start();
		}
	});

	QUnit.asyncTest("removeItem()", 0, function (assert) {
		if ( _ ) {
			QUnit.expect(6);
			timer = setInterval(function () {
				if ( _.isLoaded() ) {
					clearInterval(timer);
					timer = null;

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
				}
			}, 10);
		} else {
			QUnit.start();
		}
	});

	QUnit.asyncTest("clear()", 0, function (assert) {
		if ( _ ) {
			QUnit.expect(2);
			timer = setInterval(function () {
				if ( _.isLoaded() ) {
					clearInterval(timer);
					timer = null;

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
				}
			}, 10);
		} else {
			QUnit.start();
		}
	});

}(window, window.document, void(0)));
