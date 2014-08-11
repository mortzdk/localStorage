localStorage
============

A localStorage polyfill that should make the window-object `localStorage`
available in both modern and old browser. This is done by using a lot of
different techniques, that enables persistent storage in one way or another.

# Techniques

The techniques are used in such a way that the most reliable and best solution
is tested for support first. If that technique is not available in the browser,
the next technique is tested and so forth.

If an error occures during the testing or creation of one of the techniques,
the next technique in line will be tested and used.

Below is a list of current techniques used in the polyfill. The list is ordered
by most reliable and best solution, where the first technique is the first to
be tested for.

* localStorage
* globalStorage
* userData behaviour
* Google Gears
* Flash
* Cookies

# Supported Browsers

This polyfill support a wide range of browsers. The use of the techniques above
implies that all browsers with google gears, cookies or flash enabled will
successfully implement the localStorage object. The other techniques enable
support for browsers as follows:

* localStorage
	- Chrome 4+
	- Firefox 3.5+
	- Safari 4+
	- Opera 10+
	- IE 8+
* globalStorage
	- Firefox 2 - 13
* userData behaviour
	- IE 5 - 9

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

# Exceptions

The polyfill does not handle any exceptions. Instead it just pass on the
exception to the callee-function which then can choose to catch it. For cookie
support it even throws a new exception named CookieQuotaExceeded, which simply
is thrown when the data stored is greater than what is allowed for cookies.

The best practice of handling the polyfill element is to have a try-catch
around any `setItem` call, as this method potentially will throw exceptions
when the Quota of the localStorage is full. Most browsers use the term "quota"
in one way or another in their exception name and IE simply use "Error", so to
conclude that the localStorage is full you would have to write something like:

<pre>
try {                                                           
	window.localStorage.setItem(                                     
		key,                                       
		value                                     
	);                                                          
} catch (exc) {                                                 
	if (exc.name.match(/quota/i) || exc.name === "Error") {
		alert("The localStorage is full");
	}
}
</pre>

# Dependencies

As such this polyfill has no dependencies, but to enable the use of the flash 
technique, `swfobject` must be defined as a window-object. This solution was 
chosen as `swfobject` provide the most reliable cross-browser way to insert
flash movies.

To determine when the flash movie is loaded and ready to be used, the 
localStorage polyfill creates a window-function called `swfLoaded` which is to
be invoked before use of any localStorage method. The exact way can be seen in
`index.html` in the tests folder.
