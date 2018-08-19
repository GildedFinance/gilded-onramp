import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import * as Web3ProviderEngine from 'web3-provider-engine';
import Web3 from 'web3';

declare let require: any;
declare let window: any;

@Injectable({
  providedIn: 'root'
})
export class Web3Service {

  private _account: string = null;
  private web3: any;
  private web3Ready = false;
  private isMetamask = false;
  private ledgerConnected = false;

  public account$ = new BehaviorSubject<string>(null);
  public networkID$ = new BehaviorSubject<number>(null);

  constructor() {
    this.checkWeb3();
    setInterval(async () => await this.refreshAccounts(), 1000);
    this.web3Ready = true;
  }

  async checkWeb3(providerEngine?) {
    if (providerEngine || typeof window.web3 !== 'undefined') {
      if (providerEngine) {
        // if Ledger wallet
        this.web3 = new Web3(providerEngine);
        this.ledgerConnected = true;
        this.refreshAccounts(true);
      } else {
        // if Web3 has been injected by the browser (Mist/MetaMask)
        this.ledgerConnected = false;
        this.isMetamask = window.web3.currentProvider.isMetaMask;
        this.web3 = new Web3(window.web3.currentProvider);
      }
      const networkId = await this.web3.eth.net.getId();
      this.networkID$.next(networkId);
    } else {
      console.warn(`No web3 detected`);
      this.networkID$.next(1); // mainnet by default
    }
  }

  private async refreshAccounts(force?: boolean) {
    if (this.ledgerConnected && !force) {
      return;
    }

    const accs = await this.web3.eth.getAccounts();
    if (this.account$.value !== accs[0]) {
      this.account$.next(accs[0]);
    }
  }
}
