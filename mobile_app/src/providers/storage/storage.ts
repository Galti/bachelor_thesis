import {Injectable} from '@angular/core';
import {Storage as IonicStorageApi} from "@ionic/storage";

const keys = {
  mnemonic: 'mnemonic',
  randomNumber: 'rNum'
};

@Injectable()
export class Storage {

  constructor(private storage: IonicStorageApi) {
    this.storage = storage;
  }

  async getMnemonic() {
    return await this.storage.get(keys.mnemonic).then((value) => {
      if (value) {
        return value;
      } else {
        return null;
      }
    })
  }

  async setMnemonic(mnemonic: string) {
    try {
      await this.storage.set(keys.mnemonic, mnemonic);
    } catch (e) {
      console.log(e);
    }
  }

  async getRandomNumber() {
    return await this.storage.get(keys.randomNumber).then((value) => {
      if (value) {
        return Number(value);
      } else {
        return null;
      }
    })
  }

  async setRandomNumber(rNum: number) {
    try {
      await this.storage.set(keys.randomNumber, rNum);
    } catch (e) {
      console.log(e);
    }
  }
}
