const express = require("express");
const router = express.Router();
const db = require("../config/firebase");
const { generateAIResponse } = require("../services/openai.service");
const { buildPrompt } = require("../services/prompt.service");

router.post("/", async (req, res) => {
  try {
    const { uid, message } = req.body;

    const businessSnap = await db.collection("businessInfo").doc(uid).get();
    const businessData = businessSnap.data();

    const finalPrompt = buildPrompt(message, businessData);
    const aiReply = await generateAIResponse(finalPrompt);

    res.json({ reply: aiReply });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "AI Error" });
  }
});

module.exports = router;
