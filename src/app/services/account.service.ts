import {Injectable} from '@angular/core';
import * as firebase from 'firebase';
import {Router} from '@angular/router';
import {Player} from './models/player.model';
import {Entity} from './models/entity.model';
import {DataService} from './data.service';

@Injectable()
export class AccountService {


  user: any;
  private account: Player;
  database: any;

  constructor(private router: Router, private dataService: DataService) {
    this.database = firebase.database();
  }

  rndInt(x: number) {
    return Math.round(Math.random() * x);
  }

  rndIntBtw(x: number, y: number) {
    return (this.rndInt(y) - this.rndInt(x)) + x;
  }

  // checkSignedIn() {
  //   let loggedIn = false;
  //   let accountCreated = false;
  //   let string = '';
  //   firebase.auth().onAuthStateChanged(user => {
  //     if (user) {
  //       this.user = {email: user.email, id: user.uid};
  //       this.dataService.get('users', this.user.id, (snapshot) => {
  //         console.log(snapshot.displayName);
  //         if (snapshot.displayName === undefined) {
  //           accountCreated = true;
  //           console.log(accountCreated);
  //         }
  //         loggedIn = true;
  //       });
  //       if (loggedIn) {
  //         console.log('called?');
  //         if (accountCreated) {
  //           console.log('called');
  //           string = 'create-character';
  //         } else {
  //           string = 'home';
  //         }
  //       }} else {
  //       string = 'login';
  //     }
  //   });
  //   return string;
  // }

  signIn(email, password, onFinish, onError) {
    firebase.auth().signInWithEmailAndPassword(email, password)
      .then(() => onFinish())
      .catch((error) => onError(error));
  }

  signOut() {
    firebase.auth().signOut();
  }

  signUp(email, password, onFinish, onError) {
    firebase.auth().createUserWithEmailAndPassword(email, password)
      .then(() => {
          this.signIn(email, password,
            () => onFinish(),
            (error) => this.router.navigate(['login']));
        }
      )
      .catch((error) => onError(error));
  }

  createAccount(account) {
    this.dataService.save(`users`, this.user.id, {
      displayName: account.displayName,
      level: 0,
      experience: 0,
      games: {wins: 0, kills: 0, loses: 0, quits: 0},
      rank: 0,
      characters: account.characters,
      inventory: ['Twig']
    });
    this.router.navigate(['home']);
  }

  getAccount(): Player {
    return this.account;
  }

  // createPVERoom() {
  //   this.database.ref(`/rooms/PVE/${this.user.id}`).set({
  //     enemies: this.createVampire(this.account.level)
  //   });
  // }

  // createVampire(level) {
  //   const vampires = [];
  //   for (let x = 0; x < this.rndInt((level / 5) + 1); x++) {
  //     // Character name, side, health, attack, defence, accuracy, agility, resistance, abilities
  //     vampires.push(new Entity('Vampire', 'vampire',
  //       this.rndIntBtw(20 + level, 70 + this.rndInt(level * 5)),
  //       this.rndIntBtw(this.rndInt(level), this.rndInt(level * 2)),
  //       this.rndIntBtw(Math.floor(level / 5), this.rndInt(Math.floor(level / 2))),
  //       this.rndIntBtw(60, 100),
  //       this.rndIntBtw(this.rndInt(level), level + 10),
  //       this.rndIntBtw(0, this.rndInt(level)),
  //       [this.abilitiesService.get('basicAttack')]));
  //   }
  //   return vampires;
  // }

  adminCalculateAllRanks() {
    this.database.ref(`/users/`).once('value').then((snapshot) => {
      console.log(snapshot.val());
    });
  }
}
