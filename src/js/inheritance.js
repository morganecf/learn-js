/* Inheritance and prototypes */

Function.prototype.method = function(name, func) {
	this.prototype[name] = func;
	return this;
};

/* Define new as function rather than operator */
Function.method("new", function() {
	// Create new object that inherits from its prototype 
	var that = Object.create(this.prototype);

	// Invoke constructor and bind this to new object 
	var other = this.apply(that, arguments);

	return (typeof other === 'object' && other) || that;
});

/* "class"-based inheritance */
function robot_classes() {
	// Define a robot constructor 
	var Robot = function(name) {
		this.name = name;
		this.age = 0;
		this.actions = {"ambulate": false, "speak": false, "purr":false}
	};
	// Augment robot prototype with additional methods 
	Robot.prototype.getName = function() {
		return this.name;
	};
	Robot.prototype.age = function() {
		return this.age;
	};
	Robot.prototype.setAge = function(age) {
		this.age = age;
	};
	Robot.prototype.getCreator = function() {
		return this.creator || "No creator";
	}
	Robot.prototype.all_actions = function() {
		return Object.keys(this.actions);
	};
	Robot.prototype.enabled_actions = function() {
		var that = this;
		return Object.keys(this.actions).filter(function(key) {
			return that.actions[key];
		});
	};
	Robot.prototype.num_enabled_actions = function() {
		return this.enabled_actions().length;
	};
	Robot.prototype.assign_action = function(action) {
		this.actions[action] = true;
	};

	var catRobot = new Robot("Cat");
	console.log(catRobot.getName());
	console.log(catRobot.getCreator());
	console.log(catRobot.all_actions());
	console.log(catRobot.enabled_actions());
	console.log(catRobot.num_enabled_actions());
	catRobot.assign_action("ambulate");
	console.log(catRobot.all_actions());
	console.log(catRobot.num_enabled_actions());
	catRobot.assign_action("meow");
	console.log(catRobot.all_actions());
	console.log(catRobot.num_enabled_actions());

	// Define inherits method, i.e. prototype is the parent object
	Function.method("inherits", function(Parent) {
		this.prototype = new Parent();
		return this;
	});

	// Create a drone class that inherits from robot 
	var Drone = function(name) {
		this.name;
		// cascading style enabled by returning this 
	}.inherits(Robot).method("setVelocity", function(velocity) {
		this.velocity = velocity;
	}).method("getVelocity", function() {
		return this.velocity || 0;
	});

	var flyingCat = new Drone("Cat Drone");
	console.log(flyingCat.getVelocity());
	flyingCat.setVelocity(30);
	console.log(flyingCat.getVelocity());

	// ^^ problem with above construction is that there is no privacy
	// there is no access to super methods 
	// if forget new things get fucked up -- this gets bound to global object

}

/* Returns a new function/object with the given object as its prototype */
Object.create = function(obj) {
	var F = function() {};
	F.prototype = obj;
	return new F();
};

/* Define method property of object -- this doesn't work?? */
Object.prototype.method = function(name, func) {
	this.prototype[name] = func;
	return this;
}


/* 	pure prototypal inheritance does away with notion of classes
	and only uses objects 
*/
function robot_prototypes() {
	var robot = {
		name: "Cat",
		getName: function() {
			return this.name;
		},
		actions: {
			"speak": false,
			"roam": false,
			"purr": false
		},
		creator: "Morgane",
		age: 1,
		getCreator: function() {
			return this.creator;
		},
		enable_action: function(action) {
			this.actions[action] = true;
		},
		add_action: function(action) {
			action.replace(" ", "_");
			this.actions[action] = false;
			this.create_action_fn(action);
		},
		create_action_fn: function(action) {
			var that = this;
			this[action] = function() {
				that.actions[action] = true;
			};
		},	// this creates functions like the ones below on the fly
		speak: function() { this.actions['speak'] = true; },
		roam: function() { this.actions['roam'] = true; },
		purr: function() { this.actions['purr'] = true; },
		disable_action: function(action) {
			if(this.actions[action] === 'bool') {
				this.actions[action] = false;
			}
			else {
				console.log("Action " + action + " does not exist");
			}
		},
		all_actions: function() {
			return Object.keys(this.actions);
		},
		enabled_actions: function() {
			var that = this;
			return Object.keys(this.actions).filter(function(key) {
				return that.actions[key];
			});
		},
		num_enabled_actions: function() {
			return this.enabled_actions.length;
		},
		num_actions: function() {
			return this.actions.length;
		},
		reset_actions: function() {
			if(this.num_enabled_actions == 0) return;
			var that = this;
			Object.keys(this.actions).forEach(function(key) {
				that.actions[key] = false;
			});
		}
	};

	console.log(robot.all_actions());
	robot.add_action("catch_mouse");
	console.log(robot.all_actions());
	console.log(robot.enabled_actions());
	robot.catch_mouse();
	console.log(robot.enabled_actions());

	console.log('\n');

	// Differential inheritance: customize a new object by specifying differences 
	var robot2 = Object.create(robot); // inherits all properties from robot (robot is prototype)
	robot2.name = "CatFriend";
	robot2.reset_actions();
	robot2.color_vision = true;	// Add new property 
	console.log(robot2.enabled_actions());
	console.log(robot2.name);
	console.log(robot2.age);
	console.log(robot2.all_actions());
	robot2.add_action("nuzzle");
	robot2.nuzzle();
	console.log(robot2.enabled_actions());

	console.log(robot.enabled_actions());	// interesting... prototype changes? shouldn't happen 
}

/* Define a super method on object */
Object.method('superr', function(name) {
	var that = this;
	var method = that[name];
	return function() {
		return method.apply(that, arguments);
	};
});

/* Functional-based inheritance */
function robot_functional() {

	var robot = function(spec) {
		var that = {};		// that contains functions that will be able to be accessed 
		var fields = {};	// fields is private and won't be returned, privatizing things like actions
		fields["actions"] = spec.actions || {"speak":false, "ambulate": false};
		that.getName = function() {
			return spec.name || '';
		};
		that.all_actions = function() {
			return Object.keys(fields.actions);
		};
		that.enabled_actions = function() {
			return Object.keys(fields.actions).filter(function(key) {
				fields.actions[key]
			});
		};
		that.num_enabled_actions = function() {
			return that.enabled_actions().length;		// makes use of that -- bad?
		}
		that.add_action = function(action) {
			fields.actions[action] = false;
		};
		return that;
	}; 

	var myRobot = robot({name:"Cat"});
	console.log(myRobot.getName());
	console.log(myRobot.all_actions());

	var drone = function(spec) {
		var that = robot(spec);		// inherit from robot

		// super getName function 
		var super_getName = that.superr('getName');
		that.getName = function() {
			return super_getName() + ':Drone';	
		}

		that.velocity = function() {
			return spec.velocity || 0;
		};

		that.add_action("fly");
		
		return that;
	};

	var myDrone = drone({name:"CatDrone"});
	console.log(myDrone.getName());
	console.log(myDrone.all_actions());	// has fly as action
	console.log(myRobot.all_actions());	// doesn't have fly as action 

}



