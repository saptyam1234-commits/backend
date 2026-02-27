const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');

if (!process.env.FIREBASE_SERVICE_ACCOUNT) {
    throw new Error("FIREBASE_SERVICE_ACCOUNT missing");
}

const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);

initializeApp({
    credential: cert({
        ...serviceAccount,
        private_key: serviceAccount.private_key.replace(/\\n/g, '\n'),
    }),
});

const db = getFirestore();

async function saveLead(data) {
    const ref = db.collection('leads').doc();
    await ref.set(data);
    return { id: ref.id, ...data };
}

module.exports = { saveLead };

