// Import Admin SDK
let admin = require("firebase-admin"),
  // Get a database reference
  db = admin.database();

const checkIfCPU = (lobby, entity) => {
    let boolean = false;
    lobby.dbRoom.forEach((team) => team.filter((account) => account.cpu === true).forEach((account) =>
      account.entities.forEach((entity1) => boolean = (entity1.id === entity.id))));
    return boolean;
  },
  getDatabaseUpdates = (roomId) => {
    let dbRoom = undefined;
    db.ref(`rooms/${roomId}`).once('value', (snapshot) => dbRoom = snapshot.val().sides, (e) => console.log(e))
      .then(() => setupLobby(roomId, dbRoom));
  },
  updateCurrentTurn = (lobby) => {
    db.ref(`rooms/${lobby.roomId}`).update({currentTurn: (lobby.turns[0]) ? lobby.turns[0] : sortTurns(lobby)});
    return lobby.room.find((entity) => entity.id = lobby.turns[0]);
  },
  updateTimeStamp = (roomId) => {
    db.ref(`rooms/${roomId}`).update({turnTime: new Date()});
  },
  setupLobby = (roomId, dbRoom) => {
    let lobby = {roomId: roomId, dbRoom: dbRoom, room: [], timeStamp: new Date(), turns: []};
    dbRoom.forEach((side) => side.forEach((account) => account.entities.forEach((entity) => lobby.room.push(entity))));
    runTurns(lobby);
  },
  sortTurns = (lobby) => {
    // this.checkTeamDefeated();
    lobby.turns = [];
    lobby.room.sort((a, b) => {
      if (a.attributes.agility < b.attributes.agility)
        return 1;
      if (a.attributes.agility > b.attributes.agility)
        return -1;
      return 0
    });
    lobby.room.forEach((entity) => lobby.turns.push(entity.id));
    return updateCurrentTurn(lobby);
  },
  skipTurn = (entity, lobby) => {
    if (lobby.turns[0] === entity.id) {
      lobby.turns.popFirst();
      updateCurrentTurn(lobby);
      runTurns(lobby);
    }
  };

async function runTurns(lobby) {
  // this.checkCurrentTurn();
  const entity = updateCurrentTurn(lobby);
  updateTimeStamp(lobby.roomId);
  // if (!!(entity.activeEffects)) {
  //   this.effectTurn(entity);
  // }
  // entity.abilities.forEach((ability) => ability.currentCooldown--);
  // if (!this.checkAnyActiveAbilities(entity)) {
  //   // console.log('No Active abilities')
  //   return this.skipTurn(entity);
  // }
  // entity.activeTurn = true;
  if(checkIfCPU(lobby, entity)) {
    // entityAttack(entity);
  }
  // if (this.checkIfPlayer(entity)) {
  //   return;
  // } else if (this.checkIfCPU(entity)) {
  //   this.entityAttack(entity);
  //   await
  //   this.delay(1000, 1);
  //   entity.activeTurn = false;
  //   return this.skipTurn(entity);
  // }// else {
  //   clearInterval(this.interval);
  //   return;
}

module.exports = {getDatabaseUpdates};

// var authUtil = require('url');
// authUtil.helloWorld();
