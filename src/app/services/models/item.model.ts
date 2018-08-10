import {Ability} from "./ability.model";

export class Item {
  name: string;
  description: string;
  type: string;
  set: string;
  rarity: number;
  itemVariable: number;
  itemAbilities: Ability[];

  constructor(name, description, set, type, rarity, itemVariable, itemAbilities){
    this.name = name;
    this.description = description;
    this.set = set;
    this.type = type;
    this.itemVariable = itemVariable;
    this.rarity = rarity;
    this.itemAbilities = itemAbilities;
  }
}
