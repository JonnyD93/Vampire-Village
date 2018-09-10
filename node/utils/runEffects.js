// Import Admin SDK
var admin = require("firebase-admin");

const percentOfHealth = 0.03,
  bleedEffect = (entity, effect) => entity.attributes.health -=
    Math.round((3 / (effect.duration + 1)) * entity.attributes.health * this.percentOfHealth),
  vampirism = (entity, effect) =>
    entity.attributes.health -= Math.round((effect.duration + 1) * entity.attributes.health * this.percentOfHealth),
  venomEffect = (entity, effect) =>
    entity.attributes.health -= Math.round((effect.duration + 1) * entity.attributes.health * this.percentOfHealth),
  getEffect = (string, entity, effect) => {
    if (string === 'Venom Effect')
      return this.venomEffect(entity, effect);
    if (string === 'Bleed Effect')
      return this.bleedEffect(entity, effect);
    // if (string === 'Chicken Effect')
    //   return this.chickenEffect(entity, effect);
    if (string === 'Vampirism')
      return this.vampirism(entity, effect);
  }
module.exports = {getEffect};

// chickenEffect(entity, effect) {
//   const chicken = new Entity('Chicken', entity.health, 1, 0, 20, -1, 0,
//     [this.abilities.find((ability) => ability.name === 'Pluck'), this.abilities.find((ability) => ability.name === 'Pluck'),
//       this.abilities.find((ability) => ability.name === 'Pluck')]);
//   if (effect.duration >= 2) {
//     effect.entity = JSON.parse(JSON.stringify(entity));
//     chicken.activeEffects = entity.activeEffects;
//     Object.keys(chicken).forEach((key) => {
//       entity[key] = chicken[key];
//     });
//   }
//   if (effect.duration === 0) {
//     Object.keys(entity).forEach((key) => {
//       entity[key] = (key !== 'health' && key !== 'activeEffects') ? effect.entity[key] : entity[key];
//     });
//   }
// }
