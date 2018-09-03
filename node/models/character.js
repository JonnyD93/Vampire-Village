module.exports = class {

  constructor(name, health, attack, defense, accuracy, agility, resistance){
    this.name = name;
    this.stats = {level: 0, experience: 0, kills: 0 };
    this.attributes = {health: health, attack: attack, defense: defense, accuracy: accuracy, agility: agility, resistance: resistance};
    this.abilities = [];
    this.activeEffects = [];
    this.inventory = [];
  }

  isDead(){
    return this.health <= 0;
  }

};

// const Character = require('../models/character');
//
// let character = new Character('dave', 0);
