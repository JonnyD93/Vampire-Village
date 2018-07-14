import { Injectable } from '@angular/core';
import {Ability} from "./models/ability.model";
import {Effects} from "./models/effects.model";
import {AbilitiesService} from "./abilities.service";
import {Item} from "./models/item.model";

@Injectable()
export class ItemsService {
  items: any;

  constructor(private abilitiesService: AbilitiesService) {
    let items: any = {};
    items.helm =  new Item("Helm","Cap for ya head", "defense",0,3,null);
    items.dagger =  new Item("dagger","dagga for ya hand", "attack",0,2,[abilitiesService.get('stabAttack')]);
    items.chickenStave =  new Item("Mistic Chicken Stave","Puk Puk Pukaaak", "attack",5,0,[abilitiesService.get('pluckAttack')]);
    items.sword =  new Item("Sword","swwwword for ya hand", "attack",0,5,[abilitiesService.get('stabAttack'),abilitiesService.get('slashAttack')]);
    this.items = items;
  }

  get(name){
    return Object.assign({},this.items[name]);
  }
  getAll(){
    return this.items;
  }

}
