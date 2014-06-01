

/* Write hello world to document */
function writeHelloWorld() {
	document.writeln("hello world!");
}

function grammarThings() {
	var upperCat = 'cat'.toUpperCase();
	var conCat = 'c' + 'a' + 't';


	// var defines this function's private variables
	var privateVariable = 4;
	publicVariable = 5;

	// else/if shortcut
	var x = truthy(3) ? 3 : 0;
}

/* variables that evaluate to false */
function truthy(elem) {
	if(elem) return true;
	else return false;
}

function testTruthy() {
	// False-y elements
	alert("'' " + truthy(''));
	alert("false " + truthy(false));
	alert("null " + truthy(null));
	alert("undef " + truthy(undefined));
	alert("NaN " + truthy(NaN));
	alert("0 " + truthy(0));

	alert("T(false) == T(null) " + (truthy(false) == truthy(null)));
	alert("T(false === T(null) " + (truthy(false) === truthy(null)));
	alert("false == null " + (false == null));
	alert("false === null " + (false === null));

	alert("false !== null " + (false !== null));
	alert("false != null " + (false != null));

	// Truthy elements - everything else
	alert(truthy('0'));
	alert(truthy(true));
	alert(truthy('cat'));
	alert(truthy([1,2,3]));
	alert(truthy('zero'));
}

/* Enumeration allows you to enumerate through all the properties of an object 
** Use for(i =0 ...) if want to avoid dredging up items from prototype chain and get things in correct order 
*/
function enumerate(object) { 
	for(name in object) {
		if(typeof object[name] === 'object') {
			enumerate(object[name]);
		}
		console.log(name + ": " + object[name]);
	}
}

function enumerateTest() {
	var robot = {"roboname": "Cat", "age": 1, "task": "companion"};
	var functionalities = {"mobility": true, "speech": true, "vision": true, "search": false};
	robot.functionalities = functionalities;
	enumerate(robot);
}