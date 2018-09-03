module.exports = class {

  constructor(name, type, description, damageMultiplier, effect, effectChance, cooldown){
    this.name = name;
    this.type = type;
    this.damageMultiplier = damageMultiplier;
    this.effect = effect;
    this.effectChance = effectChance;
    this.description = description;
    this.cooldown = cooldown;
    this.currentCooldown = 0;
  }
};
