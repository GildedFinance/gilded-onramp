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

