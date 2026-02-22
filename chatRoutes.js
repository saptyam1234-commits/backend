const express = require("express");
const router = express.Router();
const { getChatResponse } = require("./openAI.service");

router.post("/", async (req, res) => {

    try {

        const { message } = req.body;

        // ✅ Check message
        if (!message || message.trim() === "") {
            return res.status(400).json({
                reply: "Message is required."
            });
        }

        console.log("📩 Incoming Message:", message);

        const aiReply = await getChatResponse(message);

        console.log("🤖 AI Reply:", aiReply);

        return res.status(200).json({
            reply: aiReply
        });

    } catch (error) {

        console.error("🔥 Chat Route Error:", error);

        return res.status(500).json({
            reply: "Server error occurred."
        });
    }
});

module.exports = router;
