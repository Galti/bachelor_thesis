import {NgModule, ErrorHandler} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {IonicApp, IonicModule, IonicErrorHandler} from 'ionic-angular';
import { IonicStorageModule } from '@ionic/storage';
import {MyApp} from './app.component';

import {TabsPage} from '../pages/tabs/tabs';
import {AccountPollPage} from '../pages/account-poll/account-poll';
import {LoginPage} from '../pages/login/login';
import {CreateAccountPage} from '../pages/create-account/create-account';
import {BuyTicketPage} from '../pages/buy-ticket/buy-ticket';
import {HistoryPage} from '../pages/history/history';
import {ProfilePage} from '../pages/profile/profile';


import {StatusBar} from '@ionic-native/status-bar';
import {SplashScreen} from '@ionic-native/splash-screen';

import {Storage} from "../providers/providers";

@NgModule({
  declarations: [
    MyApp,
    TabsPage,
    AccountPollPage,
    LoginPage,
    CreateAccountPage,
    BuyTicketPage,
    HistoryPage,
    ProfilePage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    TabsPage,
    AccountPollPage,
    LoginPage,
    CreateAccountPage,
    BuyTicketPage,
    HistoryPage,
    ProfilePage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Storage,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {
}
