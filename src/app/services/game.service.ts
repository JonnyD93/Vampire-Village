import { Injectable } from '@angular/core';
import {AccountService} from "./account.service";
import * as firebase from "firebase";
import {Entity} from "./models/entity.model";
import {Ability} from "./models/ability.model";
import {EffectsService} from "./effects.service";
import {DataService} from "./data.service";

@Injectable()
export class GameService {
  database: any;
  // The entire list of what the database will hold will be removed from here
  // PlayerData: { level: number, experience: number, inventory: any[], characters: any[]};
  // Array for all entitys in the game
  room: any[] = [];
  // Each characters different type of Object Keys, as a separate variable
  //characterDisplays: any = {keys: [], characters: [], healths: []};
  //enemyDisplays: any = {entities: [], healths: []};
  // The turns variable is populated with the turns of the game
  turns: any[] = [];
  // The report of the match
  report: any[] = [];
  // The hits that pop up when a creature is attacked.
  hits: any = [];
  // The amount of time for each turn
  turnTime: any = 0;
  // The interval of the game
  interval: any;
  // The sides of the game
  game: any = {sides: [], started: false};
  currentTurn: any;
  teamDefeated: boolean;
  activeAbilities: boolean;

  constructor(private accountService: AccountService,private dataService: DataService, private effectsService: EffectsService) {
    this.database = firebase.database();
  }
  // Adds a Delay to the TS Cite https://basarat.gitbooks.io/typescript/docs/async-await.html
  async delay(milliseconds: number, count: number): Promise<number> {
    return new Promise<number>(resolve => {setTimeout(() => {resolve(count);}, milliseconds);});
  }

  // Function that returns a random int up to x
  rndInt(x: number) {
    return Math.round(Math.random() * x)
  }
  // //Determines the color of the enemy Entity based on amount of health
  // calcColor(entity, health) {
  //   let x = 100 - ((entity.health / health) * 100);
  //   return `rgb(${x}%,${x}%,${x}%)`;
  // }

  // Function to detect the current Health of the Current Player
  calcHealth(currentHealth, maxHealth) {
    return Math.round((currentHealth / maxHealth) * 100);
  }

  // // Updates the All Displays
  // updateDisplays(defender): void {
  //   return (this.characterDisplays.characters.indexOf(defender) != -1)
  //     ? Object.keys(this.characterDisplays).forEach((key) => {
  //       this.characterDisplays[key].splice(this.characterDisplays.characters.indexOf(defender), 1);
  //     })
  //     : Object.keys(this.enemyDisplays).forEach((key) => {
  //       this.enemyDisplays[key].splice(this.enemyDisplays.entities.indexOf(defender), 1);
  //     });
  // }

  // Checks if the entity is dead
  async checkDead(defender) {
    if (defender.health <= 0) {
      //this.spawnToast(`${defender.name} died`, 'black');
      defender.death = true;
      await this.delay(1000, 1);
      defender.death = false;
      this.turns.splice(this.turns.indexOf(defender), 1);
      this.room.splice(this.room.indexOf(defender), 1);
     // this.updateDisplays(defender);
      this.endGame();
    }
  }
  //
  // // Checks if the Ability is from an Item, and returns that Item's Name
  // checkItemAbility(character, ability) {
  //   let itemName = '';
  //   if (character.inventory.length > 0)
  //     character.inventory.forEach((item) => {
  //       if (item.itemAbilities != null)
  //         item.itemAbilities.forEach((abilityItem) => {
  //           itemName = (ability === abilityItem) ? `( ${item.name} )` : '';
  //         });
  //     });
  //   return itemName;
  // }
  //
  // // Needs to be fixed
  // checkLastActiveAbility(ability) {
  //   return (ability.currentCooldown <= 0);
  // }
  //
  // Checks if a team is defeated
  checkTeamDefeated() {
    this.dataService.get("room",this.accountService.getAccount().roomId, (room) => (this.teamDefeated = (room.sides.length <= 1)));
  }
  //
  // // Function to detect which player is active, and return true or false on it.
  // checkPlayerActive(character) {
  //   return ((this.turns != undefined) && (this.turns[0] === character));
  // }
  //
  // // Creates an hit object to display Players damage on a given target
  // spawnToast(description, style) {
  //   let obj = {styles: {backgroundColor: style}, description: description};
  //   this.hits.push(obj);
  //   this.report.push(description);
  //   setTimeout(() => this.hits.splice(this.hits.indexOf(obj), 1), 5000);
  // }
  //
  // Sorts the Turns based on Agility
  sortTurns() {
    this.turns = [];
    this.room.forEach((entity) => {this.turns.push(entity);});
    this.turns.sort((a, b) => {
      if (a.agility < b.agility)
        return 1;
      if (a.agility > b.agility)
        return -1;
      return 0;
    });
  }

  async damageCalculation(attacker, defender, abilitySelected) {
    let ability = attacker.abilities[abilitySelected];
    let type = ability.type;
    let attack = Math.floor(attacker.attack * attacker.abilities[abilitySelected].damageMultiplier);
    let defend = this.rndInt(defender.defense);
    defender.targeted = true;
    ability.currentCooldown = ability.cooldown;
    if ((attacker.accuracy >= this.rndInt(100 + defender.agility))) {
      this.applyEffect(defender, ability);
      if (type === "health") {
        if (attack < 0)
          defender.health -= attack;
        if ((attack - defend) <= 0)
          //this.spawnToast(`${defender.name} blocked ${attacker.name} by ${Math.abs(attack - defend)}`, 'blue');
        if ((attack - defend) > 0) {
          //this.spawnToast(`${attacker.name} ${ability.description} ${defender.name} for ${attack - defend}`, 'red');
          defender.health -= (attack - defend);
          this.checkDead(defender);
        }
      }
      else
        defender[type] = (defender[type] - attacker.attack >= 0) ? defender[type] - attack : 0;
    }
      //this.spawnToast(attacker.name + ' missed', '#00bb00');
    await this.delay(1000,1);
    defender.targeted = false;
  }

  // Apples the effect to the person defending
  applyEffect(defender: Entity, ability: Ability) {
    if (ability.effect != null && (ability.effectChance >= this.rndInt(100 + defender.resistance))) {
      this.updateReport(`${defender.name} is now ${ability.effect.desc} : ability.effect.color`);
      defender.activeEffects.push(JSON.parse(JSON.stringify(ability.effect)));
    }
  }

  // Calculates the Effect damage for that turn
  effectCalculation(defender, effect) {
    this.effectsService.getFunction(defender.activeEffects.find((eff) => eff.name === effect.name).name, defender, effect);
    this.checkDead(defender);
  }

  // Applies the Effect Damage & Duration of the Effect
  effectTurn(entity) {
    entity.activeEffects.forEach((effect) => {
      effect.duration--;
      return (effect.duration <= -1) ? entity.activeEffects.splice(entity.activeEffects.indexOf(effect), 1) : this.effectCalculation(entity, effect)
    });
  }
  //
  // // Entity Ai
  // entityAttack(entity) {
  //   let enemies = this.room.filter(x => x.side != entity.side);
  //   let index = Math.floor(Math.random() * enemies.length);
  //   let defender = this.room[this.room.indexOf(enemies[index])];
  //   this.damageCalculation(entity, defender, this.rndInt(entity.abilities.length - 1));
  // }

  // The click action for the player
  attack(defender) {
    if (this.turns.length >= 1) {
      let attacker = this.turns[0];
      //let indexSelected = window['$'](":radio[name='abilities']").index(window['$'](":radio[name='abilities']:checked"));
      if (attacker.side === "human" && defender != attacker && !(attacker.health <= 0) && (indexSelected != -1)) {
        clearInterval(this.interval);
        this.damageCalculation(attacker, defender, indexSelected);
        this.skipTurn(attacker);
        //this.spawnStatus(event, damage);
      }
    }
    else
      this.turnSystem();
  }

  updateReport(str){
    this.report.push(str)
    this.dataService.save('room',this.accountService.getAccount().roomId,this.report);
  }

  // Starts the Game
  async startGame() {
    await this.delay(5000,1);
    this.game.started = true;
    this.turnSystem();
  }

  // Ends the Game
  endGame(){
    if(this.checkTeamDefeated()){
      clearInterval(this.interval);
      setTimeout(()=>{document.getElementById('report').scrollTop = document.getElementById('report').scrollHeight;},1000);
    }
  }

  skipTurn(entity) {
    if (this.turns[0] === entity) {
      this.turns.splice(0, 1);
      entity.activeTurn = false;
      this.turnSystem();
    }
  }

  async turnSystem() {
    this.turnTime = 0;
    let entity = this.turns[0];
    if(entity == undefined) {
      this.sortTurns();
      entity = this.turns[0];
    }
    this.interval = setInterval(() => {
      this.turnTime++;
      if (this.turnTime >= 60) {
        clearInterval(this.interval);
        this.skipTurn(entity);
      }
    }, 1000);
    entity.abilities.forEach((ability)=>{ability.currentCooldown--;});
    this.effectTurn(entity);
    this.dataService.get('room',this.accountService.getAccount().roomId,(room) => this.activeAbilities = (room.currentTurn.abilities.filter((ability) => (ability.currentCooldown <= 0)).length <= 0))
    if(this.activeAbilities){
      clearInterval(this.interval);
      return this.skipTurn(entity);
    }
    entity.activeTurn = true;
    if(entity.side==='human')
      return;
    else {
      //this.entityAttack(entity);
      await this.delay(1000,1);
      clearInterval(this.interval);
      entity.activeTurn = false;
      return this.skipTurn(entity);
    }
  }
}
