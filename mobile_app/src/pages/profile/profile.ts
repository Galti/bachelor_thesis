import {Component} from '@angular/core';
import {IonicPage, NavController} from 'ionic-angular';

import {Storage} from "../../providers/providers";
import {AccountPollPage} from "../account-poll/account-poll";
import {App} from 'ionic-angular';

@IonicPage()
@Component({
    selector: 'page-profile',
    templateUrl: 'profile.html',
})
export class ProfilePage {
    web3: object;
    contract: object;
    address: string;
    balance: string;

    constructor(public navCtrl: NavController, private storage: Storage, public app: App) {
        this.web3 = window['web3'];
        this.contract = window['contract'];

        this.web3['eth'].getAccounts().then((acc) => {
            this.address = acc[0];

            this.web3['eth'].getBalance(this.address).then((balance) => {
                this.balance = this.web3['utils'].fromWei(balance, 'ether');
                this.balance = this.balance.slice(0, 4);
            })
        })
    }

    onLogOutPress = () => {
        this.storage.setMnemonic(null);
        this.navCtrl.popAll();
        this.app.getRootNav().setRoot(AccountPollPage);
    }

}
