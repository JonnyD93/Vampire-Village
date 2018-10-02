let Effect = require("../utils/runEffects");

const rndInt = (x) => Math.round(Math.random() * x),
  applyEffect = (defender, ability) => {
    if (ability.effect !== undefined && (ability.effectChance >= rndInt(100 + defender.attributes.resistance))) {
      // this.updateReport(`${defender.name} is now ${ability.effect.desc} : ability.effect.color`);
      defender.activeEffects = (!!defender.activeEffects) ? defender.activeEffects : [];
      defender.activeEffects.push(JSON.parse(JSON.stringify(ability.effect)));
    }
  },
  checkDead = (entity, lobby) => {
    if (entity.attributes.health <= 0) {
      lobby.room.splice(lobby.room.indexOf(entity), 1);
      if (lobby.turns.indexOf(entity.id) !== -1) {
        lobby.turns.splice(lobby.turns.indexOf(entity.id), 1);
      }
//       // this.updateDisplays(defender);
//       this.endGame();
    }
  },
  effectTurn = (entity, lobby) => { // Applies the Effect Damage & Duration of the Effect
    entity.activeEffects.forEach((effect) => {
      effect.duration--;
      return (effect.duration <= -1)
        ? entity.activeEffects.splice(entity.activeEffects.indexOf(effect), 1)
        : effectCalculation(entity, effect, lobby);
    });
  },
  entityAttack = (entity, lobby) => { // Entity Ai
    const enemies = [];
    lobby.dbRoom.forEach(team => team.forEach((account) => (account.entities.indexOf(entity) === -1)
        ? account.entities.forEach(entityB => enemies.push(entityB.id)) : null));
    const enemyId = enemies[Math.floor(Math.random() * enemies.length)]; // Finding the enemy Id to Attack
    const defender = lobby.room.find((target) => (target.id === enemyId)); // Finding the actual defender or target
    damageCalculation(entity, defender, rndInt(entity.abilities.length - 1), lobby); // Running Damage Calculation on it
  },
  effectCalculation = (defender, effect, lobby) => { // Calculates the Effect damage for that turn
    Effect.getEffect(effect.name, defender, effect);
    checkDead(defender, lobby);
  },
  damageCalculation = (attacker, defender, abilitySelected) => {
    const ability = attacker.abilities[abilitySelected],
      type = ability.type,
      attack = Math.floor(attacker.attributes.attack * attacker.abilities[abilitySelected].damageMultiplier),
      defend = rndInt(defender.attributes.defense);
    ability.currentCooldown = ability.cooldown;
    if ((attacker.attributes.accuracy >= rndInt(100 + defender.attributes.agility))) {
      applyEffect(defender, ability);
      if (type === 'health') {
        if (attack < 0) {
          defender.attributes.health -= attack;
        }
        if ((attack - defend) <= 0) {
        }
        // this.spawnToast(`${defender.name} blocked ${attacker.name} by ${Math.abs(attack - defend)}`, 'blue');
        if ((attack - defend) > 0) {
          // this.spawnToast(`${attacker.name} ${item.description} ${defender.name} for ${attack - defend}`, 'red');
          defender.attributes.health -= (attack - defend);
          checkDead(defender);
        }
      } else {
        defender[type] = (defender[type] - attacker.attributes.attack >= 0) ? defender[type] - attack : 0;
      }
    }
  };

module.exports = {entityAttack, damageCalculation, effectTurn};
