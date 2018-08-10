import { Effect } from './effect.model';

export class Effects {

  private venomEffect: Effect = new Effect('Venom Effect', 'poisoned', 3,  '#00ff00');
  private bleedEffect: Effect = new Effect('Bleed Effect', 'bleeding', 3,  '#cc0200');
  private chickenEffect: Effect = new Effect('Chicken Effect', 'hexed', 3,  '#cccc10');
  constructor() {
  }

  getAllEffects() {
    return [this.venomEffect, this.bleedEffect, this.chickenEffect];
  }
}
