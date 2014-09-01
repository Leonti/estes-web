'use strict';
angular.module('estesWebApp').service('Printer', ['$q', 'Settings', 'Order', function Printer($q, Settings, Order) {
	
	var availablePrinters = ['BROWSER', 'JAVA APPLET'];
	
	var settingsPromise = Settings.read();
	var print = function(order) {
		
		Settings.read().then(function(settings) {
			
			var lineWidth = settings.receiptWidth;
			var lines = [];
			lines.push(formatLine(order.waiter.name, moment(order.submitted).format('L'), lineWidth));
			lines.push('');
			_.each(order.dishes, function(dish) {
				lines.push(formatLine(dish.name, '$' + dish.price, lineWidth));
				_.each(dish.selectedIngredients, function(ingredient) {
					if (ingredient.priceChange > 0) {
						lines.push(formatLine('    ' + ingredient.name, '$' + ingredient.priceChange, lineWidth));
					}
				});
				lines.push('');
			});
			
			lines.push('');
			lines.push(formatLine('Subtotal:', Order.calculatePrice(order), lineWidth));
			lines.push(formatLine('Tax:', Order.calculateTax(order), lineWidth));
			lines.push(formatLine('Total:', Order.calculatePrice(order) + Order.calculateTax(order), lineWidth));
			
			
			if (settings.printer == 'BROWSER') {
				printWithBrowser(lines);			
			} else {
				console.log('other printer');
				console.log(lines);
			}
		});
	}
	
	function printWithBrowser(lines) {
		var content = '<pre>';
		_.each(lines, function(line) {
			content += line + '<br>';
		});
		content += '</pre>';
		
		var pri = document.getElementById("ifmcontentstoprint").contentWindow;
		pri.document.open();
		pri.document.write(content);
		pri.document.close();
		pri.focus();
		pri.print();
	}
	
	function formatLine(left, right, lineWidth) {
		right = right + '';
		var leftWidth = lineWidth - right.length - 1;
		var leftConcatenated = left.substring(0, leftWidth);
		while (leftConcatenated.length < leftWidth) {
			leftConcatenated += ' ';
		}
		
		return leftConcatenated + ' ' + right;
	} 
	
	return {
		getAvailablePrinters: function() {
			return $q.when(availablePrinters);
		},
		
		print: print
	}
}]);
