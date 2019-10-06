var mongoose = require('mongoose');

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
>  db.catalog.insert(
  {
    "categoryName" : "Watches",
    "categoryId" : "1",
    "itemsCount" : 2,
    "items" : [{
            "itemId" : "item-identifier-1",
            "itemName":"Sports Watch",
            "price": 150,
            "currency" : "EUR"
     },
     {
             "itemId" : "item-identifier-2",
             "itemName":"Waterproof Sports Watch",
             "price": 180,
             "currency" : "EUR"
    }]
}
)
> db.collection.find({})
>
 */

beforeEach(function (done) {
  function clearDatabase() {
    for (var i in mongoose.connection.collections) {
      mongoose.connection.collections[i].remove(function() {});
    }
    return done();
  }
  if (mongoose.connection.readyState === 0) {
    // mongoose.connect(config.db.test, function (err) {
    mongoose.connect('mongodb://catalog_admin:some_password@mongo/catalog', function (err) {
      if (err) {
        throw err;
      }
      return clearDatabase();
    });
  } else {
    return clearDatabase();
  }
});

afterEach(function (done) {
  mongoose.disconnect();
  return done();
});