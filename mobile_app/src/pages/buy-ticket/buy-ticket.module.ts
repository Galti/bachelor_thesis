import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { BuyTicketPage } from './buy-ticket';

@NgModule({
  declarations: [
    BuyTicketPage,
  ],
  imports: [
    IonicPageModule.forChild(BuyTicketPage),
  ],
})
export class BuyTicketPageModule {}
