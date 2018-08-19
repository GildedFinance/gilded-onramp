import * as functions from 'firebase-functions';
import { WyreClient } from 'wyre-api'
const wyre_keys = require('../private/wyre_keys');

// Start writing Firebase Functions
// https://firebase.google.com/docs/functions/typescript

export const helloWorld = functions.https.onRequest((request, response) => {
 response.send("Welcome to Gilded OnRamp!");
});

export const wyreRates = functions.https.onRequest((request, response) => {
    wyre_keys.baseUrl = 'https://api.testwyre.com';
    const wyre = new WyreClient(wyre_keys);

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