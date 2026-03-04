require('dotenv').config();

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
require("./firebase"); 
const express = require('express');
const cors = require('cors');

const chatRoutes = require('./chatRoutes');
const leadRoutes = require('./leadRoutes');
const scanRoutes = require('./scanRoutes');
const widgetRoutes = require('./widgetRoutes');

const app = express();

app.use(cors());
app.post("/stripe-webhook-test", async (req, res) => {

  console.log("🔥 Test Webhook Hit");

  try {

    const { businessId, eventType } = req.body;

    if (!businessId || !eventType) {
      return res.status(400).json({
        message: "businessId and eventType required"
      });
    }

    const db = require("firebase-admin").firestore();

    if (eventType === "payment_success") {

      await db.collection("businesses")
        .doc(businessId)
        .update({
          plan: "pro",
          expiry: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          status: "active"
        });

      console.log("✅ Plan upgraded (TEST)");

    }

    if (eventType === "subscription_cancel") {

      await db.collection("businesses")
        .doc(businessId)
        .update({
          plan: "free",
          status: "cancelled"
        });

      console.log("⚠ Plan downgraded (TEST)");
    }

    res.json({ success: true });

  } catch (err) {
    console.error("Webhook Test Error:", err);
    res.status(500).json({ error: "Test webhook failed" });
  }

});

app.use(express.json());

// Test route
app.get('/', (req, res) => {
  res.send("API Running 🚀");
});

// Routes
app.use('/api/chat', chatRoutes);
app.use('/api/leads', leadRoutes);
app.use('/api/scan', scanRoutes);
app.use('/api/widget', widgetRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
