import {Component} from '@angular/core';
import {IonicPage} from 'ionic-angular';

@IonicPage()
@Component({
    selector: 'page-history',
    templateUrl: 'history.html',
})
export class HistoryPage {
    web3: object;
    contract: object;
    address: string;
    history;
    isTicketsSoldOut: boolean;
    isRevelationEnded: boolean;
    isIncludedInGame;
    currentGameId: boolean;
    revealedNumber: number;

    constructor() {
        this.web3 = window['web3'];
        this.contract = window['contract'];
        this.web3['eth'].getAccounts().then((acc) => {
            this.address = acc[0];

            this.getHistory();
            this.getCurrentGame();
            setInterval(this.getHistory, 15000);
            setInterval(this.getCurrentGame, 15000);
        });

    }

    getHistory = () => {
        this.web3['eth'].getAccounts().then((acc) => {
            const myAccount = acc[0];
            const transaction = this.contract['methods'].getMyHistory();
            const tx = {
                from: myAccount,
                gas: ''
            };

            transaction.estimateGas(tx).then((gas) => {
                tx.gas += gas;

                transaction.call(tx).then((history) => {
                    this.history = history[0].map((gameId, index) => {
                        return {
                            gameId,
                            won: history[1][index] == acc[0],
                            winner: history[1][index]
                        }
                    });
                });
            });
        });
    };

    getCurrentGame = () => {
        this.contract['methods'].getCurrentGameId().call().then((id) => {
            this.currentGameId = id;
        });

        this.contract['methods'].getCurrentGameTickets().call().then((tickets) => {
            let indx;
            this.isIncludedInGame = tickets[0].find((address, index) => {
                if (address == this.address) {
                    indx = index;
                    return true;
                } else {
                    return false;
                }
            });

            if (this.isIncludedInGame) {
                this.contract['methods'].getCurrentGameStates().call().then((states) => {
                    this.isTicketsSoldOut = states[0];
                    this.isRevelationEnded = states[1];
                    this.revealedNumber = tickets[1][indx - 1] != 0 ? tickets[1][indx - 1] : null;
                })
            }
        });
    }
}
