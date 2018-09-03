var admin = require("firebase-admin");
var Character = require("../models/character");
var db = admin.database();

module.exports = app => {
  app.route('/createCharacter')
    .post((req, res) => {
      const request = req.body;
      const char = new Character(request.character.name, request.character.attributes.health,
        request.character.attributes.attack, 0, request.character.attributes.accuracy,
        request.character.attributes.agility, request.character.attributes.resistance);
      console.log(request.userId, 'console.log(())')
      db.ref('characters/' + request.userId).push().set(char, () => db.ref('characters/' + request.userId)
        .once('value', (snapshot) => res.send(snapshot.val())));
    });
};
