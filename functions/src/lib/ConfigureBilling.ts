export interface IClientBilling {
    accountNumber: number,
    accountType: string,
    beneficiaryCompanyName?: string,
    beneficiaryEinTin?: string ,
    beneficiaryEmailAddress: string,
    beneficiaryLandlineNumber?: string,
    beneficiaryPhoneNumber: string,
    beneficiaryType: string,
    country: string,
    destAmount: number,
    destCurrency: string,
    ethAddress?: string,
    firstNameOnAccount?: string,
    lastNameOnAccount?: string,
    routingNumber: number,
    sourceCurrency: string
}