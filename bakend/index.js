require("dotenv").config();
const express = require("express");
const cors = require("cors");

const AfricasTalking = require("africastalking")({
  apiKey: process.env.AT_API_KEY || 'atsk_e3aa4375aedba35a31d26631cc22b5e87aed5a6c05e296e9f5cb69102096009998802c0d',
  username: process.env.AT_USERNAME || 'muhoro'
});
const sms = AfricasTalking.SMS;

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

const DOCTOR_PASSWORD = "1234";
const users = {};
const mothers = {};
const emergencies = [];
const messages = [];

// AUTH
app.post("/login", (req, res) => {
  const { phone, role } = req.body;
  if (!phone || !role) return res.status(400).json({ message: "Phone and role required" });
  users[phone] = { role };
  if (role === "Mother" && !mothers[phone]) mothers[phone] = { appointments: [] };
  return res.json({ success: true, message: "Login successful" });
});

// APPOINTMENTS
app.post("/appointments", (req, res) => {
  const { phone, date, description } = req.body;

  if (!users[phone] || users[phone].role !== "Mother") {
    return res.status(403).json({ message: "Only mothers can set appointments" });
  }

  const apptDate = new Date(date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (isNaN(apptDate.getTime()) || apptDate < today) {
    return res.status(400).json({ message: "Cannot set appointment in the past" });
  }

  mothers[phone].appointments.push({ date, description, notified: false });
  return res.json({ success: true, message: "Appointment saved" });
});

app.get("/appointments", (req, res) => {
  const { phone } = req.query;
  if (!users[phone]) return res.status(403).json({ message: "Unauthorized" });

  const role = users[phone].role;
  if (role === "Doctor") {
    const all = Object.entries(mothers).flatMap(([p, data]) =>
      data.appointments.map(a => ({ phone: p, ...a }))
    );
    return res.json(all);
  } else if (role === "Mother") {
    return res.json(mothers[phone].appointments || []);
  } else {
    return res.status(403).json({ message: "Unauthorized" });
  }
});

// EMERGENCIES
app.post("/emergency", (req, res) => {
  const { phone } = req.body;
  if (!phone) return res.status(400).json({ message: "Phone required" });

  emergencies.push({ phone, time: new Date().toISOString() });
  return res.json({ success: true, message: "Emergency logged" });
});

app.get("/emergency", (req, res) => {
  const { phone } = req.query;
  if (!users[phone] || users[phone].role !== "EmergencyTeam") {
    return res.status(403).json({ message: "Unauthorized" });
  }
  return res.json(emergencies);
});

// CHAT
app.post("/chat", (req, res) => {
  const { from, to, text } = req.body;
  if (!users[from] || !users[to]) return res.status(400).json({ message: "Invalid sender or recipient." });

  const fromRole = users[from].role, toRole = users[to].role;
  if (!((fromRole === "Doctor" && toRole === "Mother") || (fromRole === "Mother" && toRole === "Doctor"))) {
    return res.status(403).json({ message: "Chat only allowed between doctor and mother." });
  }

  messages.push({ from, to, text, time: new Date().toISOString() });
  res.json({ success: true, message: "Message sent." });
});

app.get("/chat", (req, res) => {
  const { phone } = req.query;
  if (!users[phone] || !["Doctor", "Mother"].includes(users[phone].role)) {
    return res.status(403).json({ message: "Unauthorized" });
  }

  const chat = messages.filter(m => m.from === phone || m.to === phone);
  res.json(chat);
});

// USSD
app.post("/ussd", (req, res) => {
  const { phoneNumber, text } = req.body;
  const input = text.split("*");
  let response = "";

  if (text === "") {
    response = `CON Welcome to MumConnect!
1. I am a Mother
2. I am a Doctor`;
  } else if (text === "1") {
    response = `CON What would you like to do?
1. Set Appointment
2. Emergency Alert`;
  } else if (text === "1*1") {
    response = "CON Enter appointment date (YYYY-MM-DD):";
  } else if (input.length === 3 && input[0] === "1" && input[1] === "1") {
    const date = input[2];
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const apptDate = new Date(date);

    if (isNaN(apptDate.getTime())) {
      response = "END Invalid date format.";
    } else if (apptDate < today) {
      response = "END You cannot set an appointment in the past.";
    } else {
      if (!mothers[phoneNumber]) mothers[phoneNumber] = { appointments: [] };
      mothers[phoneNumber].appointments.push({ date, description: "From USSD", notified: false });
      response = "END Appointment saved.";
    }
  } else if (text === "1*2") {
    emergencies.push({ phone: phoneNumber, time: new Date().toISOString() });
    response = "END Emergency alert sent.";
  } else if (text === "2") {
    response = "CON Enter doctor password:";
  } else if (input[0] === "2" && input.length === 2) {
    response = input[1] === DOCTOR_PASSWORD
      ? "CON Enter patient phone number to view appointments:"
      : "END Invalid password.";
  } else if (input[0] === "2" && input.length === 3) {
    const password = input[1];
    const patientPhone = input[2];
    if (password !== DOCTOR_PASSWORD) {
      response = "END Invalid password.";
    } else {
      const appts = mothers[patientPhone]?.appointments || [];
      if (appts.length === 0) {
        response = "END No appointments found.";
      } else {
        const list = appts.map((a, i) => `${i + 1}. ${a.date} - ${a.description}`).join("\n");
        response = `END Appointments:\n${list}`;
      }
    }
  } else {
    response = "END Invalid input.";
  }

  res.set("Content-Type", "text/plain");
  res.send(response);
});

// ADMIN DASHBOARD ROUTE
app.get("/admin/dashboard", (req, res) => {
  const { adminKey } = req.query;

  if (adminKey !== "admin123") {
    return res.status(403).json({ message: "Unauthorized" });
  }

  const allUsers = users;
  const allAppointments = Object.entries(mothers).flatMap(([phone, data]) =>
    data.appointments.map(a => ({ phone, ...a }))
  );
  const allEmergencies = emergencies;

  res.json({
    users: allUsers,
    appointments: allAppointments,
    emergencies: allEmergencies,
  });
});

// APPOINTMENT REMINDER JOB
setInterval(async () => {
  const todayStr = new Date().toISOString().split("T")[0];

  for (const phone in mothers) {
    const reminders = mothers[phone].appointments.filter(a => a.date === todayStr && !a.notified);
    if (reminders.length > 0) {
      try {
        await sms.send({
          to: [phone],
          message: `Reminder: You have ${reminders.length} appointment(s) scheduled today.`,
        });
        reminders.forEach(a => a.notified = true);
        console.log(`📨 Sent SMS reminder to ${phone}`);
      } catch (error) {
        console.error(`❌ Failed to send SMS to ${phone}:`, error.message);
      }
    }
  }
}, 60 * 1000); // check every 60 seconds

// SERVER
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ MumConnect backend running on http://localhost:${PORT}`);
});
