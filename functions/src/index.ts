import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
admin.initializeApp(functions.config().firebase);

// const firestore = new Firestore();
// const settings = { timestampInSnapshots: true };
// firestore.settings(settings);
const db = admin.firestore();

import { WyreClient } from 'wyre-api'
// @TODO:https://firebase.google.com/docs/functions/config-env
// only issue with this method is that firebase does not allow capitalization in fields
const wyre_keys = require('../private/wyre_keys');
wyre_keys.baseUrl = 'https://api.testwyre.com';
const wyre = new WyreClient(wyre_keys);
import { WyreWallet, IClientWyreWallet, IWyreWallet } from "./lib/WyreWallet";
import { IPaymentMethod } from './lib/PaymentMethod';
import { create } from 'domain';


export const helloWorld = functions.https.onRequest((request, response) => {
 response.send("Welcome to Gilded OnRamp!");
});

export const wyreRates = functions.https.onRequest(async (request, response) => {

    return await testRates(request, response);

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
    }
    catch (error) {
        console.log(error);
        const resp = {
            status:500,
            message:"Unable to create wallet with Wyre",
            ...error
        }
        throw resp;
    }

    // @TODO optimize this round trip
    try {
        const set_wallet = await db.collection('wallets').doc(wallet.id).set(wallet);
        const ref_wallet = await db.collection('wallets').doc(wallet.id);
        const doc_wallet = await ref_wallet.get();
        const data_id = doc_wallet.data().id;
        return data_id;
    }
    catch (error) {
        const resp = {
            ...error,
            message: "Error saving wallet to db!",
            status: 500
        };
        throw resp;
    }
    
    
}

async function createPaymentMethod(req_pm)  {
    const client_paymentMethod = req_pm;

    // @TODO validate client_paymentMethod
    const new_paymentMethod = client_paymentMethod;

    console.log("new_paymentMethod: " + JSON.stringify(new_paymentMethod));
    let paymentMethod = <IPaymentMethod>{};
    try {
        paymentMethod = await wyre.post('/paymentMethods', new_paymentMethod);
    }
    catch (error) {
        console.log(error);
        const resp = {
            ...error,
            message: "Unable to crea,te new paymentMethod.",
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
        throw resp;
    }

}

async function createTransfer(req_createTransfer) {
    const client_transfer = req_createTransfer;
    // @TODO: validate transfer

    // @TODO: SAVE CALLBACKURL
    const new_transfer = {
        source: client_transfer.source,
        sourceCurrency: client_transfer.source_currency,
        sourceAmount: client_transfer.sourceAmount,
        dest: client_transfer.dest,
        destCurrency: client_transfer.destCurrency,
        preview: client_transfer || true,
        amountIncludesFees: client_transfer.amountIncludesFees,
        message: client_transfer.message || '',
        autoConfirm: client_transfer.autoConfirm || false,
        callbackUrl: client_transfer.callbackUrl || ''
    };

    let transfer;
    try {
        transfer = await wyre.post('/transfer', new_transfer)
        return transfer;
    }
    catch (error) {
        console.log(error);
        const resp = {
            ...error,
            message: "Unable to create transfer",
            status: 500
        };
        throw resp;
    }

}
/**
 * Hits createWallet, createPaymentMethod, and createTransfer 
 * where createTransfer is not a quote.
 */
export const configureBilling = functions.https.onRequest(async (req, res) => {
    let client_wallet;
    let client_paymentMethod;
    let client_transfer;
    try {
        client_wallet = req.body.wallet;
        client_paymentMethod = req.body.paymentMethod;
        client_transfer = req.body.transfer;
    }
    catch (error) {
        const resp = {
            ...error,
            message: "Unable to declare variables",
            status:500
        }
        res.status(resp.status).send(resp);
    }

    // @TODO determine real variables here from client as well as how to properly populate them
    try {
        const wallet_id = await createWallet(client_wallet);
        client_paymentMethod.owner = "wallet: " + wallet_id;
        const paymentMethod = await createPaymentMethod(client_paymentMethod);
        const transfer = await createTransfer(client_transfer);
        res.status(200).send(transfer);
    }
    catch (error) {
        console.log(typeof error);
        const resp = {
            err:error,
            message: "Unable to configure billing",
            status: 500
        };
        res.status(resp.status).send(resp);
    }
})

export const confirmTransfer = functions.https.onRequest(async (req, res) => {
    const client_confirmation = req.body;
    // @TODO: validate confirmation
    const new_confirmation = {
        id: client_confirmation.id
    }

    let confirmation;
    try {
        confirmation = await wyre.post('/transfer/{confirmation.id}');
        res.send({status:confirmation.status})
    }
    catch (error) {
        res.status(500).send("Unable to confirm transfer: " + error);
    }
})
