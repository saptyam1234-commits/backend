
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const checkPlan = require('./checkPlan');
const chatRoutes = require('./chatRoutes');
const leadRoutes = require('./leadRoutes');
const scanRoutes = require('./scanRoutes');
const widgetRoutes = require('./widgetRoutes');

const app = express();
app.use(cors());
app.use(express.json());


// Routes
app.use('/api/chat', checkPlan, chatRoutes);
app.use('/api/leads', leadRoutes);
app.use('/api/scan', scanRoutes);
app.use('/api/widget', widgetRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
