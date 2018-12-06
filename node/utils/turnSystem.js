// Import Admin SDK  && Get a database reference
let admin = require("firebase-admin"), db = admin.database();
let combatUtils = require("./combatUtils.js");

const checkIfCPU = entity => entity.id.length < 10,
  checkGameEnd = lobby => {
    const allTeams = lobby.dbRoom.length, accounts = [];
    // Gets all the different accountIds from the room & pushes it to the accounts Array
    lobby.room.forEach(entity => (accounts.find(accountId => accountId === entity.accountId) === undefined) ? accounts.push(entity.accountId): null);
    // Using accountIds, sorts out the different Teams, & checks if there is a player that still is on the opposing team.
    (allTeams > accounts.length) ? db.ref(`rooms/${lobby.roomId}`).update({gameEnded: true}) : null;
  },
  getDatabaseUpdates = roomId => {
    let dbRoom = undefined;
    db.ref(`rooms/${roomId}`).once('value', snapshot => dbRoom = snapshot.val(), e => console.log(e))
      .then(() => runTurns(setupLobby(roomId, dbRoom))).catch(e => console.log(e, 'Promise error'))
  },
  entityAttack = (entity, lobby) => { // Entity Ai
    const enemies = lobby.room.filter(entityB => entityB.accountId !== entity.accountId),
      defender = (enemies[Math.floor(Math.random() * enemies.length)]); // Finding the actual defender or target
    combatUtils.damageCalculation(entity, defender, combatUtils.rndInt(entity.abilities.length - 1), lobby); // Running Damage Calculation on it
  },
  playerAttack = (attackerId, defenderId, roomId, dbRoom) => {
    let lobby = resetupLobby(roomId, dbRoom),
      attacker = lobby.room.find(entity => entity.id === attackerId),
      defender = lobby.room.find(entity => entity.id === defenderId);
    console.log(defenderId, attacker, 'check this');
    if (defender !== undefined) {
      combatUtils.damageCalculation(attacker, defender, 0, lobby);
      skipTurn(attacker, lobby);
      runTurns(lobby);
    } else {
      checkGameEnd(lobby);
    }
  },
  updateCurrentTurn = lobby => {
    let currentTurn = (lobby.turns.length < 1) ? sortTurns(lobby) : lobby.turns[0];
    db.ref(`rooms/${lobby.roomId}`).update({currentTurn: currentTurn});
    return lobby.room.find(entity => entity.id === lobby.turns[0]);
  },
  updateRoom = lobby => db.ref(`rooms/${lobby.roomId}`).update({
    turns: lobby.turns,
    dead: lobby.dead,
    room: lobby.room,
    turnTime: new Date()
  }),
  setupLobby = (roomId, dbRoom) => {
    let lobby = {roomId: roomId, dead: [], dbRoom: dbRoom.sides, room: dbRoom.room, timeStamp: new Date(), turns: []};
    return lobby;
  },
  resetupLobby = (roomId, dbRoom) => ({
    roomId: roomId, dead: !!(dbRoom.dead) ? dbRoom.dead : [], dbRoom: dbRoom.sides, room: dbRoom.room,
    timeStamp: new Date(), turns: (dbRoom.turns !== []) ? dbRoom.turns : []
  }),
  skipTurn = (entity, lobby) => {
    if (lobby.turns[0] === entity.id) {
      lobby.turns.splice(lobby.turns.indexOf(entity.id), 1);
      runTurns(lobby);
    }
  },
  sortTurns = lobby => {
    // this.checkTeamDefeated();
    lobby.turns = [];
    lobby.room.sort((a, b) => {
      if (a.attributes.agility < b.attributes.agility)
        return 1;
      if (a.attributes.agility > b.attributes.agility)
        return -1;
    });
    lobby.room.forEach(entity => lobby.turns.push(entity.id));
    return lobby.turns[0];
  },
  runTurns = lobby => {
    // this.checkCurrentTurn();
    const entity = updateCurrentTurn(lobby);
    // if (!!(entity.activeEffects)) {
    //   CombatUtils.effectTurn(entity, lobby);
    // }
    // entity.abilities.forEach((ability) => ability.currentCooldown--);
    // if (!this.checkAnyActiveAbilities(entity)) {
    //   // console.log('No Active abilities')
    //   return this.skipTurn(entity);
    // }
    // entity.activeTurn = true;
    console.log(lobby.turns, 'turns', entity.id, 'entity');
    if (checkIfCPU(entity)) {
      entityAttack(entity, lobby);
      skipTurn(entity, lobby);
    }
    updateRoom(lobby);
  };

// async function updateTimeStamp(roomId) {
//   db.ref(`rooms/${roomId}`).update({turnTime: new Date()});
// }

module.exports = {getDatabaseUpdates, playerAttack};

