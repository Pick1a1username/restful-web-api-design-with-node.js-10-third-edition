var fs = require('fs');

const model = require('../model/item');
const CatalogItem = model.CatalogItem;

const contentTypeJson = {
	'Content-Type' : 'application/json'
};
const contentTypePlainText = {
	'Content-Type' : 'text/plain'
};


// function readCatalogSync() {
//   var file = './data/catalog.json';
//   if (fs.existsSync(file)) {
//     var content = fs.readFileSync(file);
//     var catalog = JSON.parse(content);
//     console.log(catalog);
//     return catalog;
//   }
//   return undefined;
// };

// exports.findItems = function(categoryId) {
//   console.log('Returning all items for categoryId: ' + categoryId);
//   var catalog = readCatalogSync();
//   if (catalog) {
//     var items = [];
//     for (var index in catalog.catalog) {
//       if (catalog.catalog[index].categoryId === categoryId) {
//         var category = catalog.catalog[index];
//         for (var itemIndex in category.items) {
//           items.push(category.items[itemIndex]);
//         }
//       }
//     }
//     return items;
//   }
//   return undefined;
// };

// exports.findItem = function(categoryId, itemId) {
//   console.log('Looking for item with id' + itemId);
//   var catalog = readCatalogSync();
//   if (catalog) {
//     for (var index in catalog.catalog) {
//       if (catalog.catalog[index].categoryId === categoryId) {
//         var category = catalog.catalog[index];
//         for (var itemIndex in category.items) {
//           if (category.items[itemIndex].itemId === itemId) {
//             return category.items[itemIndex];
//           }
//         }
//       }
//     }
//   }
//   return undefined;
// };

// exports.findCategories = function() {
//   console.log('Returning all categories');
//   var catalog = readCatalogSync();
//   if (catalog) {
//     var categories = [];
//     for (var index in catalog.catalog) {
//       var category = {};
//       category["categoryId"] = catalog.catalog[index].categoryId;
//       category["categoryName"] = catalog.catalog[index].categoryName;

//       categories.push(category);
//     }
//     return categories;
//   }
//   return [];
// };

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

exports.findItemsByCategory = function (key, value, response) {
  var filter = {};
  filter[key] = value;

  CatalogItem.find(filter, function(error, result) {
    if (error) {
      console.error(error);
      response.writeHead(500, contentTypePlainText);
      response.end('Internal server error');
      return;
    } else {
      if (!result) {
        if (response != null) {
          response.writeHead(200, contentTypeJson);
          response.end('{}');
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

exports.findItemById = function (gfs, request, response) {
  CatalogItem.findOne({itemId: request.params.itemId}, function(error, result) {
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

      var options = {
        filename: result.itemId,
      };
      
      gfs.exist(options, function(error, found) {
        if (found) {
          response.setHeader('Content-Type', 'application/json');
          var imageUrl = request.protocol + '://' + request.get('host') + request.baseUrl + request.path + '/image';
          response.setHeader('Image-Url', imageUrl);
          response.send(result);
        } else {
          response.json(result);
        }
      });
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

exports.findItemsByAttribute = function (key, value, response) {
  var filter = {};
  filter[key] = value;
  CatalogItem.find(filter, function(error, result) {
    if (error) {
      console.error(error);
      response.writeHead(500, contentTypePlainText);
      response.end('Internal server error');
      return;
    } else {
      if (!result) {
        if (response != null) {
          response.writeHead(200, contentTypeJson);
          response.end({});
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

exports.saveImage = function(gfs, request, response) {
  var writeStream = gfs.createWriteStream({
    filename: request.params.itemId,
    mode: 'w'
  });

  writeStream.on('error', function(error) {
    response.send('500', 'Internal Server Error');
    console.log(error);
    return;
  });

  writeStream.on('close', function() {
    readImage(gfs, request, response);
  });

  request.pipe(writeStream);
};

function readImage(gfs, request, response) {
  var imageStream = gfs.createReadStream({
    filename: request.params.itemId,
    mode: 'r'
  });

  imageStream.on('error', function(error) {
    console.log(error);
    response.send('404', 'Not found');
    return;
  });

  var itemImageUrl = request.protocol + '://' + request.get('host') + request.baseUrl + request.path;
  var itemUrl = itemImageUrl.substring(0, itemImageUrl.indexOf('/image'));
  response.setHeader('Content-Type', 'image/jpeg');
  response.setHeader('Item-Url', itemUrl);
  imageStream.pipe(response);
};

exports.getImage = function(gfs, itemId, response) {
  readImage(gfs, itemId, response);
};

exports.deleteImage = function(gfs, mongodb, itemId, response) {
  console.log('Deleting image for itemId: ' + itemId);

  var options = {
    filename: itemId,
  };

  var chunks = mongodb.collection('fs.files.chunks');
  chunks.remove(options, function (error, image) {
    if (error) {
      console.log(error);
      response.send('500', 'Internal Server Error');
      return;
    } else {
      console.log('Successfully deleted image for item: ' + itemId);
    }
  });

  var files = mongodb.collection('fs.files');
  files.remove(options, function (error, image) {
    if (error) {
      console.log(error);
      response.send('500', 'Internal Server Error');
      return;
    }

    if (image === null) {
      response.send('404', 'Not found');
      return;
    } else {
      console.log('Successfully deleted image for primary item: ' + itemId);
      response.json({'deleted': true});
    }
  });
};

exports.paginate = function(model, request, response) {
  var pageSize = request.query.limit;
  var page = request.query.page;

  if (pageSize === undefined) {
    console.log('No limit specified');
    pageSize = 100;
  }

  if (page === undefined) {
    console.log('No page specified');
    page = 1;
  }

  model.paginate({}, {page: page, limit: pageSize}, function (error, result) {
    if (error) {
      console.log(error);
      response.writeHead('500', {'Content-Type' : 'text/plain'});
      response.end('Internal Server Error');
    } else {
      response.json(result);
    }
  });
};