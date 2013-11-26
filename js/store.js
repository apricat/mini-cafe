///////////////////////////
// store                 //
///////////////////////////

function Store() {

	var storeObj = new Object();

	var playerInventory = {
		'item' : {
			'cups'   : 12,
			'coffee' : 0,
			'ink'    : 4,
			'paper'  : 4
		},
		'ingredient' : {
			'beans'  : 2
		}
	};

	var recipes = {
		'coffee' : {
			'req' : {
				'beans' : 1
			},
			'time' : 1800
		}
	};

	var money         = 100,
	    popularity    = 2,
	    maxPopularity = 200,
	    currentRecipe = {
	    	'coffee' : {
				
			}
		};

	function addPopularity(amount) {

		popularity += amount;
		ui.setMeter(popularity);

	}

	function removePopularity(amount) {

		popularity -= amount;
		ui.setMeter(popularity);

	}

	function getInventory(category, name) {

		return playerInventory[category][name];

	}

	function clearInventory(category, name) {

		playerInventory[category][name] = 0;
		ui.populateInventory(playerInventory);

	}

	function updateInventory(category, name, qty) {

		playerInventory[category][name] += parseInt(qty, 10);
		ui.populateInventory(playerInventory);

	}

	function addMoney(amount) {

		money += amount;
		ui.setMoney(money);

	}

	function removeMoney(amount) {

		money -= amount;
		ui.setMoney(money);

	}

	function startCoffee() {

		if (playerInventory['ingredient']['beans'] < 1) {
			ui.help('Missing items required', "You don't have enough coffee beans to make coffee.");
			return false;
		}

		if (currentRecipe) {
			if (!base.isEmpty(currentRecipe['coffee'])) {
				ui.help('You are already making coffee!', "You can't make two pots at a time :(");
				return false;
			}
		}

		ui.help('Coffee brewing...', 'Your coffee is brewing and will be ready soon!');
		currentRecipe.coffee = {'endTime' : recipes['coffee']['time'] + time.getTime()};

	}

	function endCoffee() {

		currentRecipe.coffee = {};
		updateInventory('ingredient', 'beans', -1);
		updateInventory('item', 'coffee', 12);
		ui.help('Coffee Ready!', "A fresh batch of coffee (12 servings) is ready");

	}

	ui.hookCoffee();
	ui.inventoryInit();
	ui.populateInventory(playerInventory);

	// functions to return outside of class scope
	storeObj.getInventory     = getInventory;
	storeObj.updateInventory  = updateInventory;
	storeObj.clearInventory   = clearInventory;
	storeObj.inventory        = playerInventory;
	storeObj.addMoney         = addMoney;
	storeObj.removeMoney      = removeMoney;
	storeObj.getMoney         = money;
	storeObj.addPopularity    = addPopularity;
	storeObj.removePopularity = removePopularity;
	storeObj.getPopularity    = popularity;
	storeObj.getMaxPop        = maxPopularity;
	storeObj.startCoffee      = startCoffee;
	storeObj.endCoffee        = endCoffee;
	storeObj.currentRecipe    = currentRecipe;

	return storeObj;
	
}

var store = new Store();