
const { getWidgetSnippet } = require("./widget.service");
const admin = require("firebase-admin");

router.get("/", async (req,res)=>{

const apiKey = req.query.key;

if(!apiKey){
return res.status(400).send("API key missing");
}

const db = admin.firestore();

const snap = await db
.collection("websites")
.where("apiKey","==",apiKey)
.limit(1)
.get();

if(snap.empty){
return res.status(403).send("Invalid API key");
}

const websiteData = snap.docs[0].data();

res.setHeader("Content-Type","application/javascript");

res.send(
getWidgetSnippet(apiKey, websiteData)
);

});
