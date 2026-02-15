const express = require('express');
const router = express.Router();
const { getChatResponse } = require('./openAI.service');

router.post('/', async (req, res) => {
    const { message } = req.body;
    try {
        const response = await getChatResponse(message);
        res.json({ reply: response });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
