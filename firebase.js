const admin = require("firebase-admin");

if (!admin.apps.length) {

  const serviceAccount = JSON.parse(
    process.env.FIREBASE_SERVICE_ACCOUNT
  );

  admin.initializeApp({
    credential: admin.credential.cert({
      ...serviceAccount,
      private_key: serviceAccount.private_key.replace(/\\n/g, '\n'),
    }),
    databaseURL: "https://konrk-88f13.firebaseio.com"
  });

}

const db = admin.firestore();
