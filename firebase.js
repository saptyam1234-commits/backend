  const admin = require("firebase-admin");

if (!admin.apps.length) {

  if (!process.env.FIREBASE_SERVICE_ACCOUNT) {
    throw new Error("FIREBASE_SERVICE_ACCOUNT is missing");
  }

  const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);

  if (!serviceAccount.private_key) {
    throw new Error("Private key is missing in service account");
  }

  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: serviceAccount.project_id,
      clientEmail: serviceAccount.client_email,
      privateKey: serviceAccount.private_key.replace(/\\n/g, '\n'),
    }),
    databaseURL: "https://konrk-88f13.firebaseio.com"
  });

}

const db = admin.firestore();
