import { Injectable } from '@angular/core';
import {Entity} from "./models/entity.model";
import {AbilitiesService} from "./abilities.service";
import {Effects} from "./models/effects.model";

@Injectable()
export class EffectsService {

  constructor(private abilityService: AbilitiesService) { }

  percentOfHealth : number = 0.03;
  private effects: Effects = new Effects();

  bleedEffect (entity,effect){
    entity.health -= Math.round( (3 / (effect.duration+1)) * entity.health * this.percentOfHealth);
  }
  chickenEffect (entity,effect){
    let chicken = new Entity('Chicken',entity.side,entity.health,1,0,20,-1,0,[this.abilityService.get('pluckAttack'),this.abilityService.get('pluckAttack'),this.abilityService.get('pluckAttack')]);
    if(effect.duration >= 2) {
      effect.entity = JSON.parse(JSON.stringify(entity));
      chicken.activeEffects = entity.activeEffects;
      Object.keys(chicken).forEach((key)=> {entity[key] = chicken[key];});}
    if (effect.duration == 0)
      Object.keys(entity).forEach((key)=> {entity[key] = (key!='health'&&key!='activeEffects') ? effect.entity[key] : entity[key];});
  }
  venomEffect (entity,effect) {
   entity.health -= Math.round((effect.duration+1) * entity.health * this.percentOfHealth);
  }

  getFunction(string,entity,effect){
    if(string === 'Venom Effect')
      return this.venomEffect(entity,effect);
    if (string === 'Bleed Effect')
      return this.bleedEffect(entity,effect);
    if(string === "Chicken Effect")
      return this.chickenEffect(entity,effect);
  }
}
