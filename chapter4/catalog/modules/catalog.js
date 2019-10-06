var fs = require('fs');

// const model = require('../model/item');
// const CatalogItem = model.CatalogItem;

function readCatalogSync() {
  var file = './data/catalog.json';
  if (fs.existsSync(file)) {
    var content = fs.readFileSync(file);
    var catalog = JSON.parse(content);
    console.log(catalog);
    return catalog;
  }
  return undefined;
};

exports.findItems = function(categoryId) {
  console.log('Returning all items for categoryId: ' + categoryId);
  var catalog = readCatalogSync();
  if (catalog) {
    var items = [];
    for (var index in catalog.catalog) {
      if (catalog.catalog[index].categoryId === categoryId) {
        var category = catalog.catalog[index];
        for (var itemIndex in category.items) {
          items.push(category.items[itemIndex]);
        }
      }
    }
    return items;
  }
  return undefined;
};

exports.findItem = function(categoryId, itemId) {
  console.log('Looking for item with id' + itemId);
  var catalog = readCatalogSync();
  if (catalog) {
    for (var index in catalog.catalog) {
      if (catalog.catalog[index].categoryId === categoryId) {
        var category = catalog.catalog[index];
        for (var itemIndex in category.items) {
          if (category.items[itemIndex].itemId === itemId) {
            return category.items[itemIndex];
          }
        }
      }
    }
  }
  return undefined;
};

exports.findCategories = function() {
  console.log('Returning all categories');
  var catalog = readCatalogSync();
  if (catalog) {
    var categories = [];
    for (var index in catalog.catalog) {
      var category = {};
      category["categoryId"] = catalog.catalog[index].categoryId;
      category["categoryName"] = catalog.catalog[index].categoryName;

      categories.push(category);
    }
    return categories;
  }
  return [];
};

exports.remove = function (request, response) {
  console.log('Deleting item with id: ' + request.body.itemId);
  CatalogItem.findOne({itemId: request.params.itemId}, function(error, data) {
    if (error) {
      console.log(error);
      if (response != null) {
        response.writeHead(500, contentTypePlainText);
        response.end('Internal server error');
      }
      return;
    } else {
      if (!data) {
        console.log('Item not found');
        if (response != null) {
          response.writeHead(404, contentTypePlainText);
          response.end('Not Found');
        }
        return;
      } else {
        data.remove(function(error) {
          if (!error) {
            // Why is data.remove() called twice?
            data.remove();
            response.json({'Status': 'Successfully deleted'});
          } else {
            console.log(error);
            response.writeHead(500, contentTypePlainText);
            response.end('Internal Server Error');
          }
        });
      }
    }
  });
};

function toItem(body) {
  return new CatalogItem({
    itemId: body.itemId,
    itemName: body.itemName,
    price: body.price,
    currency: body.currency,
    categories: body.categories
  });
};

exports.saveItem = function(request, response) {
  var item = toItem(request.body);
  item.save((error) => {
    if (!error) {
      item.save();
      response.writeHead(201, contentTypeJson);
      response.end(JSON.stringify(request.body));
    } else {
      console.log(error);
      CatalogItem.findOne({itemId: item.itemId }, (error, result) => {
        console.log('Check if such an item exists');
        if (error) {
          console.log(error);
          response.writeHead(500, contentTypePlainText);
          response.end('Internal Server Error');
        } else {
          if (!result) {
            // This branch seems to be needless.
            console.log('Item does not exist. Creating a new one');
            item.save();
            response.writeHead(201, contentTypeJson);
            response.end(JSON.stringify(request.body));
          } else {
            console.log('Updating existing item');
            result.itemId = item.itemId;
            result.itemName = item.itemName;
            result.price = item.price;
            result.currency = item.currency;
            result.categories = item.categories;
            result.save();
            response.json(JSON.stringify(result));
          }
        }
      });
    }
  });
};

exports.findItemsByCategory = function (category, response) {
  CatalogItem.find({categories: category}, function(error, result) {
    if (error) {
      console.error(error);
      response.writeHead(500, { 'Content-Type': 'text/plain' });
      return;
    } else {
      if (!result) {
        if (response != null) {
          response.writeHead(404, contentTypePlainText);
          response.end('Not Found');
        }
        return;
      }

      if (response != null) {
        response.setHeader('Content-Type', 'application/json');
        response.send(result);
      }
      console.log(result);
    }
  });
};

exports.findItemById = function (itemId, response) {
  CatalogItem.findOne({itemId: itemId}, function(error, result) {
    if (error) {
      console.error(error);
      response.writeHead(500, contentTypePlainText);
      return;
    } else {
      if (!result) {
        if (response != null) {
          response.writeHead(404, contentTypePlainText);
          response.end('Not Found');
        }
        return;
      }

      if (response != null) {
        response.setHeader('Content-Type', 'application/json');
        response.send(result);
      }
    }
  });
};

exports.findAllItems = function (response) {
  CatalogItem.find({}, (error, result) => {
    if (error) {
      console.error(error);
      return null;
    }
    if (result != null) {
      response.json(result);
    } else {
      response.json({});
    }
  });
};