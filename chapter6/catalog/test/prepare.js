var mongoose = require('mongoose');

/**
This is how to create a new database and an new user for this app.

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