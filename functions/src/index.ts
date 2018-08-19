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


export const helloWorld = functions.https.onRequest((request, response) => {
 response.send("Welcome to Gilded OnRamp!");
});

export const wyreRates = functions.https.onRequest((request, response) => {
    
    wyre.get("/rates", {}, {
        timeout: 1500
    })
    .then((rates) => {
        response.send(rates);
    })
    .catch((error) => {
        response.status(500).send(error);
    })

});

export const createWallet = functions.https.onRequest(async (request, response) => {
    //console.log(JSON.stringify(request));
    const client_wallet = request.body;

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
        //response.send(wallet);
    }
    catch (error) {
        response.status(500).send("Unable to create wallet with Wyre: " + JSON.stringify(error));
    }

    // @TODO optimize this round trip
    try {
        const set_wallet = await db.collection('wallets').doc(wallet.id).set(wallet);
        const ref_wallet = await db.collection('wallets').doc(wallet.id);
        const doc_wallet = await ref_wallet.get();
        const data_id = doc_wallet.data().id;
        response.send(data_id);   
    }
    catch (error) {
        response.status(500).send("Error saving wallet to db! Error: " + error);
    }
    
    
});

export const createPaymentMethod = functions.https.onRequest(async (request, response) => {
    const client_paymentMethod = request.body;
    //console.log(client_paymentMethod);

    // @TODO validate client_paymentMethod
    const new_paymentMethod = client_paymentMethod;

    console.log("new_paymentMethod: " + JSON.stringify(new_paymentMethod));
    let paymentMethod = <IPaymentMethod>{};
    try {
        paymentMethod = await wyre.post('/paymentMethods', new_paymentMethod);
    //console.log(paymentMethod);
    }
    catch (error) {
        response.status(500).send("Unable to create new paymentMethod. Error: " + JSON.stringify(error));
    }
    

    try {
        const set_paymentMethod = await db.collection('paymentMethods').doc(paymentMethod.id).set(paymentMethod);
        const ref_paymentMethod = await db.collection('paymentMethods').doc(paymentMethod.id);
        const doc_paymentMethod = await ref_paymentMethod.get();
        const data_id = doc_paymentMethod.data().id;
        response.status(200).send("Payment method created: "+ data_id);
    }
    catch (error) {
        response.status(500).send("Unable to save paymentMethod in db! :" + error);
    }

})

export const createTransfer = functions.https.onRequest(async (req, res) => {
    const client_transfer = req.body;
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
        res.status(200).send({ id: transfer.id, status: transfer.status } );
    }
    catch (error) {
        res.status(500).send("Unable to create transfer: " + error);
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
