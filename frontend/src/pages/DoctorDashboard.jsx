import React, { useState, useEffect } from "react";
import API from "../api";

const DoctorDashboard = ({ user }) => {
  const [appointments, setAppointments] = useState([]);
  const [chat, setChat] = useState([]);
  const [to, setTo] = useState("");
  const [text, setText] = useState("");

  useEffect(() => {
    API.get(`/appointments?phone=${user.phone}`).then((res) => setAppointments(res.data));
    API.get(`/chat?phone=${user.phone}`).then((res) => setChat(res.data));
  }, [user.phone]);

  const sendMessage = async () => {
    if (!to || !text) return;
    await API.post("/chat", {
      from: user.phone,
      to,
      text,
    });
    setText("");
    const res = await API.get(`/chat?phone=${user.phone}`);
    setChat(res.data);
  };

  const styles = {
    container: {
      fontFamily: "'Inter', sans-serif",
      padding: "2rem",
      maxWidth: "900px",
      margin: "0 auto",
    },
    heading: {
      fontSize: "2.25rem",
      fontWeight: "800",
      color: "#1d4ed8",
      marginBottom: "1.5rem",
    },
    section: {
      marginBottom: "2rem",
    },
    sectionTitle: {
      fontSize: "1.25rem",
      fontWeight: "700",
      marginBottom: "1rem",
      color: "#374151",
    },
    card: {
      backgroundColor: "#f3f4f6",
      padding: "1rem",
      borderRadius: "8px",
      marginBottom: "0.75rem",
      boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
    },
    input: {
      padding: "0.6rem 1rem",
      margin: "0.25rem 0.5rem 0.25rem 0",
      border: "1px solid #d1d5db",
      borderRadius: "6px",
      fontSize: "1rem",
      width: "calc(50% - 1rem)",
    },
    button: {
      padding: "0.6rem 1.2rem",
      backgroundColor: "#2563eb",
      color: "#fff",
      fontWeight: "600",
      border: "none",
      borderRadius: "6px",
      cursor: "pointer",
      marginTop: "0.75rem",
    },
    chatBubble: {
      backgroundColor: "#e0e7ff",
      padding: "0.6rem 1rem",
      borderRadius: "8px",
      marginBottom: "0.5rem",
    },
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Doctor Dashboard</h2>

      {/* Appointments */}
      <section style={styles.section}>
        <h4 style={styles.sectionTitle}>All Appointments</h4>
        {appointments.length === 0 ? (
          <div style={styles.card}>No appointments yet.</div>
        ) : (
          appointments.map((a, i) => (
            <div key={i} style={styles.card}>
              <strong>{a.phone}</strong> — {a.date} — {a.description || "No reason provided"}
            </div>
          ))
        )}
      </section>

      {/* Chat Input */}
      <section style={styles.section}>
        <h4 style={styles.sectionTitle}>Chat with Mother</h4>
        <input
          style={styles.input}
          type="text"
          placeholder="Mother's Phone"
          value={to}
          onChange={(e) => setTo(e.target.value)}
        />
        <input
          style={styles.input}
          type="text"
          placeholder="Message"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <div>
          <button style={styles.button} onClick={sendMessage}>Send Message</button>
        </div>
      </section>

      {/* Chat History */}
      <section style={styles.section}>
        <h4 style={styles.sectionTitle}>Chat History</h4>
        {chat.length === 0 ? (
          <div style={styles.card}>No messages yet.</div>
        ) : (
          chat.map((m, i) => (
            <div key={i} style={styles.chatBubble}>
              <strong>{m.from}</strong>: {m.text}
            </div>
          ))
        )}
      </section>
    </div>
  );
};

export default DoctorDashboard;
