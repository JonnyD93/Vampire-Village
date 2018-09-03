import {Component, OnInit} from '@angular/core';
import {Entity} from '../services/models/entity.model';
import {AccountService} from '../services/account.service';
import {Player} from '../services/models/player.model';
import {Router} from '@angular/router';

@Component({
  selector: 'app-vampire-village-create-character',
  templateUrl: './create-character.component.html',
  styleUrls: ['./create-character.component.css']
})
export class CreateCharacter implements OnInit {

  character: Entity;
  charDisplayed: any = {teamName: '', character: {name: '', health: 100, attack: 5, accuracy: 60, agility: 0, resistance: 0}};
  minChar: any = {hp: 75, acc: 10, att: 5, res: 0, agi: 0};
  displayKeys: any[] = [];
  points: number;
  error: string;

  constructor(private accountService: AccountService, private router: Router) {
    this.error = '';
    this.points = 5;
    // Character name, side, health, attack, defence, accuracy, agility, resistance, abilities
    Object.keys(this.charDisplayed.character).forEach((key) => {
      if (key !== 'name') {
        this.displayKeys.push(key);
      }
    });
    this.character = new Entity(
      '',
      this.charDisplayed.character.health,
      this.charDisplayed.character.attack,
      0,
      this.charDisplayed.character.accuracy,
      this.charDisplayed.character.agility,
      this.charDisplayed.character.resistance,
      []);
  }

  ngOnInit() {
    if(!this.accountService.checkSignedIn()) {
      this.router.navigate(['login']);
    }
  }

  decreaseValue(key) {
    if ((key === 'accuracy' && this.charDisplayed.character[key] > this.minChar.acc) || (key == 'health' && this.charDisplayed.character[key] > this.minChar.hp)) {
      this.charDisplayed.character[key] -= 5;
      this.points++;
    } else if ((key == 'resistance' && this.charDisplayed.character[key] > this.minChar.res)) {
      this.charDisplayed.character[key] -= 2;
      this.points++;
    } else if ((key == 'attack' && this.charDisplayed.character[key] > this.minChar.att) || (key == 'agility' && this.charDisplayed.character[key] > this.minChar.agi)) {
      this.charDisplayed.character[key] -= 1;
      this.points++;
    }
  }

  increaseValue(key) {
    if (this.points > 0) {
      if (key === 'accuracy' || key == 'health') {
        this.charDisplayed.character[key] += 5;
        this.points--;
      } else if (key == 'resistance') {
        this.charDisplayed.character[key] += 2;
        this.points--;
      } else if (key == 'attack' || key == 'agility') {
        this.charDisplayed.character[key] += 1;
        this.points--;
      }
    } else {
      this.error = 'You are out of Points!';
    }
  }

  createCharacter() {
    Object.keys(this.charDisplayed.character).forEach((key) => {
      if (key !== 'name')
        this.character.attributes[key] = this.charDisplayed.character[key];
      else
        this.character[key] = this.charDisplayed.character[key];
    });
    this.accountService.createAccount(this.charDisplayed.teamName, this.character ,(error)=>(console.log(error)));
  }

}
