import {Injectable} from '@angular/core';
import * as firebase from 'firebase';
import {Router} from '@angular/router';
import {Entity} from './models/entity.model';
import {DataService} from './data.service';

@Injectable()
export class AccountService {

  account: any;
  user: any;
  ability: any[] = []; // Will be removed in the future, when inventory system is set up
  characters: any;

  constructor(private router: Router, private dataService: DataService) {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.user = {email: user.email, id: user.uid};
        this.dataService.get('users', this.user.id, (account) => this.account = account);
        this.dataService.get('characters', this.user.id, (characters) => this.characters = characters);
        this.dataService.get('abilities', '', (ability) => this.ability = ability.filter((abilityD) => (abilityD.name === 'Slash')));
      }
    });
  }

  rndInt(x: number) {
    return Math.round(Math.random() * x);
  }

  rndIntBtw(x: number, y: number) {
    return (this.rndInt(y) - this.rndInt(x)) + x;
  }
  // adminCalculateAllRanks() {
  //   this.database.ref(`/users/`).once('value').then((snapshot) => {
  //     console.log(snapshot.val());
  //   });
  // }

  checkAccount() {
      return (this.account === []);
  }
  checkSignedIn() {
    return !!(this.user);
  }

  createAccount(teamName) {
    if (this.checkSignedIn()) {
      this.dataService.save('users', this.user.id, {
        teamName: teamName,
        level: 0,
        experience: 0,
        games: {wins: 0, kills: 0, loses: 0, quits: 0},
        rank: 0,
        inventory: [this.dataService.getItem('-LJWBoaf_Md5s-qfNEl8')]
      });
      this.router.navigate(['home']);
    } else {
      this.router.navigate(['login']);
    }
  }
  createCharacter(name, health, attack, accuracy, agility, resistance) {
    if (this.checkSignedIn()) {
     this.dataService.add('characters/' + this.user.id, new Entity(name, health, attack, 0, accuracy, agility, resistance, this.ability));
    }
  }

  createPVERoom() {

    const player = {entities: this.getCharacters(), teamName: this.account.teamName, cpu: false};
    const vampires = {entities: this.createVampire(this.getAccount().level), teamName: 'Vampires', cpu: true};
    this.dataService.update('users', this.user.id, {roomId:
        this.dataService.add('rooms', { sides: [[player], [vampires]], turnTime: 0})});
  }

  createVampire(lvl) {
    const vampires = [];
    for (let x = 0; x < (this.rndInt(lvl / 5)) + 1; x++) {
      // Character name, health, attack, defence, accuracy, agility, resistance, abilities
      const vampire: any = new Entity('Vampire', this.rndIntBtw(20 + lvl, 70 + this.rndInt(lvl * 5)),
        this.rndIntBtw(this.rndInt(lvl) + 1, this.rndInt(lvl * 2)), this.rndIntBtw(Math.floor(lvl / 5), this.rndInt(Math.floor(lvl / 2))),
        this.rndIntBtw(60, 100), this.rndIntBtw(this.rndInt(lvl), lvl + 10), this.rndIntBtw(0, this.rndInt(lvl)),
        this.ability);
      vampire.id = `${x}`;
      vampires.push(vampire);
    }
    return vampires;
  }
  navigation() {}

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

  getAccount() {
    return this.account;
  }
  getAccountStats() {
    return {level: this.account.level, experience: this.account.experience, teamName: this.account.teamName};
  }
  getRoomId() {
    return (this.account.roomId) ? this.account.roomId : '';
  }
  getCharacters() {
    const characters = [];
    Object.keys(this.characters).forEach((key) => {
      const character = this.characters[key];
      character.id = key;
      characters.push(character);
    });
    return characters;
  }
}
