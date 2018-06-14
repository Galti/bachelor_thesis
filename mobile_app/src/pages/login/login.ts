import {Component} from '@angular/core';
import {IonicPage, NavController} from 'ionic-angular';
import {Storage} from "../../providers/providers";
import {TabsPage} from "../tabs/tabs";


@IonicPage()
@Component({
    selector: 'page-login',
    templateUrl: 'login.html',
})
export class LoginPage {
    mnemonic: string;

    constructor(public navCtrl: NavController, private storage: Storage) {
    }

    onGoToGamePress() {
        this.storage.setMnemonic(this.mnemonic).then(() => {
            this.navCtrl.setRoot(TabsPage);
        });
    }

}
