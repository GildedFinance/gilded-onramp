import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
admin.initializeApp(functions.config().firebase);

// const firestore = new Firestore();
// const settings = { timestampInSnapshots: true };
// firestore.settings(settings);
const db = admin.firestore();
const cors = require('cors')({origin: true});

import { WyreClient } from 'wyre-api'
// @TODO:https://firebase.google.com/docs/functions/config-env
// only issue with this method is that firebase does not allow capitalization in fields
const wyre_keys = require('../private/wyre_keys');
wyre_keys.baseUrl = 'https://api.testwyre.com';
const wyre = new WyreClient(wyre_keys);
import { IWyreWallet } from "./lib/WyreWallet";
import { IPaymentMethod, IClientPaymentMethod } from './lib/PaymentMethod';
import * as crypto from 'crypto';
import { IClientBilling } from './lib/ConfigureBilling';
import { IClientTransfer } from './lib/Transfer';

const debug = false;

export const wyreRates = functions.https.onRequest(async (request, response) => {
    return cors(request, response, async () => {
        return await testRates(request, response)
    });

});

function testRates(req, res) {
    wyre.get("/rates", {}, {
        timeout:1500
    })
    .then((rates) => {
        res.send(rates);
    })
    .catch((error) => {
        res.status(500).send(error);
    })
}

async function createWallet(req_wallet)  {
    const client_wallet = req_wallet;

    // @TODO use type
    // const new_wallet: IClientWyreWallet = {
    //     name: client_wallet.name,
    //     callbackUrl : client_wallet.callbackUrl  || '',
    //     notes : client_wallet.notes || '',
    //     type : client_wallet.type || ''
    // }

    const new_wallet = {
        name: client_wallet.name
    };
    let wallet = <IWyreWallet> {};
    try {
        wallet = await wyre.post('/wallets', new_wallet)
        if (debug) console.log("wallet: "+JSON.stringify(wallet));

    }
    catch (err) {
        console.log(err);
        const resp = {
            status:500,
            message:"Unable to create wallet with Wyre",
            error:err
        }
        return new Promise((resolve, reject) => {
            reject(resp);
        });
    }

    // @TODO optimize this round trip
    try {
        const set_wallet = await db.collection('wallets').doc(wallet.id).set(wallet);
        const ref_wallet = await db.collection('wallets').doc(wallet.id);
        const doc_wallet = await ref_wallet.get();
        const data_id = doc_wallet.data().id;
        return data_id;
    }
    catch (err) {
        const resp = {
            error:err,
            message: "Error saving wallet to db!",
            status: 500
        };
        return new Promise((resolve, reject) => {
            reject(resp);
        });
    }
    
    
}

async function createPaymentMethod(req_pm)  {
    const c_pm = req_pm; //client_paymentMethod
    if(debug)console.log("IClientPaymentMethod");
    // @TODO validate client_paymentMethod
    const new_paymentMethod: IClientPaymentMethod = {
        accountNumber: c_pm.accountNumber,
        accountType: c_pm.accountType,
        beneficiaryCompanyName: c_pm.beneficiaryCompanyName || undefined,
        beneficiaryEinTin: c_pm.beneficiaryEinTin || undefined,
        beneficiaryEmailAddress: c_pm.beneficiaryEmailAddress,
        beneficiaryLandlineNumber: c_pm.beneficiaryLandlineNumber || undefined,
        beneficiaryType: c_pm.beneficiaryType,
        charablePM: true,
        country: c_pm.country,
        currency: c_pm.currency,
        owner: c_pm.owner,
        paymentMethodType: c_pm.paymentMethodType,
        paymentType: c_pm.paymentType,
        routingNumber: c_pm.routingNumber,
        firstNameOnAccount: c_pm.firstNameOnAccount,
        lastNameOnAccount:c_pm.lastNameOnAccount
    };

    if(debug)console.log("new_paymentMethod: " + JSON.stringify(new_paymentMethod));
    let paymentMethod = <IPaymentMethod>{};
    try {
        paymentMethod = await wyre.post('/paymentMethods', new_paymentMethod);
        if(debug) console.log("created paymentMethod: "+JSON.stringify(paymentMethod))
    }
    catch (error) {
        console.log(error);
        const resp = {
            err:error,
            message: "Unable to create new paymentMethod.",
            status: 500
        };
        throw resp;
    }    

    try {
        const set_paymentMethod = await db.collection('paymentMethods').doc(paymentMethod.id).set(paymentMethod);
        const ref_paymentMethod = await db.collection('paymentMethods').doc(paymentMethod.id);
        const doc_paymentMethod = await ref_paymentMethod.get();
        const data_id = doc_paymentMethod.data().id;
        return data_id;
    }
    catch (error) {
        const resp = {
            ...error,
            message: "Unable to save paymentMethod to db!",
            status: 500
        };
        return new Promise((resolve, reject) => {
            reject(resp);
        });
    }

}

async function createTransfer(req_createTransfer) {
    const client_transfer = req_createTransfer;
    // @TODO: validate transfer

    // @TODO: SAVE CALLBACKURL
    const new_transfer : IClientTransfer = {
        source: client_transfer.source,
        sourceCurrency: client_transfer.sourceCurrency,
        sourceAmount: client_transfer.sourceAmount,
        dest: client_transfer.dest,
        destCurrency: client_transfer.destCurrency,
        preview: client_transfer.isQuote || false,
        amountIncludesFees: client_transfer.amountIncludesFees,
        message: client_transfer.message || '',
        autoConfirm: client_transfer.autoConfirm || false,
        callbackUrl: client_transfer.callbackUrl || ''
    };

    let transfer;
    try {
        transfer = await wyre.post('/transfers', new_transfer)
        return transfer;
    }
    catch (error) {
        console.log(error);
        const resp = {
            ...error,
            message: "Unable to create transfer",
            status: 500
        };
        return new Promise((resolve, reject) => {
            reject(resp);
        });
    }

}

export const getAccount = functions.https.onRequest(async (req, res) => {
    return cors(req, res, async () => {
        const account = await wyre.get('/account');
        res.send(account);    
    });
})

/**
 * Hits createWallet, createPaymentMethod, and createTransfer 
 * where createTransfer is not a quote.
 */
export const configureBilling = functions.https.onRequest(async (req, res) => {
    return cors(req, res, async () => {
    
        if (debug) console.log("configureBilling endpoint");
        
        let built_paymentMethod;
        try {
            // @TODO: use more sane variable naming
            built_paymentMethod = await createBilling(req.body);
        }
        catch (err) {
            if(debug){console.log(JSON.stringify(err))}
            const resp = {
                error:err,
                message: "Unable to createBilling",
                status:500
            }
            res.status(resp.status).send(resp);
        }

        // @TODO determine real variables here from client as well as how to properly populate them
        try {
            if (debug) console.log("billing: " + JSON.stringify(built_paymentMethod));
            if(debug)console.log("await createPaymentMethod")
            const paymentMethod = await createPaymentMethod(built_paymentMethod);
            if (debug) console.log("buildTransfer");
            const built_transfer = buildTransfer(paymentMethod, req.body);
            if(debug) console.log("createTransfer")
            const transfer = await createTransfer(built_transfer);
            res.status(200).send(transfer);
        }
        catch (error) {
            console.log(JSON.stringify(error))
            const resp = {
                err:error,
                message: "Unable to configure billing",
                status: 500
            };
            res.status(resp.status).send(resp);
        }
    });
})

// @TODO: Not working
export const confirmTransfer = functions.https.onRequest(async (req, res) => {
    return cors(req, res, async () => {
        const client_confirmation = req.body;
        // @TODO: validate confirmation
        const new_confirmation = {
            id: client_confirmation.id
        }
        console.log("new_confirmation: "+JSON.stringify(new_confirmation));
    
        let confirmation;
        try {
            confirmation = await wyre.post('/transfer/'+new_confirmation.id+'/confirm');
            res.send({status:confirmation.status})
        }
        catch (error) {
            res.status(500).send("Unable to confirm transfer: " + error);
        }
    });

})


export const transferStatus = functions.https.onRequest(async (req, res) => {
    return cors(req, res, async () => {
        const client_confirmation = req.body;
        // @TODO: validate confirmation
        const new_confirmation = {
            id: client_confirmation.id
        }
        console.log("new_confirmation: "+JSON.stringify(new_confirmation));
    
        let confirmation;
        try {
            confirmation = await wyre.post('/transfer/'+new_confirmation.id);
            res.send({status:confirmation.status})
        }
        catch (error) {
            res.status(500).send("Unable to retrieve transfer status: " + JSON.stringify(error));
        }
    });

})

function generateWalletName(details) {
    const sha256 = crypto.createHash('sha256').update(JSON.stringify(details)+new Date()).digest("hex");
    return sha256;
}

/**
 * creates wallet for user, uses that generated wallet
 * to build a paymentMethod object, returns that object
 * @param client_blob 
 */
async function createBilling(client_blob) {
        // @TODO validation
    
    if (debug) console.log("createBilling+client_blob: " + JSON.stringify(client_blob));

    const billing : IClientBilling = {
        accountNumber: client_blob.accountNumber,
        accountType: client_blob.accountType,
        beneficiaryCompanyName: client_blob.beneficiaryCompanyName || '',
        beneficiaryEinTin: client_blob.beneficiaryEinTin || '',
        beneficiaryEmailAddress: client_blob.beneficiaryEmailAddress,
        beneficiaryLandlineNumber: client_blob.beneficiaryLandlineNumber || '',
        beneficiaryPhoneNumber: client_blob.beneficiaryPhoneNumber,
        beneficiaryType: client_blob.beneficiaryType,
        country: client_blob.country,
        destAmount: client_blob.destAmount,
        destCurrency: client_blob.destCurrency,
        routingNumber: client_blob.routingNumber,
        ethAddress: client_blob.ethAddress,
        firstNameOnAccount: client_blob.firstNameOnAccount || '',
        lastNameOnAccount: client_blob.lastNameOnAccount || '',
        sourceCurrency:client_blob.sourceCurrency
    }

    if(debug)console.log("createBilling: "+JSON.stringify(billing))

    const wallet_name_seed = {
        beneficiaryEmailAddress: billing.beneficiaryEmailAddress,
        beneficiaryPhoneNumber: billing.beneficiaryPhoneNumber
    }
    let wallet_name;
    try {
        wallet_name = generateWalletName(wallet_name_seed);
    }
    catch (error) {
        console.log(JSON.stringify(error));
        const resp = {
            ...error,
            message: "Unable to create wallet hash",
            status: 500
        };
        return new Promise((resolve, reject) => {
            reject(resp);
        });
    }

    let wallet_id;
    try {
        wallet_id = await createWallet({ name: wallet_name });
    }
    catch (err) {
        if(debug)console.log(JSON.stringify(err))
        const resp = {
            error: err,
            message: "Unable to create wallet in createBilling",
            status: 500
        };
        return new Promise((resolve, reject) => {
            reject(resp);
        });
    }
    const payment_method : IClientPaymentMethod = {
        accountNumber: billing.accountNumber,
        accountType: billing.accountType,
        beneficiaryCompanyName: billing.beneficiaryCompanyName || '',
        beneficiaryEinTin: billing.beneficiaryEinTin || '',
        beneficiaryEmailAddress: billing.beneficiaryEmailAddress,
        beneficiaryLandlineNumber: billing.beneficiaryLandlineNumber || '',
        beneficiaryType: billing.beneficiaryType,
        charablePM: true,
        country: billing.country,
        currency: billing.sourceCurrency,
        owner: 'wallet: ' + wallet_id,
        paymentMethodType: 'INTERNATIONAL_TRANSFER',
        paymentType:'LOCAL_BANK_WIRE',
        routingNumber: billing.routingNumber,
        firstNameOnAccount: billing.firstNameOnAccount,
        lastNameOnAccount:billing.lastNameOnAccount
    }

    return payment_method;

}

/**
 * Accepts the response from creating a paymentMethod,
 * uses that data plus our original client blob (whatever is left over)
 * to create a transfer
 * @ TODO: Handle case when the user wants to purchase dai and we need to make a different purchase
 * @param resp_paymentMethod 
 */
function buildTransfer(resp_paymentMethod, client_blob) {
    if (client_blob.destCurrency === 'dia') {
        // @TODO dia special case to construct 2 transfers
    }
    if (debug) console.log("buildTransfer() client_blob: " + JSON.stringify(client_blob));
    const transfer: IClientTransfer = {
        amountIncludesFees: false,
        autoConfirm: client_blob.autoConfirm || false,
        callbackUrl: '', // @TODO CREATE AND SAVE,
        customId: undefined,
        dest: 'ethereum:'+client_blob.ethAddress, //this is where we want to send ETH, metamask
        destAmount: undefined, //see interface for explanation
        destCurrency: client_blob.destCurrency,
        message: '',
        muteMessages: false,
        source: 'paymentMethod:'+resp_paymentMethod, // not required
        //source:'account:AC-X2FBT3YAAUC',
        sourceAmount: client_blob.destAmount, // @TODO: get Gil to add sourceAmount to his client
        sourceCurrency: client_blob.sourceCurrency,
        preview: client_blob.preview || true
    }
    if (debug) console.log("buildTransfer() transfer: IClientTransfer -: " + JSON.stringify(transfer));
    return transfer;
}