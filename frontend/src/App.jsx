import React, { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import MotherDashboard from "./pages/MotherDashboard";
import DoctorDashboard from "./pages/DoctorDashboard";
import EmergencyDashboard from "./pages/EmergencyDashboard";
import HomePage from "./pages/HomePage";
import Admin from "./pages/Admin";

function App() {
  const [user, setUser] = useState(null);

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/admin" element={<Admin/>} />
      <Route path="/login" element={<Login setUser={setUser} />} />

      {/* Redirects based on login */}
      <Route
        path="/mother"
        element={
          user && user.role === "Mother" ? (
            <MotherDashboard user={user} />
          ) : (
            <Navigate to="/login" />
          )
        }
      />
      <Route
        path="/doctor"
        element={
          user && user.role === "Doctor" ? (
            <DoctorDashboard user={user} />
          ) : (
            <Navigate to="/login" />
          )
        }
      />
      <Route
        path="/emergency"
        element={
          user && user.role === "EmergencyTeam" ? (
            <EmergencyDashboard user={user} />
          ) : (
            <Navigate to="/login" />
          )
        }
      />
    </Routes>
  );
}

export default App;
