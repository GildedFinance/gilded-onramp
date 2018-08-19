export interface IClientWyreWallet {
    name: string,
    callbackUrl?: string,
    type?: string,
    notes?:string
}

export class WyreWallet {

}

export interface IWyreWallet {
    name: string,
    id: string,
    depositAddresses: {
        BTC?: string,
        ETH?:string
    },
    totalBalances: {
        BTC?: string,
        ETH?:string
    },
    availableBalances: {
        BTC?: string,
        ETH?:string
    },
    srn: string,
    balances: {
        BTC?: string,
        ETH?:string
        
    },
    callbackUrl?: string,
    notes?:string
    
}