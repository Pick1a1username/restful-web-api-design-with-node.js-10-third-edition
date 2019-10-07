var express = require('express');

const mongoose = require('mongoose');
const Grid = require('gridfs-stream');

var catalogV1 = require('../modules/catalogV1');
var catalogV2 = require('../modules/catalogV2');
var model = require('../model/item');

var router = express.Router();

mongoose.connect('mongodb://catalog_admin:some_password@mongo/catalog');
var connection = mongoose.connection;
// https://mongodb.github.io/node-mongodb-native/api-generated/grid.html
var gfs = Grid({ db: connection.db }, mongoose.mongo);


// Version 1

router.get('/v1/', function(request, response, next) {
  catalogV1.findAllItems(response);
});

router.get('/v1/item/:itemId', function(request, response, next) {
  console.log(request.url + ' : querying for ' + request.params.itemId);
  catalogV1.findItemById(request.params.itemId, response);
});

router.get('/v1/:categoryId', function(request, response, next) {
  console.log(request.url + ' : querying for ' + request.params.categoryId);
  catalogV1.findItemsByCategory(request.params.categoryId, response);
});

router.get('/v1/:categoryId/:itemId', function(request, response, next) {
  var item = catalogV1.findItem(request.params.categoryId, request.params.itemId);
  if (item === undefined) {
    response.writeHead(404, {'Content-Type' : 'text/plain'});
    response.end('Not found');
  } else {
    response.json(item);
  }
});

router.post('/v1/', function(request, response, next) {
  console.log('Saving item using POST method');
  catalogV1.saveItem(request, response);
});

router.put('/v1/', function(request, response, next) {
  console.log('Saving item using PUT method');
  catalogV1.saveItem(request, response);
});

router.delete('/v1/item/:itemId', function(request, response, next) {
  console.log('Deleting item with id: ' + request.params.itemId);
  catalogV1.remove(request, response);
});

// Version 2

router.get('/v2/items', function(request, response) {
  var getParams = url.parse(request.url, true).query;

  if (Object.keys(getParams).length == 0) {
    catalogV2.findAllItems(response);
  } else {
    var key = Object.keys(getParams)[0];
    var value = getParams[key];
    catalogV2.findItemsByAttribute(key, value, response);
  }
});

router.get('/v2/item/:itemId/image', function(request, response) {
  var gfs = Grid(model.connection.db, mongoose.mongo);
  catalogV2.getImage(gfs, request, response);
});

router.get('/item/:itemId/image', function(request, response) {
  var gfs = Grid(model.connection.db, mongoose.mongo);
  catalogV2.getImage(gfs, request, response);
});

/**
 * Example:
 * 
 * ```
 * $ curl -vv -X POST localhost:3000/catalog/v2/item/3/image -H 'Content-Type: application/binary' --data-binary '@dhcp_issue.png' 
 * ```
 * 
 */
router.post('/v2/item/:itemId/image', function(request, response) {
  var gfs = Grid(model.connection.db, mongoose.mongo);
  catalogV2.saveImage(gfs, request, response);
});

router.post('/item/:itemId/image', function(request, response) {
  var gfs = Grid(model.connection.db, mongoose.mongo);
  catalogV2.saveImage(gfs, request, response);
});

router.put('/v2/item/:itemId/image', function(request, response) {
  var gfs = Grid(model.connection.db, mongoose.mongo);
  catalogV2.saveImage(gfs, request.params.itemId, response);
});

router.put('/item/:itemId/image', function(request, response) {
  var gfs = Grid(model.connection.db, mongoose.mongo);
  catalogV2.saveImage(gfs, request.params.itemId, response);
});

router.delete('/v2/item/:itemId/image', function(request, response) {
  var gfs = Grid(model.connection.db, mongoose.mongo);
  catalogV2.deleteImage(gfs, model.connection, request.params.itemId, response);
});

router.delete('/item/:itemId/image', function(request, response) {
  var gfs = Grid(model.connection.db, mongoose.mongo);
  catalogV2.deleteImage(gfs, model.connection, request.params.itemId, response);
});

// Current Version

router.get('/', function(request, response) {
  console.log('Redirecting to v1');
  response.writeHead(301, {'Location' : '/catalog/v1/'});
  response.end('Version 1 is moved to /catalog/v1/: ');
});

module.exports = router;

