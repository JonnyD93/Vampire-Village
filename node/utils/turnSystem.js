// Import Admin SDK
let admin = require("firebase-admin"),
  // Get a database reference
  db = admin.database(),
  room = {dbRoom: [], interval, entities: [], turnTime: 0, turns: []};
  dbRoom = [],
  interval,
  entities = [],
  turnTime = 0,
  turns = [];

const getDatabaseUpdates = (roomId) => {
  db.ref(`rooms/${roomId}`).once('value', (snapshot) => dbRoom = snapshot.val().sides, (e) => console.log(e))
    .then(() => sortRoom(roomId));
  },
  updateCurrentTurn = (roomId) => {
  console.log(turns[0], turns, 'Take 2')
    db.ref(`rooms/${roomId}`).update({currentTurn: (turns[0]) ? turns[0] : sortTurns(roomId)});
    return turns[0];
    },
  updateTurnTime = (time, roomId) => {
  db.ref(`rooms/${roomId}`).update({turnTime: time});
  },
  sortRoom = (roomId) => {
  dbRoom.forEach((side) => side.forEach((account) => account.entities.forEach((entity) => entities.push(entity))));
  runTurns(roomId);
  },
  sortTurns = (roomId) => {
    // this.checkTeamDefeated();
    turns = [];
    entities.sort((a, b) => {
      if (a.attributes.agility < b.attributes.agility)
        return 1;
      if (a.attributes.agility > b.attributes.agility)
        return -1;
      return 0
    });
    entities.forEach((entity) => turns.push(entity.id));
    return updateCurrentTurn(roomId, turns);
  },
  skipTurn = (entity, roomId) => {
    if (turns[0] === entity.id) {
      turns.popFirst();
      clearInterval(interval);
      updateCurrentTurn(roomId);
      runTurns(roomId);
    }
  };

async function runTurns(roomId) {
    // this.checkCurrentTurn();
    const entity = updateCurrentTurn(roomId);
    interval = setInterval(() => {
      updateTurnTime(turnTime, roomId);
      turnTime++;
      if (turnTime >= 60) {
        skipTurn(entity, roomId);
      }
      }, 1000);
    // if (!!(entity.activeEffects)) {
    //   this.effectTurn(entity);
    // }
    // entity.abilities.forEach((ability) => ability.currentCooldown--);
    // if (!this.checkAnyActiveAbilities(entity)) {
    //   // console.log('No Active abilities')
    //   return this.skipTurn(entity);
    // }
    // entity.activeTurn = true;
    // if (this.checkIfPlayer(entity)) {
    //   return;
    // } else if (this.checkIfCPU(entity)) {
    //   this.entityAttack(entity);
    //   await
    //   this.delay(1000, 1);
    //   entity.activeTurn = false;
    //   return this.skipTurn(entity);
    // } else {
    //   clearInterval(this.interval);
    //   return;
}

module.exports = {turnTime, getDatabaseUpdates};

// var authUtil = require('url');
// authUtil.helloWorld();
