export interface IClientPaymentMethod {
    owner: string,
    paymentMethodType: string,
    paymentType: string,
    currency: string,
    country: string,
    beneficiaryType: string,
    beneficiaryCompanyName?: string,
    beneficiaryEinTin?: string,
    beneficiaryLandlineNumber?: string,
    beneficiaryEmailAddress: string,
    accountNumber: number,
    routingNumber: number,
    charablePM: boolean,
    accountType: string,
    firstNameOnAccount: string,
    lastNameOnAccount:string
}

export class PaymentMethod {

}

export interface IPaymentMethod {
    id: string, //the id is also an SRN of the format paymentMethod,
    name: string,
    status:string //"AWAITING_FOLLOWUP | AWAITING_DEPOSIT_VERIFICATION | ACTIVE | REJECTED |  DISABLED | PENDING",
    chargeableCurrencies:Array<string>,//["USD"],
    depositableCurrencies:Array<string>,//["USD"],
    chargeFeeSchedule:Array<any>,//[...],
    depositFeeSchedule:Array<any>,//[...],
    minCharge:number,
    maxCharge:number,
    minDeposit:number,
    maxDeposit:number
}