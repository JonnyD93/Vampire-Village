let admin = require("firebase-admin"),
  gen = require("../utils/generateEntities"),
  turnSystem = require("../utils/turnSystem"),
  db = admin.database();

module.exports = app => {
  app.route('/createPVERoom')
    .post((req, res) => {
      const request = req.body;
      const player = request.player;
      const vampires = {entities: gen.createVampire(request.level), teamName: 'Vampires', cpu: true};
      const roomRef = db.ref('rooms').push();
      roomRef.set({ sides: [[player], [vampires]], turnTime: 0});
      db.ref(`users/${request.userId}`).update({roomId: roomRef.key}).then(() => {
        turnSystem.getDatabaseUpdates(roomRef.key);
        res.send({id: roomRef.key});
      });
    });
};


