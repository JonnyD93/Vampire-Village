var admin = require("firebase-admin");
var db = admin.database();

module.exports = app => {
  app.route('/getRoom')
    .post((req, res) => {
      const request = req.body;
      const roomId = request.roomId;
      db.ref(`rooms/${roomId}`).once('value',
        (snapshot) => res.send( snapshot.val()),
        (e) => console.log(e));
    });
};


