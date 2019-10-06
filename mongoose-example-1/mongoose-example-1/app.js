var mongoose = require('mongoose');

var Schema = mongoose.Schema;

mongoose.connect('mongodb://catalog_admin:some_password@mongo/catalog');

var itemSchema = new Schema ({
  // "_id" : mongoose.Schema.Types.ObjectId,
  "itemId" : {type: String, index: {unique: true}},
  "itemName": String,
  "price": Number,
  "currency": String,
  "categories": [String]
});

// https://stackoverflow.com/questions/40079200/how-to-declare-collection-name-and-model-name-in-mongoose/40079267
// When the collection is not specified, mongoose will use the collection named as `the name of the model` + `s`.
var CatalogItem = mongoose.model('item', itemSchema);

/**
This is how to create a new database and an new user for this test.

> use catalog
> db.createUser(
   {
     user: "catalog_admin",
     pwd: "some_password",
     roles: [ { role: "readWrite", db: "catalog" } ]
   }
 )
>  db.items.insert(
  [
    {
        "itemId": "3",
        "itemName": "Sports Watch 11",
        "price": 99,
        "currency": "USD",
        "categories": [
            "Watches"
        ]
    },
    {
        "itemId": "9",
        "itemName": "Sports Watch 4",
        "price": 100,
        "currency": "EUR",
        "categories": [
            "Watches",
            "Sports Watches"
        ]
    },
    {
        "itemId": "2",
        "itemName": "Sports Watch 2",
        "price": 100,
        "currency": "EUR",
        "categories": [
            "Watches",
            "Sports Watches"
        ]
    }
]
)
> db.Item.find({})
>
 */


CatalogItem.find({}, (error, result) => {
  console.log(result);
  if (error) {
    console.error(error);
  }
  if (result != null) {
    console.log(result);
  } else {
    console.log(result);
  }
});
