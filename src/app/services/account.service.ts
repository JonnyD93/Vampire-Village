import {Injectable} from '@angular/core';
import * as firebase from 'firebase';
import {Router} from '@angular/router';
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

  constructor(private router: Router, private http: HttpClient) {}

  attack(attacker, defender, onError) {
    this.http.post<any> ('http://localhost:3001/attack', {attacker: attacker.id, defender: defender,
        roomId: this.getRoomId()} , this.httpOptions).pipe(catchError(onError))
      .subscribe(data => data);
  }

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
  checkStatus (onError) {
    if (this.getRoomId() === 'No User') {
      this.router.navigate(['login']);
    } else if (this.getRoomId() === 'No RoomId') {
      this.router.navigate(['home']);
    } else {}
  }
  createAccount(teamName, char , onError) {
    this.http.post<any> ('http://localhost:3001/createAccount', {teamName: teamName, userId: this.userId} , this.httpOptions)
      .pipe(catchError(onError)).subscribe((user) => {
      this.account = user;
      this.createCharacter(char, onError);
    });
  }
  createCharacter(char, onError) {
    this.http.post<any> ('http://localhost:3001/createCharacter', {character: char, userId: this.userId} ,
      this.httpOptions).pipe(catchError(onError)).subscribe((chars) => {
      this.characters = chars;
      this.router.navigate(['home']);
    });
  }

  async createPVERoom(onError) {
      await this.http.post<any>('http://localhost:3001/createPVERoom', {player: this.getCharacters(),
          teamName: this.account.teamName, accountId: this.account.id, userId: this.userId, level: this.account.level }, this.httpOptions)
        .pipe(catchError(onError)).subscribe((data) => this.account.roomId = data.id);
  }

  dropRoom(onError){
    this.http.post<any> ('http://localhost:3001/dropRoom', {accountId: this.getAccount().id} , this.httpOptions).pipe(catchError(onError))
      .subscribe(data => data);
  }

  ping(onError){
    this.http.post<any> ('http://localhost:3001/ping', {roomId: this.getRoomId()} , this.httpOptions).pipe(catchError(onError))
      .subscribe(data => data);
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
  skipPlayerTurn(entity, onError) {
      this.http.post<any>('http://localhost:3001/skipPlayerTurn', {entityId: entity, roomId: this.getRoomId()},
        this.httpOptions).pipe(catchError(onError));
  }
  signIn (email, password, onError, onFinish) {
    firebase.auth().signInWithEmailAndPassword(email, password).then(snapshot => {
      this.userId = snapshot.user.uid;
      this.http.post<any> ('http://localhost:3001/login', {userId: this.userId} , this.httpOptions)
        .pipe(catchError(onError)).subscribe((user) => {
        this.account = user;
        firebase.database().ref(`characters/${this.userId}`).once('value', snapshot2 =>
          this.characters = snapshot2.val());
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
          this.router.navigate(['create-character'])); }).catch((error) => onError(error));
  }

  getAccount() {
    return this.account;
  }
  getAccountStats() {
    return {level: this.account.level, experience: this.account.experience, teamName: this.account.teamName};
  }
  getRoomId() {
    if (this.account) {
      return (this.account.roomId) ? this.account.roomId : null;
    } else {
      return 'No User';
    }
  }
  getCharacters() {
    const characters = [];
    Object.keys(this.characters).forEach((key) => {characters.push(Object.assign(this.characters[key], {id: key, accountId: this.account.id})); });
    return characters;
  }
}
