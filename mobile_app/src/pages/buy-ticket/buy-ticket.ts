import {Component} from '@angular/core';
import {IonicPage, AlertController} from 'ionic-angular';
import {Storage} from "../../providers/providers";

@IonicPage()
@Component({
    selector: 'page-buy-ticket',
    templateUrl: 'buy-ticket.html',
})
export class BuyTicketPage {
    ticketsCount: string;
    web3: object;
    contract: object;
    waitingForResult;
    currentGameId: number;

    constructor(private storage: Storage, private alertCtrl: AlertController) {
        setTimeout(() => {
            this.web3 = window['web3'];
            this.contract = window['contract'];

            this.checkTicketsCount();
            setInterval(this.checkTicketsCount, 15000);
        }, 200);
    }

    onBuyPress = () => {
        let alert = this.alertCtrl.create({
            message: 'Confirm purchase',
            buttons: [
                {
                    text: 'Cancel',
                    role: 'cancel',
                },
                {
                    text: 'Buy',
                    handler: () => {
                        this.handleBuying()
                    }
                }
            ]
        });
        alert.present();
    };

    handleBuying = () => {
        const randomNumber = Math.floor((Math.random() * 999999) + 1);
        this.storage.setRandomNumber(randomNumber);

        this.web3['eth'].getAccounts().then((acc) => {
            this.contract['methods'].checkBuyerExists(acc[0]).call().then((res) => {
                if (!res) {
                    const transaction = this.contract['methods'].buyTicket(this.web3['utils'].soliditySha3(randomNumber, acc[0]));
                    const tx = {
                        from: acc[0],
                        value: '20000000000000000',
                        gasPrice: "20000000000",
                        gas: 97764
                    };

                    transaction.estimateGas(tx).then((gas) => {
                        tx.gas = gas;

                        transaction.send(tx).then(() => {
                            this.contract['methods'].getCurrentGameId().call().then((id) => {
                                this.currentGameId = id;
                                this.waitingForResult = setInterval(this.checkRevelation, 15000);
                            });
                        });
                    });
                }
            });
        });
    };

    checkTicketsCount = () => {
        this.contract['methods'].checkTicketsBox().call().then((count) => {
            this.ticketsCount = count.toString();
        });
    };

    revealTheNumber = () => {
        this.storage.getRandomNumber().then((rNum) => {
            this.web3['eth'].getAccounts().then((acc) => {
                const tx = {
                    from: acc[0],
                    gas: ''
                };

                const transaction = this.contract['methods'].revealTheNumber(+rNum);

                transaction.estimateGas(tx).then((gas) => {
                    tx.gas = gas;

                    transaction.send(tx).then(() => {
                        this.waitingForResult = setInterval(this.checkRevelationEnd, 15000);
                    });
                });
            })
        });
    };

    checkRevelation = () => {
        this.contract['methods'].shouldRevealTheNumber().call().then((shouldReveal) => {
            if (shouldReveal) {
                clearInterval(this.waitingForResult);
                this.waitingForResult = null;
                this.revealTheNumber();
            }
        });
    };

    checkRevelationEnd = () => {
        this.contract['methods'].getCurrentGameId().call().then((id) => {
            if (id != this.currentGameId) {
                this.contract['methods'].getGameWinner(this.currentGameId).call().then((winner) => {
                    this.web3['eth'].getAccounts().then((acc) => {
                        if (acc[0] == winner) {
                            console.log('You won game', this.currentGameId);
                        } else {
                            console.log('You lost game', this.currentGameId);
                        }

                        clearInterval(this.waitingForResult);
                        this.waitingForResult = null;
                        this.currentGameId = null;
                    });
                })
            }
        });
    };
}
