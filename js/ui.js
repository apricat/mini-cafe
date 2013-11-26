///////////////////////////
// UI                    //
///////////////////////////

function Ui() {

	var uiObj = new Object();

	var _template = {
		'dialog'     : '#dialog',
		'container'  : '#container',
		'overlay'    : '#overlay',
		'money'      : '#money',
		'popularity' : '#popularity',
		'help'       : '#help',
		'timeline'   : '#timeline',
		'shop'       : {
			'hook'   	: '#shop-hook',
			'items'  	: '#shop-items'
		},
		'inventory'  : {
			'hook'  	: '#inventory-hook',
			'items'  	: '#inventory-items'
		},
		'coffee'     : '#coffee',
		'cups'       : '#cups ul',
		'start'      : '#start',
		'intro'      : '#instructions'
	}

	function blackOut() {

		$(_template.overlay).fadeIn(1200, function() {

			time.setTime(32400);
			time.setClock();

			// unset day's events
			if (!base.isEmpty(clients['currentTask'])) {

				for (id in clients['currentTask']) {
					clients.unsetTransaction(id);
				}

			}
			store.currentRecipe.coffee = null;
			store.clearInventory('item', 'coffee');

			$('#clients').css('left', '-160px');
			clients.setTask = false;

			clearDialog();
			clearTimedTask();

			$(this).delay(1000).fadeOut(1200);

		});

	}

	function startGame() {

		$(_template.start).click(function(e){ 

			e.preventDefault();

			console.log('Game starting!');

			time.startGame();

			$(_template.overlay).fadeOut('slow', function() {
				$(_template.overlay).css('background', '#000');
			});
			$(this).fadeOut();

		});

	}

	function intro() {

		$(_template.overlay).fadeIn('fast');

		$(_template.intro + ' div:first').fadeIn('fast');

		$(_template.intro + ' a').click(function(e){

			e.preventDefault;

			if ($(this).data('option') === 'next') {

				$(this).parent().fadeOut('slow', function() {
			    	$(this).next('div').fadeIn('fast');
				});

			}
			if ($(this).data('option') === 'start') {
				$(this).parent().fadeOut('slow');
				$(_template.start).click();
			}

		});

	}

	function addTimedTask() {

		$(_template.timeline + ' span').css('width', '0%');
		$(_template.timeline).data('start', time.getTime());

	}

	function clearTimedTask() {

		$(_template.timeline + ' span').css('width', '0%');
		$(_template.timeline).data('start', '');

	}

	function setTimedTask(end) {

		var start = $(_template.timeline).data('start');
		var width = (time.getTime() - start) / (end - start) * 100;
		$(_template.timeline + ' span').css('width', width + '%');

	}

	function clearDialog() {

		$(_template.dialog).fadeOut('slow', function () {
			$(_template.dialog + ' .content').html();
		});

	}

	function shopInit() {

		$(_template.shop.hook).click(function(e) {
			e.preventDefault();

			$(_template.shop.items).slideToggle('fast');

		});

		$(document).on('click', _template.shop.items + ' li a', function(e) {
			e.preventDefault();
			shop.startTransaction($(this).data('id'), $(this).parent().find('input').val());
			// clear input
			$(this).parent().find('input').val('1');
		});

	}

	function inventoryInit() {

		$(_template.inventory.hook).click(function(e) {
			e.preventDefault();

			$(_template.inventory.items).slideToggle('fast');

		});

	}

	function populateInventory(inventory) {

		var items   = '',
		    coffees = '';

		for (type in inventory) {
	
			for (name in inventory[type]) {

				items += '<li><span class="title">' + name + '</span><span class="qty">' + inventory[type][name] + '</span></li>';
			}

		}

		// add coffee qty marquers
		var coffeeQty = inventory['item']['coffee'];
		if (coffeeQty > 12) {coffeeQty = 12;}
		var margin    = (12 - coffeeQty) * 20;

		for (var i = 0; i < coffeeQty; i++) {
			coffees += '<li></li>';
		}

		$(_template.cups).html(coffees);
		$(_template.cups).css('margin-top', margin + 'px');

		$(_template.inventory.items).html(items);

	}

	function populateShop(inventory) {

		var items = '';

		for (var id in inventory) {
			items += '<li><span class="title">' + inventory[id]['name'] + '</span><span class="price">' + inventory[id]['price'] + '$</span><input type="text" value="1"><a href="#" data-id=' + inventory[id]['id'] + '>Buy</a></li>';
		}

		$(_template.shop.items).html(items);

	}

	function help(title, text) {

		var print = '<h3>' + title + '</h3><p>' + text + '</p>'; 
		$(_template.help).html(print);
		$(_template.help).slideDown('fast');

		setTimeout(function(){

			$(_template.help).slideUp('slow', function () {
				$(_template.help).html();
			});

		}, 5000);

	}

	function dialog(title, text, options, task) {

		var print = '<h2>' + title + '</h2><p>' + text + '</p>'; 

		$(_template.dialog).fadeIn('fast');

		$(_template.dialog + ' .content').html(print);

		$(_template.dialog + ' button').unbind('click').click(function(e) {

			e.preventDefault();

			$(_template.dialog).fadeOut('fast', function () {
				clearDialog();
			});

			if ($(this).hasClass('cancel')) {
				clients.clientWalkOut();
				return false;
			}

			clients.startTransaction(task);

		});
		
	}

	function regDialog(title, text) {

		var print = '<h2>' + title + '</h2><p>' + text + '</p>'; 

		$(_template.dialog + ' button.cancel').hide();

		$(_template.dialog).fadeIn('fast');

		$(_template.dialog + ' .content').html(print);

		$(_template.dialog + ' button').unbind('click').click(function(e) {

			e.preventDefault();

			$(_template.dialog).fadeOut('fast', function () {
				clearDialog();
				$(_template.dialog + ' button.cancel').show();
			});

		});
		
	}

	function setMoney(money) {

		$(_template.money).text(money);

	}

	function hookCoffee() {

		$(_template.coffee + ' a').click(function(e){
			e.preventDefault();
			store.startCoffee();
		});

	}

	function setMeter(pop) {
		var width = pop / 200 * 100;
		$(_template.popularity + ' span').css('width', width + '%');
	}

	// functions to return outside of class scope
	uiObj.dialog            = dialog;
	uiObj.help              = help;
	uiObj.setTimedTask      = setTimedTask;
	uiObj.addTimedTask      = addTimedTask;
	uiObj.clearTimedTask    = clearTimedTask;
	uiObj.blackOut          = blackOut;
	uiObj.setMoney          = setMoney;
	uiObj.setMeter          = setMeter;
	uiObj.shopInit          = shopInit;
	uiObj.inventoryInit     = inventoryInit;
	uiObj.populateShop      = populateShop;
	uiObj.populateInventory = populateInventory;
	uiObj.hookCoffee        = hookCoffee;
	uiObj.startGame         = startGame;
	uiObj.intro             = intro;
	uiObj.regDialog         = regDialog;

	return uiObj;
	
}

var ui = new Ui();