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
  // The entire list of what the database will hold will be removed from here
  // PlayerData: { level: number, experience: number, inventory: any[], characters: any[]};
  // Each characters different type of Object Keys, as a separate variable
  characterDisplays: any = { characters: [], healths: []};
  attributeKeys: any = [];
  allyDisplays: any = {entities: [], healths: []};
  enemyDisplays: any = {entities: [], healths: []};
  // The report of the match
  report: any[] = [];
  // The hits that pop up when a creature is attacked.
  hits: any = [];
  // The amount of time for each turn
  turnTime: any = 0;
  // The sides of the game
  game: any = {sides: [], started: false};

  constructor(private accountService: AccountService, private gameService: GameService) {
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    // this.startGame();
    this.waitSetUpDisplays();
  }

  async waitSetUpDisplays() {
   const interval = setInterval(() => {
     if (this.gameService.game.started) {
       this.setUpDisplays();
       clearInterval(interval);
     }
   });
    await interval;
  }

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
    console.log('Important Info: ', this.characterDisplays, this.enemyDisplays);
  }

  // Updates the All Displays
  updateDisplays(defender): void {
    return (this.characterDisplays.characters.indexOf(defender) !== -1)
      ? Object.keys(this.characterDisplays).forEach((key) => {
        this.characterDisplays[key].splice(this.characterDisplays.characters.indexOf(defender), 1);
      })
      : Object.keys(this.enemyDisplays).forEach((key) => {
        this.enemyDisplays[key].splice(this.enemyDisplays.entities.indexOf(defender), 1);
      });
  }

  // Checks if there is any active abilities
  checkAnyActiveAbilities(entity) {
    return entity.abilities.filter((ability) => (ability.currentCooldown <= 0)).length <= 0;
  }
  // //Determines the color of the enemy Entity based on amount of health
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

  // Needs to be fixed
  checkLastActiveAbility(ability) {
    if (!ability.currentCooldown){
      ability.currentCooldown = 0;
    }
    return (ability.currentCooldown <= 0);
  }

  // Function to detect which player is active, and return true or false on it.
  checkPlayerActive(character) {
    return this.gameService.checkPlayerActive(character);
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
