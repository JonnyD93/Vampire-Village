import {Injectable} from '@angular/core';
import * as firebase from 'firebase';

@Injectable()
export class DataService {
  toBody = (element,key?,list?) => {
    var list = list || [];
    if(typeof element === 'object')
      for (var idx in element)
        this.toBody(element[idx],key?key+'['+idx+']':idx,list);
    else
      list.push(key+'='+encodeURIComponent(element));
    return list.join('&');
  }
  post = async (url, obj) => {
    console.log(`pending post...${url}`);
    const body = JSON.parse(JSON.stringify(obj));
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: this.toBody(body)
    });
    const json = await response.json();
    console.log(`post retrieved${json}`);
    return json;
  }
  target = e => 'localhost:3001' + (e ? '/' + e : '');

//data
   login = async user => this.post(this.target('login'), user);

   namechange = async (id, name) => this.post(this.target('namechange'), {id, name});
  firebase: any = firebase.database();

  toArray(obj: any) {
    return Object.keys(obj).map(key => obj[key]);
  }

  database(path?: string) {
    if (path) {
      return this.firebase.ref(path);
    }
    return this.firebase;
  }

  private key(str: string) {
    return str ? `/${str}` : '';
  }

  private list(ar: any) {
    if (ar) {
      Object.keys(ar).forEach(key => ar[key].id = key);
      return this.toArray(ar);
    }
    return undefined;
  }

  get(path: string, key: string, onLoad) {
    this.database(path + this.key(key)).once('value').then(snapshot => {
      const data = snapshot.val();
      onLoad(key ? Object.assign([], data) : this.list(data));
    });
  }
  subscribe(path: string, key: string, onChange: any) {
    this.database(path + this.key(key)).on('value', snapshot => {
      const data = snapshot.val();
      onChange(key ? Object.assign({id: key}, data) : this.list(data));
    });
  }

  delete(path: string, key?: string) {
    this.database(path + this.key(key)).remove();
  }

  save(path, key, obj) {
    this.database(path + this.key(key)).set(obj);
  }

  add(path: string, item: any) {
    const key = this.database(path).push().key;
    this.database().ref().update({[path + '/' + key]: item});
    return key;
  }

  update(path: string, key: string, objectUpdates: any) {
    this.database().ref(path + this.key(key)).update(objectUpdates);
  }

  //
  getItem(string) {
    let item: any = [];
    this.get('items', string, data => {
      data = data || [];
      item = data;
    });
    return item;
  }
  // Finds an Ability given a string
  getAbilities(string) {
    const ability: any = [];
    this.get('abilities', '', data => {
      data = data || [];
      ability.push(data.filter((abilityD) => abilityD.id === string));
    });
    console.log(ability);
  return ability;
  }
}
