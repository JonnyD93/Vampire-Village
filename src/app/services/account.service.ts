import {Injectable} from '@angular/core';
import * as firebase from 'firebase';
import {Router} from '@angular/router';
import {DataService} from './data.service';
import { catchError, retry } from 'rxjs/operators';
import {HttpClient, HttpErrorResponse, HttpHeaders} from "@angular/common/http";

@Injectable()
export class AccountService {

  account: any;
  characters: any;
  userId: any;
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type':  'application/json',
      'Authorization': 'my-auth-token'
    })
  };

  constructor(private router: Router, private dataService: DataService, private http: HttpClient) {
    // firebase.auth().onAuthStateChanged(user => {
    //   if (user) {
    //     this.user = {email: user.email, id: user.uid};
    //     this.dataService.get('users', this.user.id, (account) => this.account = account);
    //     this.dataService.get('characters', this.user.id, (characters) => this.characters = characters);
    //     this.dataService.get('abilities', '', (ability) => this.ability = ability.filter((abilityD) => (abilityD.name === 'Slash')));
    //   }
    // });
    // this.dataService.test().subscribe(obj => {
    //   console.log("Test\n", obj);
    // });
  }
  // adminCalculateAllRanks() {
  //   this.database.ref(`/users/`).once('value').then((snapshot) => {
  //     console.log(snapshot.val());
  //   });
  // }

  checkCharacters() {
      return !!(this.characters);
  }
  // Checks if the Account is signed into
  checkSignedIn() {
    return !!(this.userId);
  }
  // Checks if the Account exists
  checkAccount() {
    return (this.account === '404');
  }

  createAccount(teamName, char ,onError) {
    this.http.post<any> ('http://localhost:3001/createAccount', {teamName: teamName, userId: this.userId} , this.httpOptions)
      .pipe(catchError(onError)).subscribe((user) => {
      this.account = user;
      this.createCharacter(char, onError)
    });
  }
  createCharacter(char, onError) {
    this.http.post<any> ('http://localhost:3001/createCharacter', {character: char, userId: this.userId} ,
      this.httpOptions).pipe(catchError(onError)).subscribe((chars) => {
      this.characters = chars;
      this.router.navigate(['home']);
    });
  }

  createPVERoom(onError) {
    const player = {entities: this.getCharacters(), teamName: this.account.teamName, cpu: false};
    this.http.post<any> ('http://localhost:3001/createPVERoom', {player: player, userId: this.userId, level: this.account.level} ,
      this.httpOptions).pipe(catchError(onError)).subscribe((roomId) => {
      this.account.roomId = roomId;
      this.router.navigate(['vampire-village']);
    });
  }


  navigation() {
    if (this.checkSignedIn()) {
      if (this.checkAccount()) {
        this.router.navigate(['create-character']);
      } else {
        this.router.navigate(['home']);
      }
    }
  }
  signIn (email, password, onError, onFinish) {
    firebase.auth().signInWithEmailAndPassword(email, password).then(snapshot => {
      this.userId = snapshot.user.uid;
      this.http.post<any> ('http://localhost:3001/login', {userId: this.userId} , this.httpOptions)
        .pipe(catchError(onError)).subscribe((user) => {
        this.account = user;
        firebase.database().ref(`characters/${this.userId}`).once('value', (snapshot) =>
          this.characters = snapshot.val());
        onFinish();
      });
    }).catch((error) => onError(error));
  }

  signOut() {
    this.account = undefined;
    firebase.auth().signOut();
  }

  signUp(email, password, onError) {
    firebase.auth().createUserWithEmailAndPassword(email, password)
      .then((snapshot) => {
        this.userId = snapshot.user.uid;
        this.signIn(email, password, (error) => this.router.navigate(['login']), () =>
          this.router.navigate(['create-character']))}).catch((error) => onError(error));
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
    Object.keys(this.characters).forEach((key) => {characters.push(Object.assign(this.characters[key], {id: key}))});
    return characters;
  }
}
