
const express = require('express');
const router = express.Router();
const { saveLead } = require('./lead.service');

router.post('/', async (req, res) => {
    try {
        const lead = await saveLead(req.body);
        res.json({ message: 'Lead saved', lead });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
