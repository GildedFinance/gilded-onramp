export interface IClientTransfer {
    source?: string,
    sourceAmount: number,
    sourceCurrency?: string,
    dest: string,
    // @TODO: confirm precision
    destAmount?: number, //only include `sourceAmount` or `destAmount`, not both
    destCurrency: string,
    message?: string,
    callbackUrl: string,
    autoConfirm?: boolean,
    customId?: string,
    amountIncludesFees?: boolean,
    muteMessages?: boolean,
    preview?:boolean
}