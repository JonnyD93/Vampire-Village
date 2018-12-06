let admin = require("firebase-admin"),
  gen = require("../utils/generateEntities"),
  turnSystem = require("../utils/turnSystem"),
  db = admin.database();

module.exports = app => {
  app.route('/createPVERoom')
    .post((req, res) => {
      const request = req.body,
        player = request.player,
        vampires = gen.createVampire(request.level),
        teamNames = [request.teamName, 'Vampires'],
        room = [],
        roomRef = db.ref('rooms').push();
      // Temporary Solution until the loading sequence & more rooms are setup!
      player.forEach(entity => room.push(entity));
      vampires.forEach(entity => room.push(entity));
      // Sets up the database initially
      roomRef.set({ sides: [player, vampires], teamNames: teamNames, room: room,  turnTime: 0});
      // Updates the user's roomId to the room, and then starts the turnSystem.
      db.ref(`users/${request.userId}`).update({roomId: roomRef.key}).then(() => {turnSystem.getDatabaseUpdates(roomRef.key);
        res.send({id: roomRef.key});
      });
    });
};


