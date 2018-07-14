import {AbilitiesService} from "../abilities.service";
import {Ability} from "./ability.model";

export class Item {
  name: string;
  description: string;
  type: string;
  rarity: number;
  itemVariable: number;
  itemAbilities: Ability[];

  constructor(name, description, type, rarity,itemVariable, itemAbilities){
    this.name = name;
    this.description = description;
    this.type = type;
    this.itemVariable = itemVariable;
    this.rarity = rarity;
    this.itemAbilities = itemAbilities;
  }
}
