import {Injectable} from '@angular/core';
import * as firebase from 'firebase';

@Injectable()
export class DataService {

  firebase: any = firebase.database();

  toArray(obj: any) {
    return Object.keys(obj).map(key => obj[key]);
  }

  database(path?: string) {
    if (path)
      return this.firebase.ref(path);
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
      let data = snapshot.val();
      onLoad(key ? Object.assign({id: key}, data) : this.list(data));
    });
  }

  subscribe(path: string, key: string, onChange: any) {
    this.database(path + this.key(key)).on('value', snapshot => {
      let data = snapshot.val();
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
  getItem(id, callback) {
    this.get('items', id, item =>
      this.get(item.db, item.id, value => callback(value))
    );
  }
  // Finds an Ability given a string
  findAbility(string) {
    let abilities: any = [];
    this.get('abilities', '', data => {
      data = data || [];
      abilities = data;
    });
  return abilities.find((ability) => ability.name === string);
  }
}
