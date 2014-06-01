
function closure_example() {
	var robot = function() {
		var status = '';

		return {
			set: function(str) {
				status = str;
			},
			getStatus: function() {
				return status;
			}
		};
	}();	// return the result of invocation, which is an object with two functions, set and getStatus
	// These functions have access to status 

	console.log(robot.status);	// status is private to FUNCTION, and robot is an object that only contains set and getStatus
	robot.set("searching");
	console.log(robot.getStatus());	// searching 

	// maker function 
	var Robot = function(status) {
		return {
			getStatus: function() { return status; }
		};
	};

	var myRobot = Robot("recognizing");	// capitalizing is bad practice without new 
	// getStatus has access to the parameter itself because was created in function context (closure)
	console.log(myRobot.getStatus());	// don't have to create and set a status variable 

}

/* Can build safe objects by avoiding use of this/that */
function safe_object_example() {

	// This generates unique strings
	var serial_maker = function() {
		// private variables only accessible inside this function 
		var prefix = '';
		var seq = 0;
		return {
			setPrefix: function(str) {
				prefix = String(str);
			},
			setSequence: function(num) {
				seq += num;
			},
			gensym: function() {
				seq += 1;
				var unique = prefix + seq.toString();
				return unique;
			}
		};
	};

	var sequer = serial_maker();
	sequer.setPrefix("M");
	sequer.setSequence(9034);
	var unique = sequer.gensym();
	console.log(unique);
	console.log(sequer.prefix);	//undefined
	console.log(sequer.seq);	//undefined
	var unique2 = sequer.gensym();
	console.log(unique);
}