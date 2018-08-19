export interface IClientPaymentMethod {

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