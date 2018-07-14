import {Ability} from "./ability.model";
import {Effect} from "./effect.model";
import {Item} from "./item.model";
import {ItemsService} from "../items.service";

export class Entity {
  name: string;
  side: string;
  health: number;
  attack: number;
  defense: number;
  accuracy: number;
  agility: number;
  resistance: number;
  abilities: Ability[];
  activeEffects: Effect[];
  inventory: Item[];

  constructor(name,side,health,attack, defense, accuracy, agility,resistance, abilities ){
    this.name = name;
    this.side = side;
    this.health = health;
    this.attack = attack;
    this.defense = defense;
    this.accuracy = accuracy;
    this.agility = agility;
    this.abilities = abilities;
    this.resistance = resistance;
    this.activeEffects = [];
    this.inventory = [];
  }
}
