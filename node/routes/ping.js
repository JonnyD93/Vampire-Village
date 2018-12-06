let admin = require("firebase-admin"),
  db = admin.database(),
  turnSystem = require("../utils/turnSystem");

module.exports = app => {
  app.route('/ping')
    .post((req, res) => {
      const request = req.body,
       roomId = request.roomId;
      db.ref(`rooms/${roomId}`).once('value', snapshot => {
        turnSystem.getDatabaseUpdates(roomId)
        }, (e) => console.log(e));
      console.log('once');
    });
};

