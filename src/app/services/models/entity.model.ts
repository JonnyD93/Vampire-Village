import {Ability} from './ability.model';
import {Effect} from './effect.model';
import {Item} from './item.model';

export class Entity {
  name: string;
  stats: {level: number, experience: number, kills: number };
  attributes: {health: number, attack: number, defense: number, accuracy: number, agility: number, resistance: number};
  abilities: Ability[];
  activeEffects: Effect[];
  inventory: Item[];

  constructor(name, health, attack, defense, accuracy, agility, resistance, abilities) {
    this.name = name;
    this.stats = {level: 0, experience: 0, kills: 0 };
    this.attributes = {health: health, attack: attack, defense: defense, accuracy: accuracy, agility: agility, resistance: resistance};
    this.abilities = abilities;
    this.activeEffects = [];
    this.inventory = [];
  }
}
