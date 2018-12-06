import {AfterViewInit, Component, OnInit} from '@angular/core';
import {AccountService} from '../services/account.service';
import * as firebase from 'firebase';
import {Router} from "@angular/router";

@Component({
  selector: 'app-vampire-village',
  templateUrl: './vampire-village.component.html',
  styleUrls: ['./vampire-village.component.css']
})
export class VampireVillageComponent implements OnInit, AfterViewInit {

  lobby: any;
  ref: any;
  // Each characters different type of Object Keys, as a separate variable
  characterDisplays: any;
  attributeKeys: any;
  abilityDisplays: any;
  allyDisplays: any = {entities: [], healths: []}; // Will be used when allies are implemented
  enemyDisplays: any; // The enemy displays
  // The report of the match
  report: any[] = [];
  // The hits that pop up when a creature is attacked.
  hits: any = [];
  // The amount of time for each turn
  turnTime: any = 0;
  title = '';
  modal = {start: true, end: false};


  constructor(private accountService: AccountService, private router: Router) {
    this.characterDisplays = {characters: [], healths: []};
    this.enemyDisplays = {entities: [], healths: []};
  }

  async ngOnInit() {
    this.ref = firebase.database().ref(`/rooms/${this.accountService.getRoomId()}`);
    await this.ref.once('value').then(snapshot => this.lobby = !!(snapshot.val()) ? snapshot.val() : false);
    if (!this.lobby) {
      this.router.navigate(['/home']);
    } else {
      if (this.lobby.gameEnded) {
        this.accountService.dropRoom(this.accountService.getAccount().id);
        this.router.navigate(['/home'])
      } else {
        this.sortLobby();
        // Pings the Database, to run Enemy Turn if the game has already started, and the page is reloaded
        console.log(this.lobby.turnTime, 'Can i get a yeet?');
        (this.lobby.turnTime !== undefined) ? this.accountService.ping(console.log()) : null;
        await setTimeout(() => this.modal.start = false, 3000);
        setInterval(() => {
          this.accountService.checkStatus(console.log);
          console.log(this.lobby);
        }, 5000);
      }
    }
  }

  ngAfterViewInit() {
    // this.startGame();
    // this.waitSetUpDisplays();
    this.ref.on('value', snapshot => this.updateLobby(snapshot.val()));
  }



  checkPlayerActive(entity) {
    // Compares the active turn to the Active Entity
    return (this.lobby.currentTurn === entity.id);
  }

  checkPlayerCharacters(entity) {
    let boolean = false;
    //console.log(this.accountService.getCharacters(), 'take 4');
    this.accountService.getCharacters().forEach(character => boolean = character.id === entity.id);
    return boolean;
  }

  updateLobby(dbData) {
    this.lobby = dbData;
    console.log(this.characterDisplays, this.enemyDisplays, 'This spot');
    // Reassigns the values of the Player's characters & each entity when the database is updated;
    this.lobby.room.forEach(entity => (this.checkPlayerCharacters(entity))
        ? this.characterDisplays.characters[this.characterDisplays.characters.indexOf(this.characterDisplays.characters.find(char => char.id === entity.id))] = entity
        : this.enemyDisplays.entities[this.enemyDisplays.entities.indexOf(this.enemyDisplays.entities.find(char => char.id === entity.id))] = entity);
    (this.lobby.gameEnded) ? this.modal.end = true : null;
  }

  sortLobby() {
    // Declares initial variables
    this.characterDisplays = {characters: [], healths: []};
    this.enemyDisplays = {entities: [], healths: []};
    this.attributeKeys = [];
    // Ties the lobby's Room to the displays
    this.lobby.room.forEach(entity => (this.checkPlayerCharacters(entity) ? this.characterDisplays.characters.push(entity)
      : this.enemyDisplays.entities.push(entity)));
    // Ties the MAX health of each entity to its own individual display
    this.lobby.sides.forEach(entities => entities.forEach(entity => (this.checkPlayerCharacters(entity))
      ? this.characterDisplays.healths.push(JSON.parse(JSON.stringify(entity.attributes.health)))
      : this.enemyDisplays.healths.push(JSON.parse(JSON.stringify(entity.attributes.health)))));
    // Gets the attributes Keys of the first Players Entity and assigns it to the array.
    this.attributeKeys = Object.keys(this.characterDisplays.characters[0].attributes);
  }

  skipPlayerTurn(entity) {
    if (this.checkPlayerActive(entity))
      this.accountService.skipPlayerTurn(entity.id, console.log);
  }

  attack(entity) {
    const attacker = this.accountService.getCharacters().find(char => char.id === this.lobby.currentTurn);
    // console.log(entity, entity.id);
    (attacker !== undefined) ? this.accountService.attack(attacker, entity, console.log) : null;
  }

  updateDisplays() {
    // return (this.characterDisplays.characters.indexOf(defender) !== -1)
    //     ? Object.keys(this.characterDisplays).forEach((key) => {
    //       this.characterDisplays[key].splice(this.characterDisplays.characters.indexOf(defender), 1);
    //     })
    //     : Object.keys(this.enemyDisplays).forEach((key) => {
    //       this.enemyDisplays[key].splice(this.enemyDisplays.entities.indexOf(defender), 1);
    //     });
  }

  async waitSetUpDisplays() {
    // const interval = setInterval(() => { // Creates an interval to check if the game has been loaded.
    //   if (this.gameService.getProgress() === 'started') { // Checks if the game service is loading
    //     this.setUpDisplays(); // Sets the Displays Up
    //     // this.title = this.gameService.getTitleOfMatch(); // Receives the title of the Match
    //     this.modal.start = false; // Hides the start Modal
    //     this.refreshDisplays(); // Starts the constant process of refreshing displays
    //     clearInterval(interval); // Clears the interval to check if everything is loaded
    //   }
    // });
    //  await interval;
  }

  // attack(defender) {
  //   const abilitySelected = 0;
  //   this.gameService.attack(abilitySelected, defender);
  // }
  //
  //
  //
  // // Updates the All Displays
  // // updateDisplays(defender): void {
  // //   return (this.characterDisplays.characters.indexOf(defender) !== -1)
  // //     ? Object.keys(this.characterDisplays).forEach((key) => {
  // //       this.characterDisplays[key].splice(this.characterDisplays.characters.indexOf(defender), 1);
  // //     })
  // //     : Object.keys(this.enemyDisplays).forEach((key) => {
  // //       this.enemyDisplays[key].splice(this.enemyDisplays.entities.indexOf(defender), 1);
  // //     });
  // // }
  //
  // Determines the color of the enemy Entity based on amount of health
  calcColor(entity, health) {
    const x = 100 - ((entity.attributes.health / health) * 100);
    return `rgb(${x}%,${x}%,${x}%)`;
  }

  // // Function to detect the current Health of the Current Player
  calcHealth(currentHealth, maxHealth) {
    return Math.round((currentHealth / maxHealth) * 100);
  }

  //
  // // Checks if the Ability is from an Item, and returns that Item's Name
  // // checkItemAbility(character, ability) {
  // //   let itemName = '';
  // //   if (character.inventory.length > 0) {
  // //     character.inventory.forEach((item) => {
  // //       if (item.itemAbilities != null) {
  // //         item.itemAbilities.forEach((abilityItem) => {
  // //           itemName = (ability === abilityItem) ? `( ${item.name} )` : '';
  // //         });
  // //       }
  // //     });
  // //   }
  // //   return itemName;
  // // }
  //
  // Function to detect which player is active, and return true or false on it.
  // // Refreshes the Displays
  // refreshDisplays() {
  //   setInterval(() => {
  //     this.characterDisplays.characters = [];
  //     this.enemyDisplays.entities = [];
  //     this.gameService.room.forEach((entity) => (this.gameService.checkIfPlayer(entity))
  //       ? this.characterDisplays.characters.push(entity) : this.enemyDisplays.entities.push(entity));
  //   }, 100);
  // }
  // // Sets up the Displays for the game
  // setUpDisplays() {
  //   if (this.characterDisplays.characters.length === 0) {
  //     this.gameService.room.forEach((entity) => {
  //       if (this.gameService.checkIfPlayer(entity)) {
  //         this.characterDisplays.characters.push(entity);
  //         this.attributeKeys = Object.keys(entity.attributes);
  //         this.characterDisplays.healths.push(entity.attributes.health);
  //       } else {
  //         this.enemyDisplays.entities.push(entity);
  //         this.enemyDisplays.healths.push(entity.attributes.health);
  //       }
  //     });
  //   }
  // }
  //
  // // Creates an hit object to display Players damage on a given target
  // spawnToast(description, style) {
  //   const obj = {styles: {backgroundColor: style}, description: description};
  //   this.hits.push(obj);
  //   this.report.push(description);
  //   setTimeout(() => this.hits.splice(this.hits.indexOf(obj), 1), 5000);
  // }
  //
  // // // Checks if the Ability is from an Item, and returns that Item's Name
  // // checkItemAbility(character, item) {
  // //   let itemName = '';
  // //   if (character.inventory.length > 0)
  // //     character.inventory.forEach((item) => {
  // //       if (item.itemAbilities != null)
  // //         item.itemAbilities.forEach((abilityItem) => {
  // //           itemName = (item === abilityItem) ? `( ${item.name} )` : '';
  // //         });
  // //     });
  // //   return itemName;
  // // }
  // //
  // // // Needs to be fixed
  // // checkLastActiveAbility(item) {
  // //   return (item.currentCooldown <= 0);
  // // }
  // //
  // //
  // // // Function to detect which player is active, and return true or false on it.
  // // checkPlayerActive(character) {
  // //   return ((this.turns != undefined) && (this.turns[0] === character));
  // // }
  // //
  // // // Creates an hit object to display Players damage on a given target
  // // spawnToast(description, style) {
  // //   let obj = {styles: {backgroundColor: style}, description: description};
  // //   this.hits.push(obj);
  // //   this.report.push(description);
  // //   setTimeout(() => this.hits.splice(this.hits.indexOf(obj), 1), 5000);
  // // }
  // //
}
