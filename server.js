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
app.use(express.json());
// ==============================
// 🔥 REAL WEBHOOK 
// ==============================
app.post(
  "/stripe-webhook",
  express.raw({ type: "application/json" }),
  async (req, res) => {

    const sig = req.headers["stripe-signature"];
    let event;

    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET
      );
    } catch (err) {
      console.error("Stripe signature error:", err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    try {

      if (event.type === "invoice.payment_succeeded") {

        const invoice = event.data.object;

        const businessId = invoice.metadata?.businessId;

        if (!businessId) {
          console.log("No businessId in metadata");
          return res.json({ received: true });
        }

        const priceId = invoice.lines.data[0].price.id;

        let plan = "basic";

        if (priceId === process.env.STRIPE_PRO_PRICE) {
          plan = "pro";
        }

        const expiry = invoice.lines.data[0].period.end * 1000;

        await db.collection("businesses")
          .doc(businessId)
          .update({
            plan: plan,
            expiry: new Date(expiry),
            isActive: true
          });

        console.log("Plan activated:", businessId, plan);
      }

      if (event.type === "customer.subscription.deleted") {

        const subscription = event.data.object;

        const businessId = subscription.metadata?.businessId;

        if (!businessId) {
          return res.json({ received: true });
        }

        await db.collection("businesses")
          .doc(businessId)
          .update({
            plan: "free",
            isActive: false
          });

        console.log("Subscription cancelled:", businessId);
      }

      res.json({ received: true });

    } catch (err) {
      console.error("Webhook processing error:", err);
      res.status(500).json({ error: "Webhook failed" });
    }
  }
);
// REAL route
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
