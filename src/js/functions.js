Function.prototype.method = function(name, func) {
	this.prototype[name] = func;
	return this;
};

/* Returns a new function/object with the given object as its prototype */
Object.create = function(obj) {
	var F = function() {};
	F.prototype = obj;
	return new F();
};

// Example usage:
function objects() {
	var robot = {"roboname": "Cat", "age": 1, "task": "companion"};		//prototype
	var another_robot = Object.create(robot);
	// Link is only one way (inherited) - so if add property to prototype (robot) will be added to object based on that prototype (another)
	// But if add property to another_robot won't be added to prototype (robot) 
	robot["creator"] = "morg";	
	//alert("robot.creator: " + robot.creator);		// morg
	//alert("another_robot.creator: " + another_robot.creator); // morg 
	another_robot.mobile = true; 
	//alert("another_robot.mobile: " + another_robot.mobile);	// true 
	//alert("robot.mobile: " + robot.mobile);	// undefined 

	delete another_robot.mobile;
	// Default functionalities set to false 
	robot.functionalities = {"mobility": false, "speech": false, "search": false, "vision": false};
	console.log("another's mobility? " + another_robot.functionalities.mobility);
	another_robot.functionalities.speech = true;
	console.log("another's speech? " + another_robot.functionalities.speech);

	// Delegation - if object doesn't have property, look to see if its prototype does, etc. Cascade down prototype chain 
	// TODO: example? 

	// Reflection 
	console.log("\ntypeof");
	console.log(typeof robot.roboname);				// string
	console.log(typeof robot.functionalities);		// object
	console.log(typeof robot.toString);				// function 
	
	console.log("\nhasOwnProperty");
	console.log(robot.hasOwnProperty('age'));

}

/* Turns arguments into array using slice method - basically equivalent to arr[:] */
var args_to_array = function(args) {
	if(args.length > 0) {
		return Array.prototype.slice.apply(args);	
	}
	return [];
};

/* Curry - produce a new function by combining an existing function and an argument */
Function.method("curry", function() {
	var args = args_to_array(arguments);	// arguments refers to curry's arguments 
	var that = this;

	return function() {
		var fn_args = arguments ? args_to_array(arguments) : [];
		return that.apply(null, args.concat(fn_args));		// apply function to function's arguments and curry's arguments	
	};
});

function curry_example() {
	var add = function() {
		var sum = 0;
		for(var i = 0; i < arguments.length; i++) {
			sum += arguments[i];
		}
		return sum;
	};

	var add1 = add.curry(2,3); 
	var add2 = add1(5,6);
	console.log(add2);
}


/* Generic memoization function */ 
var memoizer = function(memo, func) {
	var shell = function(n) {
		var result = memo[n];
		if(typeof result !== 'number') {
			result = func(shell, n);
			memo[n] = result;
		}
	};
	return shell;
};

function memo() {

	// Memoized fibonacci
	var fibonacci = function() {
		var memo = [0, 1];
		var fib = function(n) {
			var result = memo[n];	
			if(typeof result !== 'number') {
				var result = fib(n-1) + fib(n-2);
				memo[n] = result;	
			}
			return result;
		};
		return fib;
	}();

	var fn = function() {
		return function(x) {
			console.log(x);
		};
	}();

	console.log(fibonacci(10));

	// Using abstraction of memoization 
	var fibonacci = memoizer([0,1], function(shell, n) {
		return shell(n-1) + shell(n-2);
	});

	// Memoized factorial 
	var factorial = memoizer([1,1], function(shell, n) {
		return n*shell(n-1);
	});
}	


/* 
	Rewrite some functions -- for practice 
	There's no error handling here (or little)
*/

/* Array functions */

// is_array
function isArray(arr) {
	return arr && typeof arr === 'object' && arr.constructor === Array
	 && typeof arr.length === 'number' && typeof arr.splice === 'function'
	 && !(arr.propertyIsEnumerable('length'));	// this asks if for in produces length (which it doesn't for arrays)
};

// concat 
Array.prototype.myConcat = function(item) {
	var new_array = this.slice(0, item.length);
	if(isArray(item)) {
		var i;
		for(i = 0; i < item.length; i++) {
			new_array.push(item[i]);
		}
	}
	else new_array.push(item);
	return new_array;
};

// What's the difference? I think this is the same 
Array.method("myConcat2", function(item) {
	return this.myConcat(item);
});

// join
Array.prototype.myJoin = function(delim) {
	var str = String(this[0]);
	var i;
	for(i = 1; i < this.length; i++) {
		str += String(delim) + String(this[i]); 
	}
	return str;
};

// pop
Array.prototype.myPop = function() {
	return this.splice(this.length-1, 1)[0]
};

// push 
Array.prototype.myPush = function(item) {
	this[this.length] = item;
	return this.length;
};
Array.prototype.theirPush = function(item) {
	this.splice.apply(this, [this.length, 0].concat(Array.prototype.slice.apply(arguments)));
	return this.length;
};

// reverse - in place
Array.prototype.myReverse = function(item) {
	var even = function(n) { return n % 2 === 0; }
	var isEven = even(this.length);

	// If length is even, make odd
	if(isEven) {
		this.push("dummy");
	}

	// Switch 
	var start = 0;
	var end = this.length-1;
	var temp;
	while(start !== end) {
		temp = this[start];
		this[start] = this[end];
		this[end] = temp;
		start++;
		end--;
	}

	return isEven ? this.shift() : this;
};

// shift - removes first element and returns it
Array.prototype.myShift = function() {
	return this.splice(0, 1)[0];
};

// slice
Array.prototype.mySlice = function(start, end) {
	if(!end) end = this.length;
	if(start === 0 && end === this.length) return this;
	if(start === 0) return this.splice(end-1, this.length);
	if(end === this.length) return this.splice(0, start);
	return this.splice(0, start).concat(this.splice(end-start, this.length));
};


/* WARNING: didn't test these with duplicate elements */

// number sort
Array.prototype.numSort = function(order) {
	if(!order || order === 'asc') {
		return this.sort(function(a, b) {
			return a - b;
	});	
	} else if(order === 'desc') {
		return this.sort(function(a, b) {
			return b - a;
		});
	}
	
};

// sort any list of simple values 
Array.prototype.simpleSort = function() {
	return this.sort(function(a, b) {
		if(a === b) return 0;
		if(typeof a === typeof b) return a - b;
		// always push one type to the end 
		return typeof a < typeof b ? -1 : 1;
	});
};

// sort list of objects by key 
var by = function(key) {

	// a and b are two elements being compared in the list 
	return function(a, b) {
		if(typeof a[key] === typeof b[key]) {
			return a[key] < b[key] ? -1 : 1;
		}
		return typeof a[key] < typeof b[key] ? -1 : 1;
	}

};

// sort list of objects on multiple keys
// can pass in as many keys as you want (in arguments)

// hmm this doesn't work because recalculates everything when 
// do that.outer(keys)(a,b)
// see The Good Parts of Javascript for better function 
var by_mult = function(keys) {
	var that = this;
	that["keys"] = keys;
	that["outer"] = by_mult;
	var comparator = function(a, b) {
		var key = that.keys[0];
		if(a[key] === b[key]) {
			that.keys.shift();
			return that.outer(keys)(a, b);  
		}
		if(typeof a[key] === typeof b[key]) {
			return a[key] < b[key] ? -1 : 1;
		}
		return typeof a[key] < typeof b[key] ? -1 : 1;
	};
	return comparator;
}; 

// unshift - returns shallow copy - not how it actually works
Array.prototype.myUnshift = function(item) {
	var args = args_to_array(arguments);
	if(isArray(item)) return item.concat(args).concat(this);
	return [item].concat(args).concat(this);
};

// unshift -- real one 
// define apply in this file  
// Array.prototype.unshift_good = function() {
// 	this.splice.apply(this, [0, 0].concat(Array.prototype.slice(apply(arguments))));
// 	return this.length;
// }

/* Some more useful functions */
var isNumber = function(value) {
	return typeof value === 'number' && !isFinite(value);
};

function test_my_functions() {
	/* Array functions */
	var a = [1,2,3];
	var b = [1,2,3,4];
	var c = [1,2,3,4,5,6,7];

	// concat
	console.log(a.myConcat(1));
	console.log(a.myConcat(a));

	// join
	console.log(a.myJoin("-"));

	// pop
	console.log(a.myPop());
	console.log(a);

	// push
	console.log(a.myPush(5));
	console.log(a);
	console.log(a.theirPush(5));
	console.log(a);

	// reverse
	b.myReverse();
	console.log(b);

	// shift
	b.myShift();
	console.log(b);

	// slice
	c.mySlice(3, 6);
	console.log(c);
	c.mySlice(1);
	console.log(c);

	// number sort
	var x = [15, 4, 3, 2, 9 , 100, 8];
	console.log(x.numSort());
	console.log(x.numSort('desc'));

	// simple value sort 
	var y = [15, 4, 3, "aa", "a", 100, "bb"];
	console.log(y.simpleSort());

	// object sort 
	var olist = [{first:"gary", last:"kasparov"},
				{first:"ray", last:"kurzweil"},
				{first:"michio", last:"kaku"},
				{first:"douglas", last:"hofstatder"},
				{first:"bray", last:"kurzweil"}];
	olist.sort(by("last"));
	console.log(olist[0]);
	console.log(olist[1]);
	console.log(olist[2]);
	console.log(olist[3]);

	// object sort on multiple keys 
	// doesn't quite work 
	olist.sort(by_mult(["last", "first"]));
	
	// unshift 
	var z = y.myUnshift(4);
	var z2 = z.myUnshift('x', 'y', 'z');
	var z3 = z2.myUnshift([99, 98, 97], 96, 95);
	console.log(z3);

	y.unshift_good(99, 98);
	console.log(y);
}