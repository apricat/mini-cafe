///////////////////////////
// time                  //
///////////////////////////

function Time() {

	var timeObj = new Object();

	var _template = {
		'clock' : '#clock'
	};

	// start at 9am
	var time = 32400;

	var start = false;

	var complete = false;

	// init functions
	setClock();
	ui.setMoney(store.getMoney);
	ui.startGame();
	ui.intro();

	// advance time
	setInterval( function(){ 
		if (start) {
			advanceTime();
			formatTime();
			setClock();
			openingHours();
			triggerEvent();
			checkCookingStatus();
			checkTransactionStatus();
			checkEndGame();
		}
	} , 3000 );

	function checkEndGame() {
		if (store.getPopularity >= 200 && complete === false) {
			complete = true;
			ui.regDialog('Congratulation!', 'You are now somewhat rich and somewhat famous! Happy birthday, Kev. I hope all your dreams come true -xox-');
		}
	}

	function startGame() {
		start = true;
	}

	function checkCookingStatus() {

		if (base.isEmpty(store.currentRecipe.coffee) || store.currentRecipe.coffee == null) {
			return false;
		}

		if (time == store.currentRecipe['coffee']['endTime']) {
			store.endCoffee();
		}

	}

	function checkTransactionStatus() {

		if (!base.isEmpty(clients['currentTask'])) {

			for (id in clients['currentTask']) {

				if (clients['currentTask'][id]['title'] == 'Print') {

					ui.setTimedTask(clients['currentTask'][id]['end']);

				}

				if (time >= clients['currentTask'][id]['end']) {

					if (clients['currentTask'][id]['title'] == 'Print') {
						setTimeout(function() {
						    ui.clearTimedTask();
						}, 3000);
					}
					
					clients.endTransaction(id);

				}
				
			}

		}

	}

	function advanceTime(num) {

		if (num) {
			time += num;
		} else {
			if (base.debugMode) {
				time += 3600;
			} else {
				time += 600;
			}	
		}

	}

	function triggerEvent() {

		// calculate chance of encounter depending on popularity
		var pop = Math.ceil(store.getMaxPop - store.getPopularity) / 20,
			    random = Math.floor(Math.random() * (pop + 1));

		if (random == 1 || random == 0) {
			clients.clientEvent();
		}	

	}

	function formatTime() {

	    var hours   = Math.floor(time / 3600);
	    var minutes = Math.floor((time - (hours * 3600)) / 60);

	    if (hours   < 10) {hours   = '0' + hours;}
	    if (minutes < 10) {minutes = '0' + minutes;}

	    var hour    = hours + ':' + minutes;

	    return hour;

	}

	function openingHours() {

		// don't want kev to be working TOO hard
		if (time >= 75600) {
			ui.blackOut();
			store.updateInventory('item', 'coffee', 0);
		}

	}

	function getFormatTime() {
		return formatTime();
	}

	function getTime() {
		return time;
	}

	function setTime(num) {
		time = num;
	}

	function setClock() {

		$(_template.clock).text(getFormatTime());

	}

	// functions to return outside of class scope
	timeObj.getTime   = getTime;
	timeObj.setTime   = setTime;
	timeObj.setClock  = setClock;
	timeObj.startGame = startGame;

	return timeObj;
	
}

var time = new Time();