import {Entity} from "./entity.model";
import {Item} from "./item.model";

export class Player {

  teamName: string;
  accountId: string;
  roomId: string;
  level: number;
  experience: number;
  games: {wins: number, kills: number, loses: number, quits: number };
  rank: number;
  inventory: Item[];


  constructor(teamName, accountId) {
    this.teamName = teamName;
    this.accountId = accountId;
    this.roomId = '';
    this.level = 1;
    this.experience = 0;
    this.games = {wins: 0, kills: 0, loses: 0, quits: 0};
    this.rank = 0;
    this.inventory = [];
  }
}
