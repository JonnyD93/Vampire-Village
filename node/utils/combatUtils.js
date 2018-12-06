let Effect = require("../utils/runEffects");
// turnSystem = require('./turnSystem');

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
      lobby.dead.push(entity.id);
      lobby.room.splice(lobby.room.indexOf(entity), 1);
      if (lobby.turns.indexOf(entity.id) !== -1) {
        lobby.turns.splice(lobby.turns.indexOf(entity.id), 1);
      }
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
  effectCalculation = (defender, effect, lobby) => { // Calculates the Effect damage for that turn
    Effect.getEffect(effect.name, defender, effect);
    checkDead(defender, lobby);
  },
  damageCalculation = (attacker, defender, abilitySelected, lobby) => {
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
        } else if ((attack - defend) <= 0) {
        } else if ((attack - defend) > 0) {
          defender.attributes.health -= (attack - defend);
          checkDead(defender, lobby);
        }
      } else {
        defender.attributes[type] = (defender.attributes[type] - attacker.attributes.attack >= 0)
          ? defender.attributes[type] - attack : 0;
      }
    }
  };

module.exports = {damageCalculation, rndInt};
