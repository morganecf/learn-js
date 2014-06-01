
/* Array stuff */

function arrays() {
	// Can set length property of array to splice
	var arr = [1,2,3,4,5];
	console.log(arr.length);
	arr.length = 3; 		// splices this 
	console.log(arr.length);
	console.log(arr);

	// Appending 
	arr[arr.length] = 4;
	// equivalent to 
	arr.push(5);
	console.log(arr);

	// Removing elements
	delete arr[2];
	var i;
	for(i = 0; i < arr.length; i++) {	// undefined at position 2
		console.log(arr[i]);
	}
	console.log(arr);	// [1, 2, 3:4, 4:5]

	// Better way of removing
	arr = [1,2,3,4,5];
	arr.splice(2, 2);	// removes 2 elements starting at position 2 : [1, 2, 5]
	console.log(arr);

	/* Remove at single index method */
	Array.prototype.remove = function(index) {
		this.splice(index, 1);
		return this;
	};

	arr.remove(1);	
	console.log(arr);
	
	/* 
		Define an is_array function. Useful because 
		typeof array returns object. 
	*/	
	var isArray = function(arr) {
		return arr && typeof arr === 'object' && arr.constructor === Array;
	};

	/* 
		Most reliable test for an array - above doesn't
		work for arrays from another window.
	*/
	var isArray_better = function(arr) {
		return isArray(arr) && typeof arr.length === 'number' && typeof arr.splice === 'function' &&
			!(arr.propertyIsEnumerable('length'));	// this asks if for in produces length (which it doesn't for arrays)
	};

	console.log(isArray(arr));	// true
	console.log(isArray('hello')); // false

	console.log(isArray_better(arr));	//true 

	console.log(typeof null); // object - weird

	/* Reduce (fold) function */
	Array.method("reduce", function(f, start_val) {
		var i;
		var accumulated = start_val;
		for(i = 0; i < this.length; i++) {
			accumulated = f(this[i], accumulated);
		}
		return accumulated;
	});

	var sum = [1,2,3,4].reduce(function(a,b) {
		return a + b;
	}, 0);
	console.log("reduce sum : " + sum);	// 10
	var mult = [1,2,3,4].reduce(function(a,b) {
		return a*b;
	}, 1);
	console.log("reduce mult: " + mult); // 24

	/* Map function */
	Array.method("myMap", function(f) {
		var i;
		var new_array = [];
		for(i = 0; i < this.length; i++) {
			new_array.push(f(this[i]));
		}
		return new_array;
	});

	var a = [1,2,3,4].myMap(function(x) {
		return String(x);
	});
	console.log(a);

	// Array is object, so can add methods directly to one specific array
	// Add a sum method
	var e = [2,4,6,8];
	e.sum = function() {
		return this.reduce(function(a,b) { return a + b; }, 0);	
	}

	console.log(e.sum());

	/* Make function that initializes array of certain dimensinon */
	Array.dim = function(dimension, initial) {
		var a = [];
		var i;
		for(i = 0; i < dimension; i++) {
			a[i] = initial;
		}
		return a;
	};

	// example:
	var c = Array.dim(10, 0);
	console.log(c);

	/* Initialization function for double array (matrix) */
	Array.dim2 = function(xdim, ydim, initial) {
		var a = [];
		var i;
		for(i = 0; i < xdim; i++) {
			a[i] = Array.dim(ydim, initial); 
		}
		return a;
	};

	// example:
	var d = Array.dim2(5,3,0);
	console.log(d);
	console.log(d[1][1]);
	

	/* Method to make an identity matrix */
	Array.identity = function(dim) {
		var id = Array.dim2(dim, dim, 0);
		var i, j;
		for(i = 0; i < dim; i++) {
			id[i][i] = 1;
		}
		return id;
	};

	var i = Array.identity(3);
	console.log(i[0][0]);
	console.log(i[1][1]);
	console.log(i[0][1]);

}