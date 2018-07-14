import { Injectable } from '@angular/core';
import * as firebase from "firebase";
import {Router} from "@angular/router";
import {Player} from "./models/player.model";
import {Item} from "./models/item.model";
import {Entity} from "./models/entity.model";

@Injectable()
export class AccountService {


  user: any;
  private _account: Player;
  private loggedIn: boolean;
  database: any;

  constructor(private router: Router) {
    this.database = firebase.database();
    this.loggedIn = false;
  }

  checkSignedIn(){
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.user = {email: user.email, id: user.uid};
        this.database.ref('/users').once('value').then((snapshot)=>{
          if(snapshot.val() != null)
            this._account = snapshot.val()[this.user.id];
        });
        this.loggedIn = true;
      } else
        this.loggedIn = false;
    });
    if (this.loggedIn) {
      if (this._account === undefined)
        this.router.navigate(['create-character']);
      else
        this.router.navigate(['home']);
    } else
      this.router.navigate(['login']);
  }

  signIn(email,password,onFinish,onError){
    firebase.auth().signInWithEmailAndPassword(email,password)
      .then(()=>onFinish())
      .catch((error)=> onError(error));
  }

  signOut(){
    firebase.auth().signOut();
  }

  signUp(email, password, onFinish, onError){
    firebase.auth().createUserWithEmailAndPassword(email, password)
      .then(() =>
      {this.signIn(email,password,
        () => onFinish(),
        (error) => this.router.navigate(['login']));}
    )
      .catch( (error)=> onError(error));
  }

  createAccount(account){
    this.database.ref(`/users/${this.user.id}`).set({
      displayName: account.displayName,
      level: 0,
      experience: 0,
      games: {wins: 0, kills: 0, loses: 0, quits: 0},
      rank: 0,
      characters: account.characters,
      inventory: []
    });
    this.router.navigate(['home'])
  }
  get account(): Player {
    return this._account;
  }
  adminCalculateAllRanks(){
    this.database.ref(`/users/`).once('value').then((snapshot)=>{
      console.log(snapshot.val());
    })
  }
}
