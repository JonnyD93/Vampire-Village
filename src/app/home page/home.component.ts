import { Component, OnInit } from '@angular/core';
import {AccountService} from "../services/account.service";
import {Router} from '@angular/router';

@Component({
  selector: 'app-vampire-village-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})

export class HomeComponent implements OnInit {

  displayData: any;

  constructor(private accountService: AccountService, private router: Router) {
    this.displayData = {level: 0, teamName: '', experience: 0};

   // console.log(accountService.adminCalculateAllRanks());
  }

  ngOnInit() {

    if (this.accountService.checkSignedIn() && !this.accountService.checkAccount()) {
      this.displayData = this.accountService.getAccountStats();
    } else if (this.accountService.checkAccount()) {
      this.router.navigate(['create-character']);
    } else {
      this.router.navigate(['login']);
    }
  }

  logOut() {
    this.accountService.signOut();
    this.router.navigate(['login']);
  }

  playPVE() {
   this.accountService.createPVERoom((e) => console.log(e));
   this.router.navigate(['vampire-village']);
  }
}
