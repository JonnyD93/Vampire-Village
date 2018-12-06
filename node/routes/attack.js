let admin = require("firebase-admin"),
  db = admin.database(),
  turnSystem = require("../utils/turnSystem");

module.exports = app => {
  app.route('/attack')
    .post((req, res) => {
      const request = req.body,
       roomId = request.roomId,
       attackerId = request.attacker,
       defenderId = request.defender;
      db.ref(`rooms/${roomId}`).once('value', snapshot => {
        (snapshot.val().currentTurn === attackerId) ? turnSystem.playerAttack(attackerId, defenderId, roomId,snapshot.val())
          : res.send({playersTurn: false});
          res.send({data: snapshot.val().currentTurn === attackerId });
        }, (e) => console.log(e));
    });
};

