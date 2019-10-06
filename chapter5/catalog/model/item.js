var mongoose = require('mongoose');

var Schema = mongoose.Schema;

mongoose.connect('mongodb://catalog_admin:some_password@mongo/catalog');

var itemSchema = new Schema ({
  "itemId" : {type: String, index: {unique: true}},
  "itemName": String,
  "price": Number,
  "currency": String,
  "categories": [String]
});

var CatalogItem = mongoose.model('Item', itemSchema);

module.exports = {CatalogItem : CatalogItem, connection : mongoose.connection};