import { Component } from '@angular/core';

import {BuyTicketPage} from "../buy-ticket/buy-ticket";
import {HistoryPage} from "../history/history";
import {ProfilePage} from "../profile/profile";

import Web3 from 'web3';
import HDWalletProvider from 'truffle-hdwallet-provider';
import {Storage} from "../../providers/providers";
import abi from '../../abiInterface';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = BuyTicketPage;
  tab2Root = HistoryPage;
  tab3Root = ProfilePage;
  web3: object;
  contract: object;

  constructor(private storage: Storage) {
    this.storage.getMnemonic().then((mnemonic) => {
      Web3.providers.HttpProvider.prototype.sendAsync = Web3.providers.HttpProvider.prototype.send;
      this.web3 = new Web3(new HDWalletProvider(mnemonic, 'https://rinkeby.infura.io'));
      this.contract = new this.web3['eth'].Contract(abi, '0x7afba64c964e4f9c4f532f325b773e06f1cc0e78');
      window['web3'] = this.web3;
      window['contract'] = this.contract;
    });

  }
}
