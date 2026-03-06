const admin = require("firebase-admin");
const db = require("./firebase");

module.exports = async function (req, res, next) {

  try {

    const apiKey = req.headers["x-api-key"];
    const { businessId } = req.body;

    const origin = req.headers.origin || req.headers.referer || "";

    if (!apiKey || !businessId) {
      return res.status(403).json({ message: "Missing credentials" });
    }

    /* ==============================
       1️⃣ API KEY VALIDATION
    ============================== */

    const keySnap = await db
      .collection("apiKeys")
      .where("apiKey", "==", apiKey)
      .where("status", "==", "active")
      .limit(1)
      .get();

    if (keySnap.empty) {
      return res.status(403).json({ message: "Invalid API Key" });
    }

    const keyData = keySnap.docs[0].data();

    if (keyData.businessId !== businessId) {
      return res.status(403).json({ message: "Business mismatch" });
    }

    /* ==============================
       2️⃣ DOMAIN VALIDATION
    ============================== */

    if (origin && keyData.domain) {

      const requestDomain = new URL(origin).hostname;

      if (!keyData.domain.includes(requestDomain)) {
        return res.status(403).json({ message: "Unauthorized domain" });
      }

    }

    /* ==============================
       3️⃣ LOAD BUSINESS
    ============================== */

    const businessRef = db.collection("businesses").doc(businessId);
    const businessSnap = await businessRef.get();

    if (!businessSnap.exists) {
      return res.status(403).json({ message: "Business not found" });
    }

    const business = businessSnap.data();

    /* ==============================
       4️⃣ PLAN EXPIRY CHECK
    ============================== */

    if (business.expiry && new Date(business.expiry) < new Date()) {

      await businessRef.update({
        isActive: false
      });

      return res.status(403).json({
        message: "Plan expired"
      });

    }

    /* ==============================
       5️⃣ MONTHLY RESET SYSTEM
    ============================== */

    const now = new Date();

    const lastReset =
      business.lastReset?.toDate?.() || new Date(0);

    if (
      now.getMonth() !== lastReset.getMonth() ||
      now.getFullYear() !== lastReset.getFullYear()
    ) {

      await businessRef.update({
        messagesUsed: 0,
        lastReset: admin.firestore.FieldValue.serverTimestamp(),
      });

      business.messagesUsed = 0;

    }

    /* ==============================
       6️⃣ PLAN LIMITS
    ============================== */

    let limit = 100;

    if (business.plan === "trial") limit = 50;
    if (business.plan === "basic") limit = 1000;
    if (business.plan === "pro") limit = 100000;

    if ((business.messagesUsed || 0) >= limit) {

      return res.status(403).json({
        message: "Monthly message limit reached"
      });

    }

    /* ==============================
       7️⃣ INCREMENT USAGE
    ============================== */

    await businessRef.update({
      messagesUsed: admin.firestore.FieldValue.increment(1),
    });

    req.business = business;

    next();

  } catch (error) {

    console.error("CheckPlan Error:", error);

    return res.status(500).json({
      message: "Server error"
    });

  }

};
