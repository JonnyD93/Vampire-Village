import {AfterViewInit, Component, OnInit} from '@angular/core';
import {DataService} from '../services/data.service';
import {AccountService} from '../services/account.service';
import {GameService} from '../services/game.service';

@Component({
  selector: 'app-vampire-village',
  templateUrl: './vampire-village.component.html',
  styleUrls: ['./vampire-village.component.css']
})
export class VampireVillageComponent implements OnInit, AfterViewInit {

  // Each characters different type of Object Keys, as a separate variable
  characterDisplays: any = { characters: [], healths: []};
  attributeKeys: any = [];
  abilityDisplays: any;
  allyDisplays: any = {entities: [], healths: []}; // Will be used when allies are implemented
  enemyDisplays: any = {entities: [], healths: []}; // The enemy displays
  // The report of the match
  report: any[] = [];
  // The hits that pop up when a creature is attacked.
  hits: any = [];
  // The amount of time for each turn
  turnTime: any = 0;
  title: string = '';
  started: boolean = false;

  constructor(private accountService: AccountService, private gameService: GameService) {
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    // this.startGame();
    this.waitSetUpDisplays();
  }

  async waitSetUpDisplays() {
   const interval = setInterval(() => { // Creates an interval to check if the game has been loaded.
     if (this.gameService.game.started) { // Checks if the game service has been started
       this.setUpDisplays(); // Sets the Displays Up
       this.title = this.gameService.getTitleOfMatch(); // Receives the title of the Match
       clearInterval(interval); //Clears the interval to check if everything is loaded
       setTimeout(() => (this.started = true), 5000); // Hides the modal after the game has started;
     }
   });
    await interval;
  }

  attack(defender) {
    let abilitySelected = 0;
    this.gameService.attack(abilitySelected,defender)
  }

  // Updates the All Displays
  // updateDisplays(defender): void {
  //   return (this.characterDisplays.characters.indexOf(defender) !== -1)
  //     ? Object.keys(this.characterDisplays).forEach((key) => {
  //       this.characterDisplays[key].splice(this.characterDisplays.characters.indexOf(defender), 1);
  //     })
  //     : Object.keys(this.enemyDisplays).forEach((key) => {
  //       this.enemyDisplays[key].splice(this.enemyDisplays.entities.indexOf(defender), 1);
  //     });
  // }

  // Determines the color of the enemy Entity based on amount of health
  calcColor(entity, health) {
    const x = 100 - ((entity.attributes.health / health) * 100);
    return `rgb(${x}%,${x}%,${x}%)`;
  }
  // Function to detect the current Health of the Current Player
  calcHealth(currentHealth, maxHealth) {
    return Math.round((currentHealth / maxHealth) * 100);
  }

  // Checks if the Ability is from an Item, and returns that Item's Name
  checkItemAbility(character, ability) {
    let itemName = '';
    if (character.inventory.length > 0) {
      character.inventory.forEach((item) => {
        if (item.itemAbilities != null) {
          item.itemAbilities.forEach((abilityItem) => {
            itemName = (ability === abilityItem) ? `( ${item.name} )` : '';
          });
        }
      });
    }
    return itemName;
  }

  // Function to detect which player is active, and return true or false on it.
  checkPlayerActive(character) {
    return this.gameService.checkPlayerActive(character);
  }

  // Sets up the Displays for the game
  setUpDisplays() {
    this.gameService.room.forEach((entity) => {
      let isPlayersCharacter = false;
      this.accountService.getCharacters().forEach((character) => {
        if (this.accountService.compareStats(entity, character)) {
          this.characterDisplays.characters.push(character);
          this.attributeKeys = Object.keys(character.attributes);
          this.characterDisplays.healths.push(character.attributes.health);
          isPlayersCharacter = true;
        }
      });
      if (!(isPlayersCharacter)) {
        this.enemyDisplays.entities.push(entity);
        this.enemyDisplays.healths.push(entity.attributes.health);
      }
    });
  }

  // Creates an hit object to display Players damage on a given target
  spawnToast(description, style) {
    const obj = {styles: {backgroundColor: style}, description: description};
    this.hits.push(obj);
    this.report.push(description);
    setTimeout(() => this.hits.splice(this.hits.indexOf(obj), 1), 5000);
  }

  // // Checks if the Ability is from an Item, and returns that Item's Name
  // checkItemAbility(character, item) {
  //   let itemName = '';
  //   if (character.inventory.length > 0)
  //     character.inventory.forEach((item) => {
  //       if (item.itemAbilities != null)
  //         item.itemAbilities.forEach((abilityItem) => {
  //           itemName = (item === abilityItem) ? `( ${item.name} )` : '';
  //         });
  //     });
  //   return itemName;
  // }
  //
  // // Needs to be fixed
  // checkLastActiveAbility(item) {
  //   return (item.currentCooldown <= 0);
  // }
  //
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
}
