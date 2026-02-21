const express = require('express');
const router = express.Router();
const { getWidgetSnippet } = require('./widget.service');


// ✅ 1️⃣ Script tag src ke liye (IMPORTANT)
router.get('/', (req, res) => {
    const snippet = getWidgetSnippet();
    res.type('application/javascript');  // 🔥 very important
    res.send(snippet);                   // JSON nahi bhejna
});


// ✅ 2️⃣ Dashboard Generate Button ke liye
router.post('/generate', (req, res) => {
    const snippet = getWidgetSnippet();
    res.json({
        success: true,
        code: snippet
    });
});

module.exports = router;
