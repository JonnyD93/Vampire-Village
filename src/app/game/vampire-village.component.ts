import {AfterViewInit, Component, OnInit} from '@angular/core';
import {AbilitiesService} from "../services/abilities.service";
import {Entity} from "../services/models/entity.model";
import {Ability} from "../services/models/ability.model";
import {Effect} from "../services/models/effect.model";
import {ItemsService} from "../services/items.service";
import {FakeDataService} from "../services/fakeData.service";
import {promise} from "selenium-webdriver";
import {EffectsService} from "../services/effects.service";
import {GameService} from "../services/game.service";

@Component({
  selector: 'app-vampire-village',
  templateUrl: './vampire-village.component.html',
  styleUrls: ['./vampire-village.component.css']
})
export class VampireVillageComponent implements OnInit, AfterViewInit {
  // The entire list of what the database will hold will be removed from here
  // PlayerData: { level: number, experience: number, inventory: any[], characters: any[]};
  // Array for all entitys in the game
  room: any[] = [];
  // Each characters different type of Object Keys, as a separate variable
  characterDisplays: any = {keys: [], characters: [], healths: []};
  enemyDisplays: any = {entities: [], healths: []};
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
  constructor(private fakeData: FakeDataService, private dataService: DataService) {
    // Pulling from the fake data Service
    for (let character of fakeData.PlayerData.characters)
      this.room.push(character);
    // Setting up stuff for Displaying purposes
    for (let character of this.room.filter(x => x.side === "human")) {
      this.characterDisplays.keys.push(Object.keys(character));
      this.characterDisplays.characters.push(character);
      this.characterDisplays.healths.push(character.health);
    }
    for (let entity of this.room.filter(x => x.side != "human")) {
      this.enemyDisplays.entities.push(entity);
      this.enemyDisplays.healths.push(entity.health);
    }
    this.game.sides = this.room.map(item => item.side).filter((value, index, self) => self.indexOf(value) === index);
    // Initial setup of the game
   // this.sortTurns();
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
   // this.startGame();
  }

  //Updates the All Displays
  updateDisplays(defender): void {
    return (this.characterDisplays.characters.indexOf(defender) != -1)
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

  // Checks if the Ability is from an Item, and returns that Item's Name
  checkItemAbility(character, ability) {
    let itemName = '';
    if (character.inventory.length > 0)
      character.inventory.forEach((item) => {
        if (item.itemAbilities != null)
          item.itemAbilities.forEach((abilityItem) => {
            itemName = (ability === abilityItem) ? `( ${item.name} )` : '';
          });
      });
    return itemName;
  }

  // Needs to be fixed
  checkLastActiveAbility(ability) {
    return (ability.currentCooldown <= 0);
  }

  // Checks if a team is defeated
  checkTeamDefeated() {
    return ((this.room.filter((entity) => entity === this.enemyDisplays.entities[0])).length == 0) ||
      ((this.room.filter((entity) => entity === this.characterDisplays.characters[0])).length == 0);
  }

  // Function to detect which player is active, and return true or false on it.
  checkPlayerActive(character) {
    return ((this.turns != undefined) && (this.turns[0] === character));
  }

  // Creates an hit object to display Players damage on a given target
  spawnToast(description, style) {
    this.dataService.subscribe()
    let obj = {styles: {backgroundColor: style}, description: description};
    this.hits.push(obj);
    this.report.push(description);
    setTimeout(() => this.hits.splice(this.hits.indexOf(obj), 1), 5000);
  }
}
