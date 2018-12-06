let admin = require("firebase-admin"),
  db = admin.database();
module.exports = app => {
  app.route('/skipPlayerTurn')
    .post((req, res) => {
      const request = req.body;
      const roomId = request.roomId;
      const entityId = request.entityId;
      db.ref(`rooms/${roomId}`).once('value', (snapshot) => res.send( snapshot.val()), (e) => console.log(e));
    });
};

