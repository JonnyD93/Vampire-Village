import { Injectable } from '@angular/core';
import {Ability} from "./models/ability.model";
import {Effects} from "./models/effects.model";

@Injectable()
export class AbilitiesService {
  abilities: any;
  private effects: Effects;

  constructor() {
    this.effects = new Effects();
    let abilities: any = {};
    // Ability Creation : name type desc damageMultiplier effect effectChance cooldown
    abilities.basicAttack =  new Ability('Basic Attack','health','punched',1,null,null,2);
    abilities.venomAttack =  new Ability('Spit Venom','health','spewed venom on',1.4, this.effects.getVenomEffect(),90,5);
    abilities.pluckAttack =  new Ability('Pluck','health','plucked',0.5, this.effects.getChickenEffect(),100,10);
    abilities.stabAttack =  new Ability('Stab','health','stabbed',1.5, this.effects.getBleedEffect(),100,3);
    abilities.slashAttack =  new Ability('Slash','health','slashed',1.5, this.effects.getBleedEffect(),75,8);

    this.abilities = abilities;
  }

  get(name){
    return JSON.parse(JSON.stringify(Object.assign({},this.abilities[name])));
  }
  getAll(){
    return this.abilities;
  }

}
