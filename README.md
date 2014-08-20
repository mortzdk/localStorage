localStorage
============

A localStorage polyfill that makes the window object `localStorage`
available in both modern and old browsers. This is done using a lot of
different techniques, that enables persistent synchronous storage in one way 
or another.

# How to use

To use this polyfill you simply have to include the localStorage.js file to 
your site. Furthermore you have to specify the URL of the localStorage.swf as
the `swfURL` parameter to the file source. One example could be:

<pre>
&lt;script type="text/javascript"
        src="js/localStorage-debug.js?swfURL=js/localStorage.swf"&gt;
&lt;/script&gt;
</pre>

# isLoaded

To ensure that the localStorage polyfill is fully loaded a method has been 
added to the polyfill. The method `isLoaded` on the localStorage object is 
supposed to be run before any use of the localStorage object. If the object is
an instance of the FlashStorage, the method is used to ensure that the flash
file is loaded and ready. In any other case the method will call the callback 
function immediately. If the `isLoaded` method is not available in the 
`localStorage` object, it is safe to assumme that it is the native object.

<pre>
var func = function () {
	window.localStorage.getItem("TEST");	
};

if ( window.localStorage.isLoaded ) {
	window.localStorage.isLoaded(
		func
	);
} else {
	func.call(this);
}
</pre>


# Supported Browsers

The polyfill support a wide range of browsers. The use of the techniques 
mentioned in the [Techniques](#techniques) section, implies that all browsers 
with cookies or flash enabled will successfully implement the localStorage 
object. The other techniques enable browser support as listed:

* localStorage
	- Chrome 4+
	- Firefox 3.5+
	- Safari 4+
	- Opera 10+
	- IE 8+
* globalStorage
	- Firefox 2 - 13
* userData behaviour
	- IE 5 - 10 (IE 9 and IE 10 should work, but my own - and 
	[others](http://stackoverflow.com/questions/13481817/internet-explorer-official-status-of-userdata-behavior) - 
	tests have proven otherwise)

# Tests

As per 20/08-2014 the polyfill has been tested successfully in:

* IE11 (Win7)
* IE10 (Win7)
* IE9 (Win7)
* IE8 (WinXP)
* IE7 (WinVista)
* IE6 (WinXP)
* Firefox 3 (WinXP)
* Firefox 6 (WinXP)
* Firefox 31 (Ubuntu 14.04)
* Chromium 36 (Ubuntu 14.04)
* Opera 9.0 (WinXP)
* Opera 12.16 (Ubuntu 14.04)

There has been put a lot of efford in creating 
[unit tests](https://github.com/mortzdk/localStorage/tree/v2.0/test/js/tests) 
and providing code coverage. To provide these thing the libraries QUnit and 
Blanket has been used.

# Techniques

The techniques in the polyfill are used such that the best and most 
reliable solution is tested for support first. If that technique is not 
available in the browser, the next technique is tested and so forth.

Below is a list of the techniques used in the polyfill. The list is ordered
by the best and most reliable solution first.

* localStorage
* globalStorage
* userData behavior
* Flash
* Cookies

As per version 2.0, it was decided to remove the `google gears` solution, as 
it was not possible to do any testing on that solution.

# Storage object

The original localStorage object implements the Storage interface, which looks
as follows:

<pre>
interface Storage {
	readonly attribute unsigned long length;
	[IndexGetter] DOMString key(in unsigned long index);
	[NameGetter] DOMString getItem(in DOMString key);
	[NameSetter] void setItem(in DOMString key, in DOMString data);
	[NameDeleter] void removeItem(in DOMString key);
	void clear();
};
</pre>

The polyfill object imitate the interface, which means that any of the methods
above is also available in the polyfill object, no matter what technique is
used to create the polyfill.

Furthermore as of version 2.0 the localStorage polyfill is created using Object
Oriented Programming, meaning that the localStorage object will be an instance 
of an imitated `Storage` object. 

The localStorage object is furthermore instance of one of four classes if the
object is not the native localStorage:

* GlobalStorage
* UserDataStorage
* FlashStorage
* CookieStorage

Hence it is possible to use the following features:

<pre>
localStorage instanceof Storage
localStorage instanceof GlobalStorage
localStorage instanceof UserDataStorage
localStorage instanceof FlashStorage
localStorage instanceof CookieStorage
</pre>

Each of these storages can be created by their own as well.

# Exceptions

The polyfill does not handle any exceptions. Instead it just pass on the
exception to the callee-function which then can choose to catch it. The cookie 
and flash solutions throws a new exception named CookieQuotaExceeded, 
UserDataQuotaExceeded and FlashQuotaExceeded, which are thrown when the data 
stored is greater than what is allowed for the solution.

The best practice of handling the polyfill element is to have a try-catch
around any `setItem` call, as this method potentially will throw exceptions
when the Quota of the localStorage is full. Most browsers use the term "quota"
in one way or another in their exception name or message and IE simply use 
"Error". To conclude that the localStorage is full you would have to write 
something like:

<pre>
var regexp_quota = /quota/i;

try {                                                           
	window.localStorage.setItem(                                     
		key,                                       
		value                                     
	);                                                          
} catch (exc) {                                                 
	if ( regexp_quota.test(exc.name) || 
	     regexp_quota.test(exc.message)||
	     exc.name === "Error" ) {
		alert("The localStorage is full");
	}
}
</pre>

# Dependencies

As per version 2.0, the dependency to `swfobject` has been removed. Instead it
was decided to implement the flash object creation as a part of the flash 
solution.
