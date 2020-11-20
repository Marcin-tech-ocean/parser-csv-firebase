
const firebase = require("firebase-admin");
const serviceAccount = require('./serviceAccountKey.json');

firebase.initializeApp({
  credential: firebase.credential.cert(serviceAccount)
})

const db = firebase.firestore();

const csv = require('csv-parser');
const fs = require('fs');

let mainBatch = db.batch();
const estatesColl = db.collection('estates');
i = 0;
fs.createReadStream('nieruchomosci.csv')
  .pipe(csv())
  .on('data', (row) => {
    i++;
    if (i % 500 === 0) {
      mainBatch.commit();
      mainBatch = db.batch();
    }
    mainBatch.set(estatesColl.doc(), row);
  })
  .on('end', () => {
    // batch.commit();
    console.log('CSV file successfully processed');
  });