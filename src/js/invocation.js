/* Function invocation patterns */

/* Function invocation basics: 
	No type checking (can pass any type as method)
	Number of parameters passed doesn't have to match
	overflow goes into 'arguments' 
	underflow gets assigned undefined 


/* Method invocation */
function method_invocation() {
	var robot = {"name": "Cat", "age": 1};
	// A method is a function that is property of an object
	// public method: gets its object context from this 
	robot.increment = function(inc) {
		this.age += inc ? inc : 1;			// late binding: this binding to object happens when method gets invoked 
	};

	console.log(robot.age);
	robot.increment();
	console.log(robot.age);
	robot.increment(4);
	console.log(robot.age);
}


/* Function invocation */
function fn_invocation() {
	var robot = {"name": "Cat", "age": 1};
	
	// outer function 
	robot.response = function() {
		
		// inner function's this is bound to global object 
		// so use that as workaround
		var that = this;

		// inner function
		var helper = function() {
			that.value = "meow";
		};

		helper();
	};

	robot.response();
	console.log(robot.value);	// meow 
}

/* Constructor invocation */
function constructor_invocation() {
	
	// Constructor function that makes object with status property
	var Robot = function(str) {
		this.status = str;
	};

	// Give all instances of a robot a getStatus function property
	Robot.prototype.getStatus = function() {
		return this.status;
	};

	var myRobot = new Robot("moving");
	console.log(myRobot.getStatus());

}

/* Apply and call invocation */
function apply_invocation() {
	// basic example
	var add = function(x, y) { return x + y; };
	var sum = add.apply(null, [2,3]);		// invokes add on 2 and 3 setting this to null
	var sum2 = add.call(null, 2, 3);		// same thing 
	console.log(sum);
	console.log(sum2);

	// example with object 
	var Robot = function(str) { this.status = str; };
	var myRobot = new Robot("speaking");
	Robot.prototype.getStatus = function() { return this.status; };
	console.log(myRobot.getStatus());
	var myOtherRobot = { status: "searching" };
	
	// Can apply getStatus to myOtherRobot
	var returned_status = Robot.prototype.getStatus.apply(myOtherRobot);	// set myOtherRobot as this, no arguments
	console.log(returned_status);

}

/* arguments */
function arguments_test() {
	// Enables you to write function with unspecified number of arguments 
	var add = function() {
		var sum = 0;
		for(var i = 0; i < arguments.length; i++) {
			sum += arguments[i];
		}
		return sum;
	}

	console.log(add(1,2));
	console.log(add(1,2,3,4,5,6));
}

/* this */
function this_contexts() {

	// without var, this variable is global 
	value = 0;

	obj = {};

	/* this in method invocation */
	var counter = {
		value: 0,
		increment: function() {
			this.value += 1;
		}
	}; 

	// If call function as method of object, this points to object 
	// In these cases when increment is executred this.value points to value in counter
	counter.increment();
	console.log(counter.value);	// 1
	counter["increment"]();
	console.log(counter.value);	// 2

	// If call function as standalone, this refers to global object (window in browsers)
	var inc = counter.increment;
	inc();
	console.log(counter.value);	// still 2, inc didn't work on the function's value 
	console.log(value); 	// 1, global variable 'value' was incremented instead of this_contexts' var value 
	// equivalent to doing window.value += 1

	// if didn't have value = 0 up top, adding 1 to undefined yields NaN, so console.log(value) would be NaN

	/* this with new operator */
	function response(greeting) {
		if(greeting) {
			this.resp = "hello!";
		}
		else {
			this.resp = "hello?";
		}
	}

	var R = new response("hi");
	console.log(R.resp);	// hello!
	var B = response("yo");
	//console.log(B.resp); 	// type error? 
	//console.log(resp);	// this references window/global object 

	/* Call and apply */ 
	function add(x,y) {
		this.val = x + y;
		obj = { val: 0 };
	}
	// Lets you explicitly set this to point to first argument
	// obj is global since not preceded by var
	// add.apply(obj, [1,2]);	// this now points to obj, so val in obj gets set to 3
	// console.log(obj.val);
	// add.call(obj, [5,6]);	
	// console.log(obj.val);	// 11

}