import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AccountPollPage } from './account-poll';

@NgModule({
  declarations: [
    AccountPollPage,
  ],
  imports: [
    IonicPageModule.forChild(AccountPollPage),
  ],
})
export class AccountPollPageModule {}
