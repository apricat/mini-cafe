///////////////////////////
// clients               //
///////////////////////////

// initializes all client variables, events, graphics

function Clients() {

	var clientObj = new Object();

	var clientData = {
		0 : {
			'name'       : 'A bunch of anarchists',
			'graphics'   : 'anarchist', // TODO
			'popularity' : 0,
			'dialog'     : {
				'coffee' : 'I need a coffee so I can stay awake and succeed in smashing the state!',
				'print'  : 'I need a print done for this anti-capitalist riot I am organizing.',
				'error'  : "Ah, you're out of stock... I'll come back later."
			}
		},
		1 : {
			'name'       : 'Your lovely girlfriend',
			'graphics'   : 'girlfriend', // TODO
			'popularity' : 0,
			'dialog'     : {
				'coffee' : 'Coffee please!',
				'print'  : 'Can you print this cat picture for me? Please please please!',
				'error'  : "Ah, you're out of stock... I'll come back later."
			}
		},
		2 : {
			'name'       : "A hipster that doesn't wears socks",
			'graphics'   : 'hipster', // TODO
			'popularity' : 100,
			'dialog'     : {
				'coffee' : "This place is so cool! Have you ever considered selling shoes and magazines here as well, though? Anyway, I'd like a coffee",
				'print'  : "I need this band poster printed for my friend's obscure shoegazing/art/noise/punk band you've never heard about. Can you do it?",
				'error'  : "Ah, you're out of stock... I'll come back later."
			}
		},
		3 : {
			'name'       : 'Some "artist" with no job',
			'graphics'   : 'artist', // TODO
			'popularity' : 300,
			'dialog'     : {
				'coffee' : 'Feels so great to be unemployed! Can I get a coffee please?',
				'print'  : 'My artist friends and I are putting up a show in order to get grant money. Can you print the posters for us?',
				'error'  : "Ah, you're out of stock... I'll come back later."
			}
		},
		4 : {
			'name'       : 'A capitalist Yuppy',
			'graphics'   : 'corporate', // TODO
			'popularity' : 400,
			'dialog'     : {
				'coffee' : "I need more energy! Contributing to the gentrification of this neighbourhood is really tiresome! I'll take a coffee please.",
				'print'  : 'I need to print this EnergyPoint presentation for work.',
				'error'  : "Ah, you're out of stock... I'll come back later."
			}
		}
	};

	var taskData = {
		0 : {
			'id'    : 'coffee',
			'title' : 'Coffee',
			'time'  : 600,
			'pay'   : 2,
			'req'   : {
				0 : {'item' : 'cups'},
				1 : {'item' : 'coffee'}
			}
		},
		1 : {
			'id'    : 'print',
			'title' : 'Print',
			'time'  : 7200,
			'pay'   : 50,
			'req'   : {
				0 : {'item' : 'ink'},
				1 : {'item' : 'paper'}
			}
		}
	};
	
	// save currentTask info with id
	var currentTask = {};
	var ongoingTask = false;
	var taskId = 0;

	function returnSingleClient(id) {

		return clientData[id];

	}

	function returnRandomClient() {

		var id = Math.floor(Math.random() * base.countObj(clientData)),
		    randClient = clientData[id];

		return randClient;

	}

	function returnRandomTask() {

		var id = Math.floor(Math.random() * base.countObj(taskData)),
		    randTask = taskData[id];

		return randTask;

	}

	function verifyReqInventory(task) {

		var error = false;

		for (var id in task['req']) {
			for (cat in task['req'][id]) {

				var name = task['req'][id][cat];
				//console.log(store.getInventory(cat, name));
				if (store.getInventory(cat, name) <= 0) {

					error = true;
					console.log('Missing ' + cat + ': ' + task['req'][id][cat]);

				}

			}
		}

		return error;

	}

	function removeTaskItems(task) {

		for (var id in task['req']) {
			for (cat in task['req'][id]) {

				var name = task['req'][id][cat];
				store.updateInventory(cat, name, -1);

			}
		}

		ui.populateInventory(store.inventory);

	}

	function prepareDialog(customer, task, error) {


		var title   = customer['name'],
		    text    = customer['dialog'][task['id']],
		    options = true;

		// if a print job is already in place
	    if (task['id'] == 'print') {
			for (jobId in currentTask) {

				if (currentTask[jobId]['title'] == 'Print') {
					var helpTitle = 'Warning',
					    helpText  = 'Accepting this request will remove the previous ' + currentTask[jobId]['title'] + ' job from your tasks and you will lose all current progress';
					ui.help(helpTitle, helpText);
				}

			}
		}

		if (error) {
			ui.help(customer['name'], customer['dialog']['error']);
			clientWalkOut();
			return false;
		}

		ui.dialog(title, text, options, task);

	}

	function startTransaction(task) {

		// only accept one print job at a time
		if (task['id'] == 'print') {
			for (jobId in currentTask) {
				if (currentTask[jobId]['title'] == 'Print') {
					delete currentTask[jobId];
				}
			}

			// exit if out of stock
			if (verifyReqInventory(task)) {
				return false; 
			}

			ui.addTimedTask(task);
			clientWalkOut();

		}

		var startTime = time.getTime(),
		    endTime   = time.getTime() + task['time'],
		    payout    = task['pay'] + Math.floor(Math.random() * (task['pay'] + 1));

		currentTask[taskId] = {
			'title'  : task['title'],
			'payout' : payout,
			'start'  : startTime,
			'end'    : endTime
		};

		// remove items from inventory
		removeTaskItems(task);

		taskId++;

	}

	function endTransaction(id) {

		var title   = currentTask[id]['title'] + ' done!',
			text    = 'The client is happy and you made ' + currentTask[id]['payout'] + '$!';

		store.addMoney(currentTask[id]['payout']);

		if (store.getPopularity < store.getMaxPop) {
			var random = Math.floor(Math.random() * (1 + 2));
			store.addPopularity(2);
		}

		if (currentTask[id]['title'] == 'Coffee') {
			clientWalkOut();
		}

		unsetTransaction(id);

		ui.help(title, text);
		
	}

	function unsetTransaction(id) {

		// unset task
		delete currentTask[id];

	}

	function clientWalkUp(customer, task) {

		$('#clients').removeClass('reverse').css('background', 'url(img/clients/' + customer['graphics'] + '-walk.png) 0 0 no-repeat');

		var pos = 0,
		    loc = 0;

		var walk = setInterval( function(){ 

			$('#clients').css('background-position', pos + 'px 0');

			pos -= 160;
			if (pos <= -640) {
				pos = 0;
			}

			$('#clients').css('left', loc + 'px');

			if (loc <= 400) {

				loc += 20;

			} else {
				
				clearInterval(walk);
				$('#clients').css('background-position', '-640px 0');
				prepareTransaction(customer, task);

			}

		}, 150);

	}

	function clientWalkOut() {

		$('#clients').addClass('reverse');

		var pos = 0,
		    loc = 400;

		var walk = setInterval( function(){ 

			$('#clients').css('background-position', pos + 'px 0');

			pos -= 160;
			if (pos <= -640) {
				pos = 0;
			}

			$('#clients').css('left', loc + 'px');

			if (loc >= -160) {

				loc -= 20;

			} else {

				setTask(false);
				clearInterval(walk);

			}

		}, 150);
	}

	function prepareTransaction(customer, task) {
		
		// print text
		prepareDialog(customer, task, verifyReqInventory(task));

		// exit if out of stock
		if (verifyReqInventory(task)) {
			ui.help('"' + customer['dialog']['error'] + '"', 'Missing required items to make ' + task['id']);
			clientWalkOut();
			return false; 
		}

	}

	function setTask(bool) {
		ongoingTask = bool;
	}

	function clientEvent() {

		if (ongoingTask === true) { return false; }

		setTask(true);

		// get client and task
		var customer = returnRandomClient(),
		    task     = returnRandomTask();

		// player animation
		clientWalkUp(customer, task);

	}

	clientObj.clientEvent      = clientEvent;
	clientObj.startTransaction = startTransaction;
	clientObj.endTransaction   = endTransaction;
	clientObj.currentTask      = currentTask;
	clientObj.clientWalkOut    = clientWalkOut;
	clientObj.setTask          = setTask;
	clientObj.ongoingTask      = ongoingTask;
	clientObj.unsetTransaction = unsetTransaction;

	return clientObj;

}

var clients = new Clients();

