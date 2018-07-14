import {Effect} from "./effect.model";

export class Effects {

  private venomEffect: Effect = new Effect('Venom Effect','poisoned', 3, "#00ff00");
  private bleedEffect: Effect = new Effect('Bleed Effect','bleeding', 3, "#cc0200");
  private chickenEffect: Effect = new Effect('Chicken Effect','hexed', 3, "#cccc10");
  constructor() {
  }


  getVenomEffect(): Effect {
    return this.venomEffect;
  }

  getBleedEffect(): Effect {
    return this.bleedEffect;
  }

  getChickenEffect(): Effect{
    return this.chickenEffect;
  }
}
