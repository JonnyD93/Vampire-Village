var admin = require("firebase-admin");

// Get a database reference to our posts
var db = admin.database();

module.exports = app => {
  app.route('/login')
    .post((req, res) => {
      const request = req.body;
      db.ref('users/' + request.userId).once('value',
        (snapshot) => res.send( (snapshot.val()) ? Object.assign(snapshot.val(), {id: request.userId}) : '404'),
        (e) => console.log(e));


      // const user = {
      //     email: request.email,
      //     password: request.password,
      //     username: request.username
      // };
    });
};
