
const admin = require("firebase-admin");

if (!process.env.FIREBASE_SERVICE_ACCOUNT) {
    throw new Error("FIREBASE_SERVICE_ACCOUNT missing");
}

const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);

// ✅ Prevent duplicate initialization (Universal Method)
if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert({
            ...serviceAccount,
            private_key: serviceAccount.private_key.replace(/\\n/g, '\n'),
        }),
    });
}

const db = admin.firestore();

async function saveLead(data) {
    const ref = db.collection('leads').doc();
    await ref.set(data);
    return { id: ref.id, ...data };
}

module.exports = { saveLead };
