function exceptionhandling() {

	// Throwing exceptions 
	var add = function() {
		if(arguments.length <= 1) {
			throw {
				name: "TypeError",
				message: "add needs at least two numbers"
			};
		}
		var sum = 0;
		for(var i = 0; i < arguments.length; i++) {
			if(typeof arguments[i] !== 'number') {
				throw {
					name: "TypeError",
					message: "add only takes numbers"
				};
			}
			sum += arguments[i];
		}
		return sum;
	};

	// Handling exceptions
	try {
		var answer = add();
	} catch(e) {	// each try can only have one catch block 
		console.log(e.name + ": " + e.message);
	}

	try {
		var answer = add(1, "cat");
	} catch(e) {
		console.log(e.name + ": " + e.message);
	}

	try {
		var answer = add(1,2,3);
	} catch(e) {
		console.log(e.name + ": " + e.message);
	}

}