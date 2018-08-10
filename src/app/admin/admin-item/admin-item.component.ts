import {Component, OnInit} from '@angular/core';
import {DataService} from '../../services/data.service';
import {Item} from '../../services/models/item.model';

@Component({
  selector: 'app-admin-item',
  templateUrl: './admin-item.component.html',
  styleUrls: ['./admin-item.component.css']
})
export class AdminItemComponent implements OnInit {
  newItem: any = new Item('', '', 'Shield', 'health', 'Broken', 0, []);
  abilities: any[] = [];
  items: any[] = [];
  types: any = ['health', 'defense', 'attack', 'accuracy', 'agility', 'resistance']; // 343912802272
  rarities: any = ['Broken', 'Common', 'Uncommon', 'Rare', 'Very Rare', 'Legendary', 'Forbidden'];
  searchKeys: any = ['name', 'description', 'set', 'type', 'rarity'];
  sets: any = ['Shield', 'Weapon', 'Chest', 'Legs', 'Feet', 'Helm', 'Ring', 'Belt', 'Amulet'];
  itemKeys: any = Object.keys(new Item('', '', 'Shield', 'health', 'Broken', 0, []));
  results: any[] = [];
  search: any = {input: '', key: 'name'};
  constructor(private dataService: DataService) {
    this.dataService.get('abilities', '', data => {
      data = data || [];
      this.abilities = [];
      data.forEach((ability) => this.abilities.push({ability: ability, toggled: false}));
    });
    this.dataService.subscribe('abilities', '', data => {
      data = data || [];
      this.abilities = [];
      data.forEach((ability) => this.abilities.push({ability: ability, toggled: false}));
    });
    this.dataService.get('items', '', data => {
      data = data || [];
      this.items = data;
    });
    this.dataService.subscribe('items', '', data => {
      data = data || [];
      this.items = data;
    });
    setTimeout(() => (this.dataService.update('items', this.items[0].id, {rarity: 'Broken'})), 1000);
  }

  ngOnInit() {
    window['$']('.dropdown-trigger').dropdown();
    setInterval(() => {
      const input = this.search.input;
      this.results.splice(0, this.results.length);
      this.items.forEach((item) => {
        if (item[this.search.key].toUpperCase().includes(input.toUpperCase())) {
          this.results.push(JSON.parse(JSON.stringify(item)));
        }
      });
      if (input === '') {
        this.results.splice(0, this.results.length);
        this.items.forEach((item) => (this.results.push(JSON.parse(JSON.stringify(item)))));
      }
    }, 500);
  }


  setType(type) {
    this.newItem.type = type;
  }

  setSet(set) {
    this.newItem.set = set;
  }

  setRarity(rarity) {
    this.newItem.rarity = rarity;
  }
  setSearch(key) {
    this.search.key = key;
  }

  toggleAbility(ability) {
    if (ability.toggled) {
      ability.toggled = !ability.toggled;
      this.newItem.itemAbilities.splice(this.newItem.itemAbilities.find((abilityI) => abilityI.id === ability), 1);
    } else {
      ability.toggled = !ability.toggled;
      this.newItem.itemAbilities.push(ability.ability.id);
    }
  }

  submit() {
    console.log(this.newItem);
    this.dataService.add('items', this.newItem);
    this.newItem = new Item('', '', 'Shield', 'health', 'Broken', 0, []);
  }

  delete(id) {
    this.dataService.delete(`abilities/${id}`);
  }
}
