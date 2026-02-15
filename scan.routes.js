const express = require('express');
const router = express.Router();
const { scanWebsite } = require('./scan.service');

router.post('/', async (req, res) => {
    try {
        const { url } = req.body;
        const data = await scanWebsite(url);
        res.json({ scannedData: data });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
