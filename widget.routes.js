const express = require('express');
const router = express.Router();
const { getWidgetSnippet } = require('./widget.service');

router.get('/', (req, res) => {
    const snippet = getWidgetSnippet();
    res.send(snippet);
});

module.exports = router;
