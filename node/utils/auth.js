// Import Admin SDK
var admin = require("firebase-admin");

// Get a database reference to our posts
var db = admin.database();
var ref = db.ref("server/saving-data/fireblog/posts");

// Attach an asynchronous callback to read the data at our posts reference
ref.on("value", function(snapshot) {
  console.log(snapshot.val());
}, function (errorObject) {
  console.log("The read failed: " + errorObject.code);
});


const helloWorld = () => console.log('hello world');

module.exports = {helloWorld};

// var authUtil = require('url');
// authUtil.helloWorld();
