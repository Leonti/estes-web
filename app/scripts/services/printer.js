'use strict';
/*global _:false, moment:false */

angular.module('estesWebApp').service('Printer', ['$q', 'Settings', 'Order', function Printer($q, Settings, Order) {
	
	var availablePrinters = ['THERMAL', 'BROWSER'];
	
	function round(price) {
		return Math.round(price * 100)/100;
	}
	
	function printWithBrowser(lines) {
		var content = '<pre>';
		_.each(lines, function(line) {
			content += line + '<br>';
		});
		content += '</pre>';
		
		var pri = document.getElementById('ifmcontentstoprint').contentWindow;
		pri.document.open();
		pri.document.write(content);
		pri.document.close();
		pri.focus();
		pri.print();
	}
	
	function printWithThermalPrinter(lines) {
		var printerAppId = "ddihcjccbfbeonbaafmopanpdiifgilf";
		chrome.runtime.sendMessage(printerAppId, {type: 'print', lines: lines});		
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
	
	var print = function(order) {
		
		Settings.read().then(function(settings) {
			
			var lineWidth = settings.receiptWidth;
			var lines = [];
			lines.push(formatLine(order.waiter.name, moment(order.submitted).format('L'), lineWidth));
			lines.push('');
			_.each(order.articles, function(article) {
				lines.push(formatLine(article.name, '$' + article.price, lineWidth));
				_.each(article.selectedOptions, function(option) {
					if (option.priceChange > 0) {
						lines.push(formatLine('    ' + option.name, '$' + option.priceChange, lineWidth));
					}
				});
				lines.push('');
			});
			
			lines.push('');
			lines.push(formatLine('Subtotal:', round(Order.calculatePrice(order)), lineWidth));
			lines.push(formatLine('Tax:', round(Order.calculateTax(order)), lineWidth));
			lines.push(formatLine('Total:', round(Order.calculatePrice(order)) + round(Order.calculateTax(order)), lineWidth));
			
			
			if (settings.printer === 'BROWSER') {
				printWithBrowser(lines);			
			} else if (settings.printer === 'THERMAL') {
				lines = lines.concat(["", "", ""]);
				printWithThermalPrinter(lines);
			} else {
				console.log('other printer');
				console.log(lines);				
			}
		});
	}; 
	
	return {
		getAvailablePrinters: function() {
			return $q.when(availablePrinters);
		},
		
		print: print
	};
}]);
