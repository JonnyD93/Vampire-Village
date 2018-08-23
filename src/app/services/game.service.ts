import {Injectable} from '@angular/core';
import {AccountService} from './account.service';
import * as firebase from 'firebase';
import {Entity} from './models/entity.model';
import {Ability} from './models/ability.model';
import {EffectsService} from './effects.service';
import {DataService} from './data.service';

@Injectable()
export class GameService {
  database: any;
  // Array for all entitys in the game
  room: any[] = [];
  // The turns variable is populated with the turns of the game
  turns: any[] = [];
  // The report of the match
  report: any[] = [];
  // The amount of time for each turn
  turnTime: any = 0;
  // The interval of the game
  interval: any;
  // The sides of the game
  game: any = {sides: [], started: false};
  // currentTurn: any;
  sides: any = [];
  teamDefeated: boolean;
  activeAbilities: boolean;
  currentTurn: any;

  constructor(private accountService: AccountService, private dataService: DataService, private effectsService: EffectsService) {
    this.database = firebase.database(); // Sets the database to the firebase database
    dataService.get('rooms', this.accountService.getAccount().roomId, (room) => { // Subscribes to the data Service
      this.sides = [];
      this.room = [];
      room.sides.forEach((side) => {
        side.forEach((accountID) => {
          const entities: any = []; // Used to assign the abilities
          if (typeof accountID === 'string') {
            dataService.get('characters', accountID, (characters) => {
              characters.forEach((char) => {
                if (!char.abilities) {
                  dataService.get('abilities', '-LJVdAlGbcq68v2t7gQ8', (ability) => { // Sets the ability to Punch if the user has no abilities assigned
                    char.abilities = [];
                    char.abilities.push(ability);
                  });
                  this.room.push(char);
                  entities.push(char);
                }
              });
              this.sides.push(entities);
            });
          } else {
            this.sides.push(side);
            this.room.push(accountID);
          }
        });
      });
    });
    console.log(this.room, 'pushing of thy room');
    dataService.update('rooms', this.accountService.getRoomId(), {room: this.room});
    this.game.started = true;
    this.currentTurn = undefined;
    this.startGame();
  }

  // Adds a Delay to the TS Cite https://basarat.gitbooks.io/typescript/docs/async-await.html
  async delay(milliseconds: number, count: number): Promise<number> {
    return new Promise<number>(resolve => {
      setTimeout(() => {
        resolve(count);
      }, milliseconds);
    });
  }

  // Apples the effect to the person defending
  applyEffect(defender: Entity, ability: Ability) {
    if (ability.effect != null && (ability.effectChance >= this.rndInt(100 + defender.attributes.resistance))) {
      this.updateReport(`${defender.name} is now ${ability.effect.desc} : ability.effect.color`);
      defender.activeEffects.push(JSON.parse(JSON.stringify(ability.effect)));
    }
  }

  // Click Action for the Player
  attack(abilitySelected, defender) {
    if (this.turns.length >= 1) {
      const attacker = this.currentTurn;
      if (attacker.side === 'human' && defender !== attacker && !(attacker.health <= 0) && (abilitySelected !== -1)) {
        clearInterval(this.interval);
        this.damageCalculation(attacker, defender, abilitySelected);
        this.skipTurn(attacker);
      }
    } else {
      this.turnSystem();
    }
  }


  // Function to detect the current Health of the Current Player
  calcHealth(currentHealth, maxHealth) {
    return Math.round((currentHealth / maxHealth) * 100);
  }

  // Checks who turn it is
  checkCurrentTurn() {
    this.dataService.get('rooms', this.accountService.getRoomId(), (room) => (this.currentTurn = room.currentTurn));
  }

  // checksTheCurrentTurnTime
  checkCurrentTurnTime() {
    this.dataService.subscribe('rooms', this.accountService.getRoomId(), (room)=>{
      this.turnTime = room.turnTime;
    })
  }

  // Checks if the entity is dead
  async checkDead(defender) {
    if (defender.health <= 0) {
      // this.spawnToast(`${defender.name} died`, 'black');
      defender.death = true;
      await this.delay(1000, 1);
      defender.death = false;
      this.turns.splice(this.turns.indexOf(defender), 1);
      this.room.splice(this.room.indexOf(defender), 1);
      // this.updateDisplays(defender);
      this.endGame();
    }
  }

  // Checks if a team is defeated
  checkTeamDefeated() {
    this.dataService.get('room', this.accountService.getAccount().roomId, (room) => (this.teamDefeated = (room.sides.length <= 1)));
  }

  checkTurnTime() {
    this.dataService.get('room', this.accountService.getAccount().roomId, (room) => (this.turnTime = room.turnTime));
  }

  async damageCalculation(attacker, defender, abilitySelected) {
    const ability = attacker.abilities[abilitySelected];
    const type = ability.type;
    const attack = Math.floor(attacker.attack * attacker.abilities[abilitySelected].damageMultiplier);
    const defend = this.rndInt(defender.defense);
    defender.targeted = true;
    ability.currentCooldown = ability.cooldown;
    if ((attacker.attributes.accuracy >= this.rndInt(100 + defender.attributes.agility))) {
      this.applyEffect(defender, ability);
      if (type === 'health') {
        if (attack < 0) {
          defender.attributes.health -= attack;
        }
        if ((attack - defend) <= 0) {
        }
        // this.spawnToast(`${defender.name} blocked ${attacker.name} by ${Math.abs(attack - defend)}`, 'blue');
        if ((attack - defend) > 0) {
          // this.spawnToast(`${attacker.name} ${item.description} ${defender.name} for ${attack - defend}`, 'red');
          defender.attributes.health -= (attack - defend);
          this.checkDead(defender);
        }
      } else {
        defender[type] = (defender[type] - attacker.attributes.attack >= 0)
          ? defender[type] - attack
          : 0;
      }
    }
    // this.spawnToast(attacker.name + ' missed', '#00bb00');
    await this.delay(1000, 1);
    defender.targeted = false;
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
      return (effect.duration <= -1)
        ? entity.activeEffects.splice(entity.activeEffects.indexOf(effect), 1)
        : this.effectCalculation(entity, effect);
    });
  }


  // Entity Ai
  entityAttack(entity) {
    const enemies = this.room.filter(x => x.side !== entity.side);
    const index = Math.floor(Math.random() * enemies.length);
    const defender = this.room[this.room.indexOf(enemies[index])];
    this.damageCalculation(entity, defender, this.rndInt(entity.abilities.length - 1));
  }

  // Ends the Game
  endGame() {
    if (this.checkTeamDefeated()) {
      clearInterval(this.interval);
      setTimeout(() => {
        document.getElementById('report').scrollTop = document.getElementById('report').scrollHeight;
      }, 1000);
    }
  }

  // Function that returns a random int up to x
  rndInt(x: number) {
    return Math.round(Math.random() * x);
  }

  skipTurn(entity) {
    if (this.turns[0] === entity) {
      this.turns.splice(0, 1);
      entity.activeTurn = false;
      this.updateCurrentTurn();
      this.turnSystem();
    }
  }

  // Sorts the Turns based on Agility
  sortTurns() {
    this.checkTeamDefeated();
    this.turns = [];
    this.room.forEach((entity) => {
      this.turns.push(entity);
    });
    this.turns.sort((a, b) => {
      if (a.attributes.agility < b.attributes.agility) {
        return 1;
      }
      if (a.attributes.agility > b.attributes.agility) {
        return -1;
      }
      return 0;
    });
    this.updateCurrentTurn();
  }

  // Starts the Game
  async startGame() {
    await this.delay(5000, 1);
    this.game.started = true;
    this.turnSystem();
  }

  async turnSystem() {
    this.turnTime = 0;
    this.checkCurrentTurn();
    let entity = this.currentTurn;
    if (entity === undefined) {
      this.sortTurns();
      entity = this.turns[0];
    }
    this.updateCurrentTurn();
    this.interval = setInterval(() => {
      this.updateTurnTime(this.turnTime);
      this.turnTime++;
      if (this.turnTime >= 60) {
        clearInterval(this.interval);
        this.skipTurn(entity);
      }
    }, 1000);
    if (!!(entity.activeEffects)) {
      this.effectTurn(entity);
    }
    if (!!(entity.abilities)) {
      entity.abilities.forEach((ability) => ability.currentCooldown--);
      this.dataService.get('rooms', this.accountService.getAccount().roomId,
        (room) => this.activeAbilities = (room.currentTurn.abilities.filter((ability) => (ability.currentCooldown <= 0)).length <= 0));
      if (this.activeAbilities) {
        clearInterval(this.interval);
        return this.skipTurn(entity);
      }
      entity.activeTurn = true;
      if (entity.side === 'human') {
        return;
      } else {
        this.entityAttack(entity);
        await this.delay(1000, 1);
        clearInterval(this.interval);
        entity.activeTurn = false;
        return this.skipTurn(entity);
      }
    }
  }

  updateCurrentTurn() {
    this.dataService.update('rooms', this.accountService.getRoomId(), {currentTurn: (this.turns[0]) ? this.turns[0] : this.sortTurns()});
  }

  updateReport(str) {
    this.report.push(str);
    this.dataService.update('rooms', this.accountService.getRoomId(), {report: this.report});
  }

  updateTurnTime(time) {
    this.dataService.update('rooms', this.accountService.getRoomId(), {turnTime: time});
  }

  getSides() {

  }
}
