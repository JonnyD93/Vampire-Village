import {Injectable} from '@angular/core';
import {AccountService} from './account.service';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {catchError} from 'rxjs/operators';
import {Router} from '@angular/router';

@Injectable()
export class GameService {

  // Array for all entities in the game
  room: any = {};
  // The turns variable is populated with the turns of the game
  turns: any[] = [];
  // The report of the match
  report: any[] = [];
  // The amount of time for each turn
  turnTime: any = 0;
  // The interval of the game
  interval: any;
  updateInterval: any;
  // The sides of the game
  sides: any = [];
  // currentTurn: any;
  teamDefeated: boolean;
  currentTurn: any;
  progress = 'loading';
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type':  'application/json',
      'Authorization': 'my-auth-token'
    })
  };


  constructor(private accountService: AccountService, private http: HttpClient, private router: Router) {
    this.checkStatus(console.log);
    setInterval(() => this.checkStatus(console.log), 1000);
    }

    checkStatus (onError) {
      if (this.accountService.getRoomId() === 'No User') {
        this.router.navigate(['login']);
      } else if (this.accountService.getRoomId() === 'No RoomId') {
        this.router.navigate(['home']);
      } else {
        this.http.post<any>('http://localhost:3001/getRoom', {roomId: this.accountService.getRoomId()}, this.httpOptions)
          .pipe(catchError(onError)).subscribe((data) => {
          this.room = data;
          console.log(this.room, 'here');
        });
      }
    }
    // dataService.get('rooms', this.accountService.getRoomId(), (room) => { // Gets the data Service
    //   this.sides = [];
    //   this.room = [];
    //   room.sides.forEach((side) => {
    //     side.forEach((account) => {
    //       const team = [];
    //       account.entities.forEach((entity) => {
    //         this.room.push(entity);
    //         team.push(entity.id);
    //       });
    //       this.sides.push(team);
    //     });
    //   });
    //   this.startGame();
    // });
    // this.updateInterval = setInterval(() => {
    //   this.updateCurrentTurn();
    //   this.updateRoom();
    // }, 500);

  // Adds a Delay to the TS Cite https://basarat.gitbooks.io/typescript/docs/async-await.html
//   async delay(milliseconds: number, count: number): Promise<number> {
//     return new Promise<number>(resolve => {
//       setTimeout(() => {
//         resolve(count);
//       }, milliseconds);
//     });
//   }
//
//   // Starts the Game
//   async startGame() {
//     await this.delay(5000, 1);
//     this.progress = 'started';
//     this.turnSystem();
//   }
//
//   // Apples the effect to the person defending
//   applyEffect(defender: Entity, ability) {
//     if (ability.effect !== undefined && (ability.effectChance >= this.rndInt(100 + defender.attributes.resistance))) {
//       this.updateReport(`${defender.name} is now ${ability.effect.desc} : ability.effect.color`);
//       defender.activeEffects = (!!defender.activeEffects) ? defender.activeEffects : [];
//       defender.activeEffects.push(JSON.parse(JSON.stringify(ability.effect)));
//     }
//   }
//
//   // Click Action for the Player
//   attack(abilitySelected, defender) {
//     this.accountService.getCharacters().forEach((character) => {
//       if (this.checkEntityActive(character)) {
//         clearInterval(this.interval);
//         this.getActiveEntity().activeTurn = false;
//         this.damageCalculation(character, defender, abilitySelected);
//         this.skipTurn(character);
//       }
//       // console.log(character, this.checkEntityActive(character), defender, abilitySelected, 'hello?');
//     });
//
//   }
//
//   // Checks if there is any Active Abilities in the entity passed through, if so returns true , else false
//   checkAnyActiveAbilities(entity) {
//     return entity.abilities.find((ability) => (ability.currentCooldown <= 0)) !== undefined;
//   }
//
//   // Checks who turn it is
//   checkCurrentTurn() {
//     this.dataService.get('rooms', this.accountService.getRoomId(), (room) => (this.currentTurn = room.currentTurn));
//   }
//
//   checkEntityActive(character) {
//     this.checkCurrentTurn();
//     return (this.currentTurn) ? (character.id === this.currentTurn) : false;
//   }
//
//   // checksTheCurrentTurnTime
//   checkCurrentTurnTime() {
//     this.dataService.subscribe('rooms', this.accountService.getRoomId(), (room) => {
//       this.turnTime = room.turnTime;
//     });
//   }
//
//   // Checks if the entity is dead
//   async checkDead(defender) {
//     if (defender.attributes.health <= 0) {
//       // this.spawnToast(`${defender.name} died`, 'black');
//       defender.death = true;
//       await this.delay(1000, 1);
//       defender.death = false;
//       this.turns.splice(this.turns.indexOf(defender.id), 1);
//       this.room.splice(this.room.indexOf(defender), 1);
//       // this.updateDisplays(defender);
//       this.endGame();
//     }
//   }
//
//   checkIfPlayer(entity) { // If it finds a player then it returns true else false
//     return (this.accountService.getCharacters().find((character) => character.id === entity.id)) !== undefined;
//   }
//
//   async checkIfCPU (entity) {
//     let cpu = false;
//     this.dataService.get('rooms', this.accountService.getRoomId(), (room) => room.sides.forEach(
//       (team) => (team.forEach((account) => cpu = (account.entities.find((entityX) => entity.id === entityX.id) !== undefined)))));
//     // await this.delay(1000, 1);
//     return cpu;
//   }
//
//   // Checks if a team is defeated
//   checkTeamDefeated() {
//     this.dataService.get('rooms', this.accountService.getRoomId(), (room) => this.teamDefeated = (room.sides.length <= 1));
//   }
//
//   checkTurnTime() {
//     this.dataService.get('rooms', this.accountService.getRoomId(), (room) => (this.turnTime = room.turnTime));
//   }
//
//   async damageCalculation(attacker, defender, abilitySelected) {
//     const ability = attacker.abilities[abilitySelected];
//
//     const type = ability.type;
//     const attack = Math.floor(attacker.attributes.attack * attacker.abilities[abilitySelected].damageMultiplier);
//     const defend = this.rndInt(defender.attributes.defense);
//     defender.targeted = true;
//     ability.currentCooldown = ability.cooldown;
//     if ((attacker.attributes.accuracy >= this.rndInt(100 + defender.attributes.agility))) {
//       this.applyEffect(defender, ability);
//       if (type === 'health') {
//         if (attack < 0) {
//           defender.attributes.health -= attack;
//         }
//         if ((attack - defend) <= 0) {
//         }
//         // this.spawnToast(`${defender.name} blocked ${attacker.name} by ${Math.abs(attack - defend)}`, 'blue');
//         if ((attack - defend) > 0) {
//           // this.spawnToast(`${attacker.name} ${item.description} ${defender.name} for ${attack - defend}`, 'red');
//           defender.attributes.health -= (attack - defend);
//           this.checkDead(defender);
//         }
//       } else {
//         defender[type] = (defender[type] - attacker.attributes.attack >= 0) ? defender[type] - attack : 0;
//       }
//     }
//     this.updateRoom();
//     // this.spawnToast(attacker.name + ' missed', '#00bb00');
//     await this.delay(1000, 1);
//     defender.targeted = false;
//   }
//
//   // Calculates the Effect damage for that turn
//   effectCalculation(defender, effect) {
//     this.effectsService.getFunction(defender.activeEffects.find((eff) => eff.name === effect.name).name, defender, effect);
//     this.checkDead(defender);
//   }
//
//   // Applies the Effect Damage & Duration of the Effect
//   effectTurn(entity) {
//     entity.activeEffects.forEach((effect) => {
//       effect.duration--;
//       return (effect.duration <= -1)
//         ? entity.activeEffects.splice(entity.activeEffects.indexOf(effect), 1)
//         : this.effectCalculation(entity, effect);
//     });
//   }
//
//
//   // Entity Ai
//   entityAttack(entity) {
//     const enemies = [];
//     this.sides.filter((team) => (team.indexOf(entity.id) === -1)).forEach((team) => (team.forEach((entityId) => enemies.push(entityId))));
//     const enemyId = enemies[Math.floor(Math.random() * enemies.length)]; // Finding the enemy Id to Attack
//     const defender = this.room.find((target) => (target.id === enemyId)); // Finding the actual defender or target
//     this.damageCalculation(entity, defender, this.rndInt(entity.abilities.length - 1)); // Running Damage Calculation on it
//   }
//
//   // Ends the Game
//   endGame() {
//     if (this.checkTeamDefeated()) {
//       clearInterval(this.interval);
//       setTimeout(() => {
//         document.getElementById('report').scrollTop = document.getElementById('report').scrollHeight;
//       }, 1000);
//     }
//   }
//
//   // Returns the active Entity
//   getActiveEntity() {
//     let entity = this.room.find((entityR) => entityR.id === this.currentTurn);
//     if (entity === undefined) {
//       this.sortTurns();
//       entity = this.getActiveEntity();
//     }
//     return entity;
//   }
//
//   // Returns the current State of the Game
//   getProgress() {
//     return this.progress;
// }
//
//   // Creates a title for the match
//   // getTitleOfMatch() {
//   //   let title = '';
//   //   this.game.sides.forEach((side) => {
//   //     side.forEach((account) => {
//   //       if (side.length >= 2) {
//   //         title += `${account.teamName} && `;
//   //       } else {
//   //         title += account.teamName;
//   //       }
//   //       if (side.indexOf(account) === side.length - 1) {
//   //         title.substring(0, title.length - 3);
//   //       }
//   //     });
//   //     if (!(this.game.sides.indexOf(side) === this.game.sides.length - 1)) {
//   //       title += '\n V.S. \n';
//   //     }
//   //   });
//   //   return title;
//   // }
//   // Function that returns a random int up to x
//   rndInt(x: number) {
//     return Math.round(Math.random() * x);
//   }
//
//   skipTurn(entity) {
//     if (this.currentTurn === entity.id) {
//       this.turns.splice(0, 1);
//       entity.activeTurn = false;
//       this.updateCurrentTurn();
//       clearInterval(this.interval);
//       this.turnSystem();
//     }
//   }
//
//   // Sorts the Turns based on Agility
//   sortTurns() {
//     this.checkTeamDefeated();
//     this.turns = [];
//     this.room.sort((a, b) => {
//       if (a.attributes.agility < b.attributes.agility) {
//         return 1;
//       }
//       if (a.attributes.agility > b.attributes.agility) {
//         return -1;
//       }
//       return 0;
//     });
//     this.room.forEach((entity) => {
//       this.turns.push(entity.id);
//     });
//     this.updateCurrentTurn();
//     return this.currentTurn;
//   }
//
//
//   async turnSystem() {
//     // console.log(this.room, 'Hello Baby');
//     this.turnTime = 0;
//     this.checkCurrentTurn();
//     const entity = this.getActiveEntity();
//     this.interval = setInterval(() => {
//       this.updateTurnTime(this.turnTime);
//       this.turnTime++;
//       if (this.turnTime >= 60) {
//         this.skipTurn(entity);
//       }
//     }, 1000);
//     if (!!(entity.activeEffects)) {
//       this.effectTurn(entity);
//     }
//     entity.abilities.forEach((ability) => ability.currentCooldown--);
//     if (!this.checkAnyActiveAbilities(entity)) {
//       // console.log('No Active abilities')
//      return this.skipTurn(entity);
//     }
//     entity.activeTurn = true;
//     if (this.checkIfPlayer(entity)) {
//       return;
//     } else if (this.checkIfCPU(entity)) {
//       this.entityAttack(entity);
//       await this.delay(1000, 1);
//       entity.activeTurn = false;
//       return this.skipTurn(entity);
//     } else {
//       clearInterval(this.interval);
//       return;
//     }
//   }
//
//   updateCurrentTurn() {
//     this.currentTurn = this.turns[0];
//     this.dataService.update('rooms', this.accountService.getRoomId(), {currentTurn: (this.turns[0]) ? this.turns[0] : this.sortTurns()});
//   }
//
//   updateReport(str) {
//     this.report.push(str);
//     this.dataService.update('rooms', this.accountService.getRoomId(), {report: this.report});
//   }
//   updateRoom() {
//     this.room.forEach((entity) => entity.abilities.forEach((ability) =>
//       (ability.currentCooldown = (ability.currentCooldown) ? ability.currentCooldown : 0)));
//     this.dataService.update('rooms', this.accountService.getRoomId(), {room: this.room});
//   }
//   updateTurnTime(time) {
//     this.dataService.update('rooms', this.accountService.getRoomId(), {turnTime: time});
//   }


}
