'use strict';

angular.module('HttpMocks', ['ngMockE2E']).run(['$httpBackend', 'storage', function($httpBackend, storage) {
	
	// settings		
	var mockSettings = {
			printer: 'BROWSER',
			receiptWidth: 40
	};
		
	if (!storage.get('mockSettings')) {
		storage.set('mockSettings', mockSettings);
	}
	
	// waiters	
	var mockWaiters = [{name: 'Leonti', id: {userId: 1, id: 12}}, {name: 'Vitali', id: {userId: 1, id: 13}}, {name: 'Krishti', id: {userId: 1, id: 14}}];
	
	if (!storage.get('mockWaiters')) {
		storage.set('mockWaiters', mockWaiters);
	}
	
	// articles
	var articleOptions =  [
	            		   [{ name: 'Regular fries', priceChange: '0', id: generateId() }, { name: 'Curly fries', priceChange: '0.5', id: generateId() }],
	            		   [{ name: 'Onions', priceChange: '0', id: generateId() }], 
	            		   [{ name: 'Beef', priceChange: '0', id: generateId() }]
	            		];
	
	var taxGroup = {
			name: 'Food',
			tax: '7.0',
			id: generateId()
		};
	
	function generateArticlesForTags(tags, idBase) {
		var articles = [];
		var titleBase = '';
		for (var i = 0; i < tags.length; i++) {
			titleBase += '_' + tags[i];
		}
		for (i = 0; i < 10; i++) {
			articles.push({
				id: {userId: 1, id: idBase + i},
				name: 'Article ' + titleBase + '_' + i,
				price: '10',
				tags: tags,
				options: articleOptions,
				taxGroup: taxGroup,
				kitchen: true
			});
		}
		
		return articles;
	}
	
	var generateFakeArticles = function() {
		var allArticles = [];
		allArticles = allArticles.concat(generateArticlesForTags(['Breakfast'], allArticles.length));
		allArticles = allArticles.concat(generateArticlesForTags(['Lunch'], allArticles.length));
		allArticles = allArticles.concat(generateArticlesForTags(['Dinner'], allArticles.length));
		allArticles = allArticles.concat(generateArticlesForTags(['Dinner', 'Breakfast'], allArticles.length));
		allArticles = allArticles.concat(generateArticlesForTags(['Dinner', 'Lunch'], allArticles.length));
		allArticles = allArticles.concat(generateArticlesForTags(['Breakfast', 'Lunch', 'Dinner'], allArticles.length));
		return allArticles;
	};
	
	if (!storage.get('mockArticles')) {
		storage.set('mockArticles', generateFakeArticles());
	}		
	
	// articles
	var saveArticle = function(article) {
		var articles = storage.get('mockArticles');
		
		if (article.id === undefined || article.id === null) {
			article.id = {userId: 1, id: articles.length + 1};
			articles.push(article);
		} else {
			for (var i = 0; i < articles.length; i++) {
				if (articles[i].id.id === article.id.id) {
					articles[i] = article;
				}
			}
		}
		storage.set('mockArticles', articles);
		return article;
	};
	
	var saveTaxGroup = function(taxGroup) {
		var taxGroups = storage.get('mockTaxGroups');
		
		if (taxGroup.id === undefined || taxGroup.id === null) {
			taxGroup.id = {userId: 1, id: taxGroup.length + 1};
			taxGroup.push(taxGroup);
		} else {
			for (var i = 0; i < taxGroup.length; i++) {
				if (taxGroup[i].id.id === taxGroup.id.id) {
					taxGroup[i] = taxGroup;
				}
			}
		}
		storage.set('mockTaxGroups', taxGroups);
		return taxGroup;
	};		
	
	var removeArticle = function(id) {
		var articles = storage.get('mockArticles');
		console.log(id);
		for (var i = 0; i < articles.length; i++) {
			if (articles[i].id.id === id.id) {
				articles.splice(i, 1);
			}
		}
		storage.set('mockArticles', articles);
	};
	
	var removeTaxGroup = function(id) {
		var taxGroups = storage.get('mockTaxGroups');
		for (var i = 0; i < taxGroups.length; i++) {
			if (taxGroups[i].id.id === id.id) {
				taxGroups.splice(i, 1);
			}
		}
		storage.set('mockTaxGroups', taxGroups);
	};
	
	// waiters
	var removeWaiter = function(id) {
		var waiters = storage.get('mockWaiters');
		for (var i = 0; i < waiters.length; i++) {
			if (waiters[i].id.id === id.id) {
				waiters.splice(i, 1);
			}
		}
		storage.set('mockWaiters', waiters);
	};
	
	var saveWaiter = function(waiter) {
		var waiters = storage.get('mockWaiters');

		if (waiter.id === null || waiter.id === undefined) {
			waiter.id = {userId: 1, id: waiters.length};
			waiters.push(waiter);				
		} else {
			for (var i = 0; i < waiters.length; i++) {
				if (waiters[i].id.id === waiter.id.id) {
					waiters[i] = waiter;
				}
			}
		}				
		
		storage.set('mockWaiters', waiters);
		console.log(waiter);
		return waiter;
	};
	
	// orders
	var mockOptions = [
            		   [{ name: 'Regular fries', priceChange: '0' }, { name: 'Curly fries', priceChange: '0.5' }],
            		   [{ name: 'Onions', priceChange: '0' }], 
            		   [{ name: 'Beef', priceChange: '0' }]
            		];

	var selectedOptions = [{ name: 'Curly fries', priceChange: '0.5' }, { name: 'Onions', priceChange: '0' }, { name: 'Beef', priceChange: '0' }];
	
	var getStatus = function(i) {
	
		if (i % 7 === 0) {
			return 'PREPARED';
		}		
		
		if (i % 5 === 0) {
			return 'PAID';
		}
		
		return 'PREPARATION';
	};
	
	function generateId() {
		return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
		    var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
		    return v.toString(16);
		});
	}
	
	var generateOrderArticles = function(i, status) {
		var articles = [];
		var titleBase = 'Burger';
		for (i = 0; i < getRandomInt(0, 8); i++) {
			var orderArticle = {
					id: generateId(),
					name: 'Article ' + titleBase,
					price: '10',
					tax: '7',
					discount: '0',
					tags: ['Breakfast', 'Lunch'],
					options: mockOptions,
					selectedOptions: selectedOptions,
					kitchen: true
				};
			
			if (status === 'PREPARED' || status === 'PAID') {
				orderArticle.status = 'PREPARED';
			}
			
			articles.push(orderArticle);
		}
		
		return articles;		
	};
	
	function generateMockEvent(orderId, articleId) {
		var events = storage.get('mockEvents');
		
		var event = {
			id: {userId: 1, id: events.length},
			timestamp: Date.now(),
			ack: [],
			articlePrepared: {
				orderId: orderId,
				articleId: articleId
			}
		};
		events.push(event);
		
		storage.set('mockEvents', events);			
	}
	
	function generateMockOrderReadyEvent(order) {
		var events = storage.get('mockEvents');
		
		var event = {
			id: {userId: 1, id: events.length},
			timestamp: Date.now(),
			ack: [],
			orderPrepared: {
				orderId: order.id
			}
		};
		events.push(event);
		
		storage.set('mockEvents', events);				
	}
	
	function getRandomInt(min, max) {
		  return Math.floor(Math.random() * (max - min)) + min;
	}
	
	var generateMockOrders = function() {
		var orders = [];
		
		for (var i = 0; i < 41; i++) {
			var status = getStatus(i);
			orders.push({
				id: {userId: 1, id: i},
				dayId: i,
				waiter: {name: 'Krishti', id: 14},
				submitted: Date.now(),
				articles: generateOrderArticles(i, status),
				discount: '0',
				status: status,
				note: 'Make it fast!'
			});
		}
		
		return orders;
	};
	
	var mockOrders = generateMockOrders();
	
	if (!storage.get('mockOrders')) {			
		storage.set('mockOrders', mockOrders);
	}	
	
	function saveOrder(order) {
		var orders = storage.get('mockOrders');
		
		updateStatus(order);
		if (order.id === null || order.id === undefined) {
			order.submitted = Date.now();
			order.id = {userId: 1, id: orders.length};
			orders.push(order);				
		} else {
			for (var i = 0; i < orders.length; i++) {
				if (orders[i].id.id === order.id.id) {
					orders[i] = order;
				}
			}
		}

		storage.set('mockOrders', orders);
		return order;
	}
	
	function updateArticleStatus(orderId, articleId) {
		var orders = storage.get('mockOrders');

		var order = _.find(orders, function(order) {
			return order.id.id === orderId.id;
		});
		var orderArticle = _.find(order.articles, function(article) {
			return article.id === articleId;
		});
		orderArticle.status = 'PREPARED';

		if (order.status === 'PREPARATION') {
			if (_.every(order.articles, function(article) { return article.status === 'PREPARED'; })) {
				order.status = 'PREPARED';
			}
		}		
		
		generateMockEvent(orderId, articleId);
		if (order.status === 'PREPARED') {
			generateMockOrderReadyEvent(order);
		}
		
		storage.set('mockOrders', orders);
		return order;				
	}	
	
	function getOrder(id) {
		var orders = storage.get('mockOrders');
		for (var i = 0; i < orders.length; i++) {
			if (orders[i].id.id === id.id) {
				return orders[i];
			}
		}		
	}
	
	// events
	var mockEvents = [];

	for (var i = 0; i < 10; i++) {
		mockEvents.push({
			id: {userId: 1, id: i},
			timestamp: Date.now(),
			articlePrepared: {
				orderId: {userId: 1, id: i},
				articleId: generateId()
			},
			ack: []
		});
	}
	
	if (!storage.get('mockEvents')) {			
		storage.set('mockEvents', mockEvents);
	}
	
	function ack(id, type) {
		var events = storage.get('mockEvents');
		
		for (var i = 0; i < events.length; i++) {
			if (events[i].id.id === id.id
					&& events[i].ack.indexOf(type) === -1) {
				events[i].ack.push(type);
				storage.set('mockEvents', events);				
				return events[i];
			}					
		}				
	}
	
	// settings
	$httpBackend.whenGET(new RegExp('.*/rest/user/[0-9]+/settings.*')).respond(function(method, url, data, headers) {
		
		console.log('retrieving settings');
		return [200, storage.get('mockSettings'), {}]
	});	
	$httpBackend.whenPOST(new RegExp('.*/rest/user/[0-9]+/settings.*')).respond(function(method, url, data, headers) {
		var settings = angular.fromJson(data);
		storage.set('mockSettings', settings);
		
		console.log('saving settings');
		console.log(settings);
		return [200, settings, {}]
	});
	
	// waiters
	$httpBackend.whenPOST(new RegExp('.*/rest/user/[0-9]+/waiter.*')).respond(function(method, url, data, headers) {
		var waiter = angular.fromJson(data);
		
		console.log('creating a waiter');
		console.log(waiter);
		return [200, saveWaiter(waiter), {}]
	});		
	$httpBackend.whenGET(new RegExp('.*/rest/user/[0-9]+/waiter.*')).respond(function(method, url, data, headers) {
		
		console.log('retrieving list of waiters');
		return [200, storage.get('mockWaiters'), {}]
	});	
	var waiterRegexp = new RegExp('.*/rest/user/[0-9]+/waiter/([0-9]+).*');
	$httpBackend.whenDELETE(waiterRegexp).respond(function(method, url, data, headers) {
		var id = parseInt(waiterRegexp.exec(url)[1]);
		
		console.log('deleting waiter with id ' + id);
		return [200, removeWaiter({userId: 1, id: id}), {}]
	});
	
	// articles
	$httpBackend.whenPOST(new RegExp('.*/rest/user/[0-9]+/article.*')).respond(function(method, url, data, headers) {
		var article = angular.fromJson(data);
		
		console.log('creating new article');
		console.log(article);
		return [200, saveArticle(article), {}]
	});	

	$httpBackend.whenPUT(new RegExp('.*/rest/user/[0-9]+/article.*')).respond(function(method, url, data, headers) {
		var article = angular.fromJson(data);
		
		console.log('saving an article');
		console.log(article);
		return [200, saveArticle(article), {}]
	});		
	
	$httpBackend.whenGET(new RegExp('.*/rest/user/[0-9]+/article.*')).respond(function(method, url, data, headers) {
		
		console.log('retrieving list of articles');
		return [200, storage.get('mockArticles'), {}]
	});
	
	var articleRegexp = new RegExp('.*/rest/user/[0-9]+/article/([0-9]+).*');
	$httpBackend.whenDELETE(articleRegexp).respond(function(method, url, data, headers) {
		var id = parseInt(articleRegexp.exec(url)[1]);
		
		console.log('deleting an article with id' + id);
		return [200, removeArticle({userId: 1, id: id}), {}]
	});	

	// orders
	var fromToOrderRegexp = /.*\/rest\/user\/[0-9]+\/order\/from\/([0-9]+)\/to\/([0-9]+)\?.*/;
	$httpBackend.whenGET(fromToOrderRegexp).respond(function(method, url, data, headers) {
		var from = fromToOrderRegexp.exec(url)[1];
		var to = fromToOrderRegexp.exec(url)[2];

		console.log('retrieving list of orders from ' + from + ' to ' + to);
		return [200, storage.get('mockOrders'), {}]
	});	
	
	$httpBackend.whenPOST(new RegExp('.*/rest/user/[0-9]+/order.*')).respond(function(method, url, data, headers) {
		var order = angular.fromJson(data);
		
		console.log('creating new order');
		console.log(order);
		return [200, saveOrder(order), {}]
	});	

	$httpBackend.whenPUT(new RegExp('.*/rest/user/[0-9]+/order.*')).respond(function(method, url, data, headers) {
		var order = angular.fromJson(data);
		
		console.log('saving an order');
		console.log(order);
		return [200, saveOrder(order), {}]
	});	
	
	var orderRegexp = new RegExp('.*/rest/user/[0-9]+/order/([0-9]+).*');
	$httpBackend.whenGET(orderRegexp).respond(function(method, url, data, headers) {
		var id = parseInt(orderRegexp.exec(url)[1]);
		
		console.log('retrieving an article for id ' + id);
		return [200, getOrder({userId: 1, id: id}), {}]
	});	
	
	$httpBackend.whenGET(new RegExp('.*/rest/user/[0-9]+/order.*')).respond(function(method, url, data, headers) {
		console.log('retrieving list of orders');
		return [200, storage.get('mockOrders'), {}]
	});
	
	var orderRegexp = new RegExp('.*/rest/user/[0-9]+/order/([0-9]+).*');
	$httpBackend.whenDELETE(orderRegexp).respond(function(method, url, data, headers) {
		throw 'not implemented yet';
	});
	
	var orderArticleRegexp = /.*\/rest\/user\/[0-9]+\/order\/([0-9]+)\/article\/(.*)\?.*/;
	$httpBackend.when('PATCH', orderArticleRegexp).respond(function(method, url, data, headers) {
		var id = parseInt(orderArticleRegexp.exec(url)[1]);
		var articleId = orderArticleRegexp.exec(url)[2];
		
		console.log('patching article status to be PREPARED ' + id + ' ' + articleId);
		return [200, updateArticleStatus({userId: 1, id: id}, articleId), {}]
	});	
	
	// Events
	$httpBackend.whenGET(new RegExp('.*/rest/user/[0-9]+/event.*')).respond(function(method, url, data, headers) {
		
		console.log('retrieving list of events');
		return [200, storage.get('mockEvents'), {}]
	});	
	var eventRegexp = new RegExp('.*/rest/user/[0-9]+/event/([0-9]+).*');
	$httpBackend.when('PATCH', eventRegexp).respond(function(method, url, data, headers) {
		var id = parseInt(eventRegexp.exec(url)[1]);
		var patch = angular.fromJson(data);
		
		console.log('patching ack for ' + id + ' ' + patch.value);
		return [200, ack({userId: 1, id: id}, patch.value), {}]
	});
	
	 $httpBackend.whenGET(/rest.*/).respond(function(method, url, data, headers) {
		 console.log('GET request to ' + url);
	 });
	 $httpBackend.whenPOST(/rest.*/).respond(function(method, url, data, headers) {
		 console.log('POST request to ' + url);
	 });
	 $httpBackend.whenPUT(/rest.*/).respond(function(method, url, data, headers) {
		 console.log('PUT request to ' + url);
	 });
	 $httpBackend.whenDELETE(/rest.*/).respond(function(method, url, data, headers) {
		 console.log('DELETE request to ' + url);
	 });
	 
	 $httpBackend.when('PATCH', /rest.*/).respond(function(method, url, data, headers) {
		 console.log('PATCH request to ' + url);
	 });	 
	 
	 // For everything else, don't mock
	 $httpBackend.whenGET(/.*/).passThrough();
	 $httpBackend.whenPOST(/.*/).passThrough();	 
}]);


angular.module('estesWebApp').requires.push('HttpMocks');