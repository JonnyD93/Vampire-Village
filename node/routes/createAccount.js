let admin = require("firebase-admin"),
  db = admin.database();

module.exports = app => {
  app.route('/createAccount')
    .post((req, res) => {
      const request = req.body;
      const account = {
        teamName: request.teamName,
        level: 0,
        experience: 0,
        games: {wins: 0, kills: 0, loses: 0, quits: 0},
        rank: 0
      };
      db.ref(`users/${request.userId}`).set(account).then(() => res.send(Object.assign(account, {id: request.userId})));
    });
};
