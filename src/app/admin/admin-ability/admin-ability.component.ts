import { Component, OnInit } from '@angular/core';
import {DataService} from '../../services/data.service';
import {Ability} from '../../services/models/ability.model';
import {Effects} from '../../services/models/effects.model';

@Component({
  selector: 'app-admin-ability',
  templateUrl: './admin-ability.component.html',
  styleUrls: ['./admin-ability.component.css']
})
export class AdminAbilityComponent implements OnInit {

  newAbility: any = {name: '', type: 'health', description: '', damMulti: 0, eff: null, effChance: null, cd: 0};
  abilities: any[] = [];
  types: any = ['health', 'defense', 'attack', 'accuracy', 'agility', 'resistance']; // 343912802272
  effects: any[] = new Effects().getAllEffects();
  effectSelected: any = 'null';
  constructor(private dataService: DataService) {
    this.dataService.get('abilities', '', data => {
      data = data || [];
      this.abilities = data;
    });
    this.dataService.subscribe('abilities', '', data => {
      data = data || [];
      this.abilities = data;
    });

  }

  ngOnInit() {
    window['$']('.dropdown-trigger').dropdown();
    // setInterval(() => console.log(this.abilities.find((item) => item.name === 'Stab'), 1000000);

  }

  setType(type) {
    this.newAbility.type = type;
  }
  setEffect(effect) {
    this.effectSelected = effect.name;
    this.newAbility.effect = effect;
  }

  submit() {
    this.dataService.add('abilities', this.newAbility);
    this.newAbility = new Ability('', '', '', 0, null, null, 0);
  }

  delete(id) {
    this.dataService.delete(`abilities/${id}`);
  }

}
