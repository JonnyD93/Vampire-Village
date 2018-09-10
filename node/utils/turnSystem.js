// Import Admin SDK
let admin = require("firebase-admin"),
  // Get a database reference
  db = admin.database();

const startTurnTime = Date.now(),
  turnTime = (time) => time - startTurnTime,
  updateCurrentTurn = (roomId, turns) => {
    db.ref(`rooms/${roomId}`).update({currentTurn: (this.turns[0]) ? this.turns[0] : this.sortTurns()});
  },
  sortTurns = (room, turns) => {
    this.checkTeamDefeated();
    turns = [];
    room.sort((a, b) => {
      if (a.attributes.agility < b.attributes.agility) {
        return 1;
      }
      if (a.attributes.agility > b.attributes.agility) {
        return -1;
      }
      return 0;
    });
    room.forEach((entity) => {
      turns.push(entity.id);
    });
    this.updateCurrentTurn();
    return this.currentTurn;
  },
  skipTurn = (entity, turns, roomId) => {
    if (turns[0] === entity.id) {
      turns.splice(0, 1);
      entity.activeTurn = false;
      updateCurrentTurn(roomId, turns);
      runTurns();
    }
  }
  runTurns = () => {
    this.checkCurrentTurn();
    const entity = this.getActiveEntity();
    this.interval = setInterval(() => {
      this.updateTurnTime(this.turnTime);
      this.turnTime++;
      if (this.turnTime >= 60) {
        this.skipTurn(entity);
      }
    }, 1000);
    if (!!(entity.activeEffects)) {
      this.effectTurn(entity);
    }
    entity.abilities.forEach((ability) => ability.currentCooldown--);
    if (!this.checkAnyActiveAbilities(entity)) {
      // console.log('No Active abilities')
      return this.skipTurn(entity);
    }
    entity.activeTurn = true;
    if (this.checkIfPlayer(entity)) {
      return;
    } else if (this.checkIfCPU(entity)) {
      this.entityAttack(entity);
      await
      this.delay(1000, 1);
      entity.activeTurn = false;
      return this.skipTurn(entity);
    } else {
      clearInterval(this.interval);
      return;
    }
  };
module.exports = {turnTime, startTurnTime, runTurns};

// var authUtil = require('url');
// authUtil.helloWorld();

}
