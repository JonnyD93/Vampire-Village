import { Component, OnInit } from '@angular/core';
import * as firebase from "firebase";
import {FakeDataService} from "../services/fakeData.service";
import {Entity} from "../services/models/entity.model";
import {AccountService} from "../services/account.service";

@Component({
  selector: 'app-vampire-village-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})

export class HomeComponent implements OnInit {

  displayData: any;

  constructor(private accountService: AccountService) {
    accountService.checkSignedIn();
    this.displayData = accountService.getAccount();
    console.log(accountService.adminCalculateAllRanks());
  }

  ngOnInit() {
  }

  logOut(){
    this.accountService.signOut();
    this.accountService.checkSignedIn();
  }
  playPVE(){
    this.accountService.createPVERoom();
  }
}
