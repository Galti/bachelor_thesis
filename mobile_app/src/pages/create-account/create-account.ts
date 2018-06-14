import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {AlertController} from 'ionic-angular';

import {Storage} from "../../providers/providers";

import {TabsPage} from "../tabs/tabs";

@IonicPage()
@Component({
  selector: 'page-create-account',
  templateUrl: 'create-account.html',
})
export class CreateAccountPage {
  mnemonic: string;

  constructor(public navCtrl: NavController, public navParams: NavParams, private alertCtrl: AlertController, private storage: Storage) {
    this.mnemonic = 'mutual stem embark pilot dry excuse sauce fantasy forum mule over grab';
  }

  presentAlert() {
    let alert = this.alertCtrl.create({
      title: 'Note',
      subTitle: 'To recover account use the phrase.',
      buttons: [{
        text: 'OK',
        handler: () => this.handleCompleteRegistration()
      }]
    });
    alert.present();
  }

  handleCompleteRegistration() {
    this.storage.setMnemonic(this.mnemonic).then(() => {
      this.navCtrl.setRoot(TabsPage);
    })
  }

  onGoToGamePress() {
    this.presentAlert();
  }
}
