var mongoose = require('mongoose');

// This is how to create a new database and an new user for this test.
//
// > use catalog
// switched to db catalog
// > db.createUser(
// ...   {
// ...     user: "catalog_admin",
// ...     pwd: "some_password",
// ...     roles: [ { role: "readWrite", db: "catalog" } ]
// ...   }
// ... )
// Successfully added user: {
// 	"user" : "catalog_admin",
// 	"roles" : [
// 		{
// 			"role" : "readWrite",
// 			"db" : "catalog"
// 		}
// 	]
// }
// > 

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