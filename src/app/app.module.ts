import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import {HashLocationStrategy, Location, LocationStrategy} from '@angular/common';
import * as firebase from "firebase";
// Important Components
import { AppComponent } from './app.component';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';

// Components
import { VampireVillageComponent } from './game/vampire-village.component';
import { HomeComponent } from './home page/home.component';
import { LoginComponent } from './login/login.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { InventoryComponent } from './inventory page/inventory';
import { CreateCharacter } from './create-character/create-character.component';

//Services
import { ItemsService } from "./services/items.service";
import { EffectsService } from "./services/effects.service";
import { AccountService } from "./services/account.service";
import { AbilitiesService } from "./services/abilities.service";
import { FakeDataService } from "./services/fakeData.service";

const appRoutes: Routes = [
  { path: 'vampire-village', component: VampireVillageComponent },
  { path: 'home', component: HomeComponent },
  { path: 'signup', component: SignUpComponent },
  { path: 'login', component: LoginComponent },
  { path: 'inventory', component: InventoryComponent },
  { path: 'create-character', component: CreateCharacter },
  { path: '', redirectTo: '/login', pathMatch: 'full'},
  { path: '**', component: LoginComponent }
];

const config = {
  apiKey: "AIzaSyCHMKoEPTY3qTe9aLIvEQ-RuI5yNpWXVBE",
  authDomain: "vampirevillage-1a0e0.firebaseapp.com",
  databaseURL: "https://vampirevillage-1a0e0.firebaseio.com",
  projectId: "vampirevillage-1a0e0",
};
firebase.initializeApp(config);

@NgModule({
  declarations: [
    AppComponent,
    LayoutComponent,
    // Pages of Website Below
    VampireVillageComponent,
    HomeComponent,
    LoginComponent,
    SignUpComponent,
    InventoryComponent,
    CreateCharacter,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    RouterModule.forRoot(appRoutes)
  ],
  providers: [AbilitiesService, AccountService, FakeDataService, ItemsService, EffectsService, Location, {provide: LocationStrategy, useClass: HashLocationStrategy}],
  bootstrap: [AppComponent]
})
export class AppModule { }
