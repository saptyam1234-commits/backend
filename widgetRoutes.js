const express = require('express');
const router = express.Router();
const { getWidgetSnippet } = require('./widget.service');

// 1️⃣ Direct GET (optional)
router.get('/', (req, res) => {
    const snippet = getWidgetSnippet();
    res.json({
        success: true,
        code: snippet
    });
});

// 2️⃣ Dashboard Generate Button ke liye
router.post('/generate', (req, res) => {
    const snippet = getWidgetSnippet();
    res.json({
        success: true,
        code: snippet
    });
});

module.exports = router;
