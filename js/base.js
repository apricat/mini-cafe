///////////////////////////
// base                  //
///////////////////////////

function Base() {

	var baseObj = new Object();

	var debugMode = false;

	function countObj(obj) {

		var key, 
		    count = 0;

		for(key in obj) {

		  if(obj.hasOwnProperty(key)) {
		    count++;
		  }

		}
		return count;
	}

	function isEmpty(obj){
	  for(var i in obj){ return false;}
	  return true;
	}

	// functions to return outside of class scope
	baseObj.countObj  = countObj;
	baseObj.isEmpty   = isEmpty;
	baseObj.debugMode = debugMode;

	return baseObj;
	
}

var base = new Base();