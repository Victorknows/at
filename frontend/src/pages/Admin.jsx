import React, { useEffect, useState } from "react";
import axios from "axios";

const Admin = () => {
  const [users, setUsers] = useState({});
  const [appointments, setAppointments] = useState([]);
  const [emergencies, setEmergencies] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await axios.get("http://localhost:5000/admin/dashboard?adminKey=admin123");
        setUsers(res.data.users);
        setAppointments(res.data.appointments);
        setEmergencies(res.data.emergencies);
      } catch (err) {
        setError("Failed to fetch dashboard data");
        console.error(err);
      }
    };

    fetchDashboard();
  }, []);

  const sectionStyle = {
    backgroundColor: "#f9fafb",
    borderRadius: "8px",
    padding: "2rem",
    marginBottom: "2rem",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
  };

  const tableStyle = {
    width: "100%",
    borderCollapse: "collapse",
    marginTop: "1rem",
  };

  const thtdStyle = {
    border: "1px solid #ddd",
    padding: "0.75rem",
    textAlign: "left",
  };

  return (
    <div style={{ padding: "2rem", fontFamily: "'Inter', sans-serif", backgroundColor: "#f3f4f6" }}>
      <h1 style={{ fontSize: "2rem", fontWeight: "800", color: "#1e3a8a", marginBottom: "2rem" }}>MumConnect Admin Dashboard</h1>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <section style={sectionStyle}>
        <h2 style={{ fontSize: "1.5rem", color: "#1f2937" }}>👥 Users</h2>
        <table style={tableStyle}>
          <thead>
            <tr><th style={thtdStyle}>Phone</th><th style={thtdStyle}>Role</th></tr>
          </thead>
          <tbody>
            {Object.entries(users).map(([phone, { role }]) => (
              <tr key={phone}>
                <td style={thtdStyle}>{phone}</td>
                <td style={thtdStyle}>{role}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section style={sectionStyle}>
        <h2 style={{ fontSize: "1.5rem", color: "#1f2937" }}>📅 Appointments</h2>
        <table style={tableStyle}>
          <thead>
            <tr><th style={thtdStyle}>Phone</th><th style={thtdStyle}>Date</th><th style={thtdStyle}>Description</th></tr>
          </thead>
          <tbody>
            {appointments.map((appt, index) => (
              <tr key={index}>
                <td style={thtdStyle}>{appt.phone}</td>
                <td style={thtdStyle}>{appt.date}</td>
                <td style={thtdStyle}>{appt.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section style={sectionStyle}>
        <h2 style={{ fontSize: "1.5rem", color: "#1f2937" }}>🚨 Emergencies</h2>
        <table style={tableStyle}>
          <thead>
            <tr><th style={thtdStyle}>Phone</th><th style={thtdStyle}>Time</th></tr>
          </thead>
          <tbody>
            {emergencies.map((e, index) => (
              <tr key={index}>
                <td style={thtdStyle}>{e.phone}</td>
                <td style={thtdStyle}>{new Date(e.time).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
};

export default Admin;
