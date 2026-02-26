const express = require("express");
const router = express.Router();
const admin = require("firebase-admin");
const { getWidgetSnippet } = require("./widget.service");

/*
====================================
Generate Widget Snippet (Dashboard Button)
====================================
*/

router.post("/generate", async (req,res)=>{

try{

const { apiKey, businessId, domain } = req.body;

if(!apiKey){
return res.status(400).json({message:"API key missing"});
}

/* Check Website Exists */

const db = admin.firestore();

const snap = await db.collection("websites")
.where("apiKey","==",apiKey)
.limit(1)
.get();

if(snap.empty){
return res.status(403).json({message:"Invalid API key"});
}

const websiteData = snap.docs[0].data();

/* Create Snippet */

const snippet = getWidgetSnippet(apiKey, websiteData);

/* Save Snippet in Firebase */

await db.collection("widgets").doc(apiKey).set({
businessId,
apiKey,
domain,
snippetCode: snippet,
status:"active",
createdAt:new Date()
});

/* Return snippet */

res.json({
success:true,
snippet
});

}catch(err){
console.error(err);
res.status(500).json({
success:false,
message:err.message
});
}

});

/*
====================================
Serve Widget Script (Website Side)
====================================
*/

router.get("/", async (req,res)=>{

try{

const apiKey = req.query.key;

if(!apiKey){
return res.status(400).send("API key missing");
}

const db = admin.firestore();

const snap = await db.collection("widgets")
.doc(apiKey)
.get();

if(!snap.exists){
return res.status(403).send("Invalid API key");
}

const widgetData = snap.data();

res.setHeader("Content-Type","application/javascript");

res.send(widgetData.snippetCode);

}catch(err){
console.error(err);
res.status(500).send("Widget error");
}

});

module.exports = router;
