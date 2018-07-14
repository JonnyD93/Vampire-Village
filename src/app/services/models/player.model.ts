import {Entity} from "./entity.model";
import {Item} from "./item.model";

export class Player {

  displayName: string;
  accountId: string;
  level: number;
  experience: number;
  games: {wins: number, kills: number,loses: number, quits: number };
  rank: number;
  characters: Entity[];
  inventory: Item[];


  constructor(displayName, accountId){
    this.displayName = displayName;
    this.accountId = accountId;
    this.level = 1;
    this.experience = 0;
    this.games = {wins: 0, kills: 0, loses: 0, quits: 0};
    this.rank = 0;
    this.characters = [];
    this.inventory = [];
  }
}
