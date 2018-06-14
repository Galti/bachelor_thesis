import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';

import {CreateAccountPage} from "../create-account/create-account";
import {LoginPage} from "../login/login";

@IonicPage()
@Component({
    selector: 'page-account-poll',
    templateUrl: 'account-poll.html',
})
export class AccountPollPage {

    constructor(public navCtrl: NavController, public navParams: NavParams) {
    }

    onCreateAccountPress() {
        this.navCtrl.push(CreateAccountPage);
    }

    onLogInPress() {
        this.navCtrl.push(LoginPage);
    }

}
