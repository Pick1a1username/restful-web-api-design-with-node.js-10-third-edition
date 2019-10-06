var express = require('express');
var router = express.Router();

var catalog = require('../modules/catalog');
var model = require('../model/item');



router.get('/', function(request, response, next) {
  console.log(request.url + ' : querying for all items');
  catalog.findAllItems(response);
});

router.get('/:categoryId', function(request, response, next) {
  console.log(request.url + ' : querying for ' + request.params.categoryId);
  catalog.findItemsByCategory(request.params.categoryId, response);
});
  
// router.get('/:categoryId/:itemId', function(request, response, next) {
//   var item = catalog.findItem(request.params.categoryId, request.params.itemId);
//   if (item === undefined) {
//     response.writeHead(404, {'Content-Type' : 'text/plain'});
//     response.end('Not found');
//   } else {
//     response.json(item);
//   }
// });

router.get('/item/:itemId', function(request, response, next) {
  console.log(request.url + ' : querying for ' + request.params.itemId);
  // console.log(request.params);
  catalog.findItemById(request.params.itemId, response);
});

// Is it okay to use '/', not '/category/item/...'?
router.post('/', function(request, response, next) {
  console.log('Saving item using POST method');
  catalog.saveItem(request, response);
});

router.put('/', function(request, response, next) {
  console.log('Saving item using PUT method');
  catalog.saveItem(request, response);
});

router.delete('/item/:itemId', function(request, response, next) {
  console.log('Deleting item with id: ' + request.params.itemId);
  catalog.remove(request, response);
});

module.exports = router;

