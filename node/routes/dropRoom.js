let admin = require("firebase-admin"),
  db = admin.database(),
  turnSystem = require("../utils/turnSystem");

module.exports = app => {
  app.route('/dropRoom')
    .post((req, res) => {
      const request = req.body,
       userId = request.accountId;
      db.ref(`users/${userId}`).child('roomId').remove()
    });
};

