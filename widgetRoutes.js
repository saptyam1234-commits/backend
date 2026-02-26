const express = require("express");
const router = express.Router();
const admin = require("./firebase");
const { getWidgetSnippet } = require("./widget.service");

/*
Generate Widget Snippet
*/

router.post("/generate", async (req,res)=>{

try{

const { apiKey, businessId, domain } = req.body;

if(!apiKey){
return res.status(400).json({
success:false,
message:"API key missing"
});
}

const db = require("./firebase");

const snippet = getWidgetSnippet(apiKey,{
businessId: businessId || ""
});

await db.collection("widgets").doc(apiKey).set({
apiKey,
businessId: businessId || "",
domain: domain || "",
snippetCode: snippet,
status:"active",
createdAt:new Date()
});

res.json({
success:true,
snippet
});

}catch(err){

console.error("Widget Generate Error:",err);

res.status(500).json({
success:false,
message:"Widget generation failed"
});

}

});

/*
Serve Widget Script
*/

router.get("/", async (req,res)=>{

try{

const apiKey = req.query.key;

if(!apiKey){
return res.status(400).send("API key missing");
}

const db = require("./firebase");

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
