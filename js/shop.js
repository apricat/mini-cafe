///////////////////////////
// shop                  //
///////////////////////////

function Shop() {

	var shopObj = new Object();

	var items = {
		'beans' : {
			'id'       : 'beans',
			'name'     : 'Beans',
			'category' : 'ingredient',
			'qty'      : 1,
			'price'    : 6
		},
		'ink'   : {
			'id'       : 'ink',
			'name'     : 'Ink',
			'category' : 'item',
			'qty'      : 1,
			'price'    : 20
		},
		'paper' : {
			'id'       : 'paper',
			'name'     : 'Paper',
			'category' : 'item',
			'qty'      : 1,
			'price'    : 20
		},
		'cups' : {
			'id'       : 'cups',
			'name'     : 'Cups',
			'category' : 'item',
			'qty'      : 12,
			'price'    : 10
		}
	}

	function getShopItems() {

		return items;

	}

	function startTransaction(id, qty) {

		var item = items[id];

		// verification
		if (store.getMoney < item.price * qty || qty <= 0 || isNaN(qty)) {
			ui.help('Transaction error', 'Do you have enough money? Or did you enter the quantity wrong?');
			return false;
		}

		store.removeMoney(item.price * qty);

		store.updateInventory(item['category'], item['id'], qty);

		ui.help('Transaction complete', qty + ' ' + items[id]['name'] + ' added to inventory!');

	}

	// init
	ui.shopInit();
	ui.populateShop(items);

	// functions to return outside of class scope
	shopObj.getShopItems     = getShopItems;
	shopObj.startTransaction = startTransaction;

	return shopObj;
	
}

var shop = new Shop();