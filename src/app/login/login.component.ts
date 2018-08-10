import {AfterViewInit, Component, OnInit} from '@angular/core';
import {AccountService} from '../services/account.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-vampire-village-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, AfterViewInit {

  email: string;
  password: string;
  error: string;

  constructor(private accountService: AccountService, private router: Router) {
    this.error = '';

  }

  ngOnInit() {}

  ngAfterViewInit() {
   // console.log(this.accountService.checkSignedIn());
   // this.router.navigate([this.accountService.checkSignedIn()]);
  }

  signIn() {
    // this.accountService.checkSignedIn();
    if (this.email !== undefined && this.password !== undefined) {
      this.accountService.signIn(this.email, this.password, () => {
          return;
        },
        (error) => {
          this.error = error.message;
          this.password = '';
        });
    }
  }

}
