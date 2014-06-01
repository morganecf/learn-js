
/* Element fade function */
var fade = function(node) {
	var level = 1;
	var step = function() {
		console.log("in step");
		var hex = level.toString(16);
		node.style.background = "#FFFF" + hex + hex;
		if(level < 15) {
			level += 1;
			setTimeout(step, 100);
		}
	};

	// setTimeout invokes step function after 100 ms
	setTimeout(step, 100);
};


/* Supposed to add event handler function to each node
and display node number. But instead displays number of nodes. 
Handler functions are bound to i, rather than i at time handler was made. 
*/
var add_handlers = function(nodes) {
	var i;	// event handler functions bound to this, not i of the time 
	for(i = 0; i < nodes.length; i++) {
		nodes[i].onclick = function(e) {
			console.log(i);
		};
	}
};

/* Same as above but correct */
var add_handlers2 = function(nodes) {
	var i;
	for(i = 0; i < nodes.length; i++) {
		nodes[i].onclick = function(index) {
			return function(e) {
				alert(e);
			};
		}(i);	// returns the result of invoking a function with current i
				// that function returns an event handler function 
	}
}

/* 
	Function that adds simple event processing features (fire, on) to any object 
	Usage: eventuality(any_object)
	any_object gets some event handling methods (fire and on)
*/
var eventuality = function(that) {
	var registry = {};	// private

	// This fires an event on an object. Event is either
	// a string (name of event) or object with type property
	// that has name of event. Handlers registered with 'on' 
	// method that match event name will be invoked. 
	that.fire = function(event) {
		var array, func, handler, i;
		var type = typeof event === 'string' ? event : event.type;	// get type name of element

		// If array of handlers exists for this event, loop 
		// through and execute all of them in order.
		if(registry.hasOwnProperty(type)) {
			array = registry[type];	// array of handlers for this event 
			for(i = 0; i < array.length; i++) {
				handler = array[i];

				// Handler record contains method and optional array
				// of parameters. If method is name, look up function. 
				func = handler.method;	// get function 
				if(typeof func === 'string') {
					func = this[func];
				}

				// Invoke handler. If record contained parameters, pass 
				// them. Else pass the event object. 
				func.apply(this, handler.parameters || [event]); // invoke function with params or event
			}

		}
		return this;
	};

	// type: type of event 
	that.on = function(type, method, parameters) {
		// Register the event and make handler record. 
		// Put event in handler array - make one if doesn't
		// yet exist for this type of event. 

		var handler = {
			method: method,
			parameters: parameters
		};

		// push handler onto registry (or make new one)
		if(registry.hasOwnProperty(type)) {
			registry[type].push(handler);
		} else {
			registry[type] = [handler];
		}
		
		return this;
	};
	
	return that;
};
