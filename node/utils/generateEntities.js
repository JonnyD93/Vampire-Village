// Import Admin SDK

var admin = require("firebase-admin");
var Entity = require("../models/entity");
var Ability = require("../models/ability");
var Effect = require("../models/effect");

// Get a database reference to our posts
var db = admin.database();
var ref = db.ref("server/saving-data/fireblog/posts");

const rndInt = (x) => Math.round(Math.random() * x),
  rndIntBtw = (x, y) => (rndInt(y) - rndInt(x)) + x,
  createVampire = (lvl) => {
  const vampires = [];
  for (let x = 0; x < (rndInt(lvl / 5)) + 1; x++) {
    // Character name, health, attack, defence, accuracy, agility, resistance, abilities
    const vampire = new Entity('Vampire', rndIntBtw(20 + lvl, 70 + rndInt(lvl * 5)),
      rndIntBtw(rndInt(lvl) + 1, rndInt(lvl * 2)), rndIntBtw(Math.floor(lvl / 5), rndInt(Math.floor(lvl / 2))),
      rndIntBtw(60, 100), rndIntBtw(rndInt(lvl), lvl + 10), rndIntBtw(0, rndInt(lvl)),
      );
    vampire.abilities.push(new Ability('Vampire Scratch', 'health', 'scratched', 1, new Effect('Bleed Effect', 'bleeding', 3,
      "#cc0200"), 30, 1));
    vampire.abilities.push(new Ability('Vampire Bite', 'health', 'bit', 1.5, new Effect('Vampirism', 'vampirism slowly consumes the soul', 10,
      "#666666"), 10, 3));
    vampire.id = `${x}`;
    vampires.push(vampire);
  }
  return vampires;
};
module.exports = {createVampire};

// var authUtil = require('url');
// authUtil.helloWorld();
