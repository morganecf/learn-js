/* Augment objects with useful functions */


// this method called method is now available to all functions 
// so now don't have to type name of prototype property 
Function.prototype.method = function(name, func) {
	if(!this.prototype[name]) {
		this.prototype[name] = func;	
	}
};

/* Example usages */

// Remove spaces from end of string  
String.method('trim', function() {
	return this.replace(/^\s+|\s+$/g, '');
});

// Reverse a string 
String.method('reverse', function() {
	var reversed = '';
	for(var c = this.length; c >= 0; c--) {
		reversed += this.charAt(c);
	}
	return reversed;
});

// See if string is anagram of another
String.method('anagram', function(other_string) {
	if(other_string.length !== this.length) return false;

	var alphabet = {};

	for(var i = 0; i < other_string.length; i++) {
		var c = other_string.charAt(i);
		alphabet[c] = 1;
	}

	for(var i = 0; i < this.length; i++) {
		var c = this.charAt(i);
		if(!alphabet.c) return false;
	}
	return true;
});

String.method('palindrome1', function() {
	var reversed = this.reverse();
	return reversed.toString() === this.toString();
});

String.method('palindrome2', function() {
	var str = this.toLowerCase();
	var start = 0;
	var end = str.length-1;
	while(start != end) {
		if(str.charAt(start) !== str.charAt(end)) return false;
		start++;
		end--;
	}
	return true;
});

String.method('remove_entities', function() {
	var entities = {quot:'"', lt: '<', gt: '>'};	// only the remove_entities method has access to entities variable 

	return function() {
		return this.replace(/&([^&;]+);/g, function(a, b) {
			var replacement = entity[b];
			return replacement ? replacement : a;
		});
	};
}());	// evaluates function(), returning this.replace(...) function 

function test_string_methods() {
	// trim
	console.log("   trim me  ".trim());
	// reverse
	console.log("reverse me".reverse());
	// anagram
	console.log("cat".anagram("act"));
	console.log("cat".anagram("lax"));
	// palindrome
	console.log("able was i ere i saw elba".palindrome1());
	console.log("able was i here i saw elba".palindrome1());
	console.log("able was i ere i saw elba".palindrome2());
	console.log("able was i here i saw elba".palindrome2());

}