const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');

if (!process.env.FIREBASE_PRIVATE_KEY) {
    throw new Error("FIREBASE_PRIVATE_KEY is missing in environment variables");
}

const serviceAccount = {
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')
};

initializeApp({
    credential: cert(serviceAccount)
});

const db = getFirestore();

async function saveLead(data) {
    const ref = db.collection('leads').doc();
    await ref.set(data);
    return { id: ref.id, ...data };
}

module.exports = { saveLead };
