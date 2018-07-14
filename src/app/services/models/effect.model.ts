export class Effect {

  name: string;
  desc: string;
  duration: number;
  color: string;


  constructor(name,desc, duration, color){
    this.name = name;
    this.desc = desc;
    this.duration = duration;
    this.color = color;
  }
}
