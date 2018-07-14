import { Component, OnInit } from '@angular/core';
import {Entity} from "../services/models/entity.model";
import {AccountService} from "../services/account.service";
import {Player} from "../services/models/player.model";

@Component({
  selector: 'app-vampire-village-create-character',
  templateUrl: './create-character.component.html',
  styleUrls: ['./create-character.component.css']
})
export class CreateCharacter implements OnInit {

  account: Player;
  character : Entity;
  characterDisplayed: any = {displayName: '',character: {name: '', health: 0, attack: 0, accuracy: 0, agility: 0, resistance: 0}};
  displayKeys: any[] = [];
  constructor(private accountService: AccountService) {
    // Character name, side, health, attack, defence, accuracy, agility, resistance, abilities
    this.accountService.checkSignedIn();
    Object.keys(this.characterDisplayed.character).forEach((key)=>{if(key!='name') {this.displayKeys.push(key)}});
    this.character = new Entity('','human','','',0,'','','',[]);
    this.account = new Player('','');
  }

  ngOnInit() {
  }

  createCharacter(){
    Object.keys(this.characterDisplayed.character).forEach((key)=>{
      this.character[key] = this.characterDisplayed.character[key];
    });
    this.account.characters.push(this.character);
    this.account.displayName = this.characterDisplayed.displayName;
    this.accountService.createAccount(this.account);

  }

}
