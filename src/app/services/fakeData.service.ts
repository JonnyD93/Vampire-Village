import {Injectable} from '@angular/core';
import {Ability} from "./models/ability.model";
import {Effects} from "./models/effects.model";
import {AbilitiesService} from './abilities.service';
import {ItemsService} from "./items.service";
import {Entity} from "./models/entity.model";

@Injectable()
export class FakeDataService {
  users: any[];
  PlayerData: { accountId: string ,level: number, experience: number, inventory: any[], characters: any[] };

  constructor(private abilitiesService: AbilitiesService, itemsService: ItemsService) {
    let characters = [];
    // Character name, side, health, attack, defence, accuracy, agility, resistance, abilities
    characters.push(new Entity('Jonny', 'human', 250, 15, 50, 100, 10,8, [abilitiesService.get('basicAttack'), abilitiesService.get('venomAttack')]));
    characters.push(new Entity('Howey', 'human', 65, 15, 5, 80, 0,15, [abilitiesService.get('basicAttack')]));
    characters.push(new Entity('James', 'human', 250, 10, 0, 10, 1,10, [abilitiesService.get('basicAttack'), abilitiesService.get('venomAttack')]));
    characters.push(new Entity('Thomas', 'human', 40, 30, 5, 100, 20, 6,[abilitiesService.get('basicAttack')]));
    this.createVampire(30).forEach((entity)=>characters.push(entity));
    for(let x = 0; x<2;x++)
      characters.push(new Entity("Werewolf", 'werewolf', 140, 30, 0, 50, 20,30, [this.abilitiesService.get('basicAttack')]));
    characters[0].inventory.push(itemsService.get('dagger'));
    characters[0].inventory.push(itemsService.get('chickenStave'));
    characters[0].inventory.push(itemsService.get('helm'));
    this.PlayerData = {accountId: '',level: 0, experience: 0, inventory: [], characters: characters};
    this.updateCharacters();
  }
  updateCharacters(){
    for (let character of this.PlayerData.characters) {
      for (let item of character.inventory) {
        character[item.type] += item.itemVariable;
        if (item.itemAbilities != null) {
          for (let ability of item.itemAbilities)
            character.abilities.push(ability);
        }
      }
    }
  }
  rndInt(x: number) {
    return Math.round(Math.random() * x)
  }
  rndIntBtw(x: number, y: number){
    return (this.rndInt(y) - this.rndInt(x)) + x
  }
// Character name, side, health, attack, defence, accuracy, agility, resistance, abilities
  createVampire(level){
    let vampires = [];
    for(let x = 0; x < this.rndInt((level/5)+1); x++) {
      // Character name, side, health, attack, defence, accuracy, agility, resistance, abilities
      vampires.push(new Entity("Vampire","vampire",
        this.rndIntBtw(20+level,70 + this.rndInt(level*5)),
        this.rndIntBtw(this.rndInt(level), this.rndInt(level*2)),
        this.rndIntBtw(Math.floor(level/5),this.rndInt(Math.floor(level/2))),
        this.rndIntBtw(60,100),
        this.rndIntBtw(this.rndInt(level),level+10),
        this.rndIntBtw(0,this.rndInt(level)),
        [this.abilitiesService.get('basicAttack')]));
    }
    return vampires;
  }
}

