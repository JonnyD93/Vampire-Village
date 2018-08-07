import { Injectable } from '@angular/core';
import * as firebase from "firebase";
import {Router} from "@angular/router";
import {Player} from "./models/player.model";
import {Item} from "./models/item.model";
import {Entity} from "./models/entity.model";
import {AbilitiesService} from "./abilities.service";

@Injectable()
export class AccountService {


  user: any;
  private account: Player;
  private loggedIn: boolean;
  database: any;

  constructor(private router: Router, private abilitiesService: AbilitiesService) {
    this.database = firebase.database();
    this.loggedIn = false;
  }

  rndInt(x: number) {
    return Math.round(Math.random() * x)
  }
  rndIntBtw(x: number, y: number){
    return (this.rndInt(y) - this.rndInt(x)) + x
  }
  checkSignedIn(){
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.user = {email: user.email, id: user.uid};
        this.database.ref('/users').once('value').then((snapshot)=>{
          if(snapshot.val() != null)
            this.account = snapshot.val()[this.user.id];
        });
        this.loggedIn = true;
      } else
        this.loggedIn = false;
    });
    if (this.loggedIn) {
      if (this.account === undefined)
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
  getAccount(): Player {
    return this.account;
  }

  createPVERoom(){
    this.database.ref(`/rooms/PVE/${this.user.id}`).set({
      enemies: this.createVampire(this.account.level)
    });
  }

  createVampire(level){
    let vampires = [];
    for(let x = 0; x < this.rndInt((level/5)+1); x++) {
      // Character name, side, health, attack, defence, accuracy, agility, resistance, abilities
      vampires.push(new Entity("Vampire","vampire",
        this.rndIntBtw(20+level,70 + this.rndInt(level*5)),
        this.rndIntBtw(this.rndInt(level), this.rndInt(level*2)),
        this.rndIntBtw(Math.floor(level/5),this.rndInt(Math.floor(level/2))),
        this.rndIntBtw(60,100),
        this.rndIntBtw(this.rndInt(level),level+10),
        this.rndIntBtw(0,this.rndInt(level)),
        [this.abilitiesService.get('basicAttack')]));
    }
    return vampires;
  }

  adminCalculateAllRanks(){
    this.database.ref(`/users/`).once('value').then((snapshot)=>{
      console.log(snapshot.val());
    })
  }
}
