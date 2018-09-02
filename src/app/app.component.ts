import {Component, OnInit} from '@angular/core';
import {DataService} from "./services/data.service";

@Component({
  selector: 'app-root',
  template: '<layout></layout>'
})
export class AppComponent implements OnInit{

  constructor(private data: DataService){

  }

  async ngOnInit(): Promise<void> {
    console.log('works');
    let obj = await this.search();
    console.log('obj', obj);
    console.log('tits');
  }

  async search() {
    let apiURL = `http://localhost:3000`;
    let response = await fetch(apiURL);
    let data = await response.json();
    return data;
  }
}
