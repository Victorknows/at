// index.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const africastalking = require("africastalking");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Initialize Africa's Talking
const AT = africastalking({
  apiKey: process.env.AT_API_KEY,
  username: process.env.AT_USERNAME,
});
const sms = AT.SMS;

// In-memory storage
const mothers = {};
const sessions = {};
const helpRequests = {};

const trimesterTips = {
  "Trimester 1": [
    "Eat small, frequent meals to manage nausea.",
    "Take folic acid daily to help your baby’s development.",
  ],
  "Trimester 2": [
    "Stay active — gentle walks can help circulation.",
    "Include calcium-rich foods to support bone growth.",
  ],
  "Trimester 3": [
    "Get plenty of rest. Sleep on your side for better blood flow.",
    "Practice deep breathing to reduce stress.",
  ],
};

// USSD Endpoint
app.post("/ussd", (req, res) => {
  const { sessionId, phoneNumber, text } = req.body;

  let response = "";
  const inputs = text.split("*");
  const step = inputs.length;

  if (!sessions[sessionId]) {
    sessions[sessionId] = {};
  }

  if (text === "") {
    response = `CON Welcome to MumConnect\n1. Register\n2. Set Next Clinic Date\n3. Emergency Help`;
  } else if (inputs[0] === "1") {
    if (step === 1) {
      response = `CON What trimester are you in?\n1. Trimester 1\n2. Trimester 2\n3. Trimester 3`;
    } else if (step === 2) {
      const choice = inputs[1];
      let trimester = "";
      if (choice === "1") trimester = "Trimester 1";
      else if (choice === "2") trimester = "Trimester 2";
      else if (choice === "3") trimester = "Trimester 3";
      else trimester = null;

      if (!trimester) {
        response = `END Invalid trimester selection.`;
      } else {
        if (mothers[phoneNumber]) {
          response = `END You are already registered with MumConnect.`;
        } else {
          mothers[phoneNumber] = {
            stage: trimester,
            registeredAt: new Date(),
            clinicDate: null,
          };
          response = `END Registration successful! You're now subscribed to MumConnect (${trimester}).`;
        }
      }
    }
  } else if (inputs[0] === "2") {
    if (!mothers[phoneNumber]) {
      response = `END You're not registered yet. Dial again and select 1 to register.`;
    } else if (step === 1) {
      response = `CON Enter your next clinic date (e.g. 2025-07-05):`;
    } else if (step === 2) {
      const dateStr = inputs[1];
      const clinicDate = new Date(dateStr);
      if (clinicDate.toString() === "Invalid Date") {
        response = `END Invalid date format. Please try again using YYYY-MM-DD.`;
      } else {
        mothers[phoneNumber].clinicDate = clinicDate;
        response = `END Got it! We'll remind you a day before your clinic visit.`;
      }
    }
  } else if (inputs[0] === "3") {
    if (!helpRequests[phoneNumber]) helpRequests[phoneNumber] = [];

    helpRequests[phoneNumber].push({
      time: new Date(),
      registered: !!mothers[phoneNumber],
    });

    response = `END We've received your emergency request. We will contact you on your phone.`;
  } else {
    response = `END Invalid option. Please try again.`;
  }

  res.set("Content-Type", "text/plain");
  res.send(response);
});

// Send weekly tips + clinic reminders
app.get("/send-weekly-tips", async (req, res) => {
  const sent = [];

  const now = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(now.getDate() + 1);

  for (const phone in mothers) {
    const mother = mothers[phone];
    const tips = trimesterTips[mother.stage];
    if (tips && tips.length > 0) {
      const tip = tips[Math.floor(Math.random() * tips.length)];

      try {
        await sms.send({
          to: [phone],
          message: `MumConnect Tip (${mother.stage}): ${tip}`,
        });
        sent.push({ phone, message: tip });
      } catch (err) {
        console.error(`❌ Failed to send to ${phone}:`, err.message);
      }
    }

    // Clinic reminder
    if (
      mother.clinicDate &&
      mother.clinicDate.toDateString() === tomorrow.toDateString()
    ) {
      try {
        await sms.send({
          to: [phone],
          message: `Reminder: You have a clinic visit scheduled for tomorrow (${mother.clinicDate.toDateString()}).`,
        });
        sent.push({ phone, message: "Clinic reminder sent" });
      } catch (err) {
        console.error(`❌ Failed clinic reminder to ${phone}:`, err.message);
      }
    }
  }

  res.json({ success: true, sent });
});

// Admin endpoints
app.get("/mothers", (req, res) => {
  res.json(mothers);
});

app.get("/help-requests", (req, res) => {
  res.json(helpRequests);
});

app.post("/send-sms", async (req, res) => {
  const { to, message } = req.body;
  try {
    const result = await sms.send({
      to: [to],
      message,
    });
    res.json({ success: true, result });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`✅ MumConnect server running on port ${PORT}`)
);
