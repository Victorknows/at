import React, { useState, useEffect } from "react";
import API from "../api";

const MotherDashboard = ({ user }) => {
  const [appointments, setAppointments] = useState([]);
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");
  const [message, setMessage] = useState("");

  const loadAppointments = async () => {
    try {
      const res = await API.get(`/appointments?phone=${user.phone}`);
      setAppointments(res.data);
    } catch (error) {
      console.error("Error loading appointments:", error);
      setMessage("Failed to load appointments.");
    }
  };

  const createAppointment = async () => {
    try {
      await API.post("/appointments", {
        phone: user.phone,
        date,
        description,
      });
      setMessage("Appointment saved successfully!");
      setDate("");
      setDescription("");
      loadAppointments();
    } catch (error) {
      console.error("Error creating appointment:", error);
      setMessage("Failed to save appointment.");
    }
  };

  const sendEmergency = async () => {
    try {
      await API.post("/emergency", { phone: user.phone });
      setMessage("Emergency alert sent!");
    } catch (error) {
      console.error("Error sending emergency:", error);
      setMessage("Failed to send emergency alert.");
    }
  };

  useEffect(() => {
    if (user && user.phone) {
      loadAppointments();
    }
  }, [user]);

  return (
    <div>
      {/* Fixed Navbar */}
      <nav className="fixed top-0 left-0 w-full bg-blue-800 text-white px-6 py-4 shadow-md flex justify-between items-center z-50">
        <h1 className="text-2xl font-bold">MumConnect</h1>
        <div className="flex items-center space-x-6">
          <span className="text-sm">
            Logged in as: <strong>{user.phone}</strong>
          </span>
          <button
            onClick={() => window.location.reload()}
            className="bg-red-500 px-4 py-1 rounded hover:bg-red-600 text-sm"
          >
            Logout
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <div className="pt-24 p-4 max-w-2xl mx-auto bg-white rounded-lg shadow-md mt-4">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          Mother Dashboard
        </h2>

        {message && (
          <div
            className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded relative mb-4"
            role="alert"
          >
            <span className="block sm:inline">{message}</span>
          </div>
        )}

        <div className="mb-8 p-4 border rounded-lg shadow-sm bg-gray-50">
          <h4 className="text-xl font-semibold text-gray-700 mb-4">
            Set Appointment
          </h4>
          <div className="flex flex-col space-y-3">
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              placeholder="Reason for appointment"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={createAppointment}
              className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-200 ease-in-out shadow-md"
            >
              Save Appointment
            </button>
          </div>
        </div>

        <div className="mb-8 p-4 border rounded-lg shadow-sm bg-red-50">
          <h4 className="text-xl font-semibold text-gray-700 mb-4">
            Emergency Action
          </h4>
          <button
            onClick={sendEmergency}
            className="bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition duration-200 ease-in-out shadow-md w-full"
          >
            Send Emergency Alert
          </button>
        </div>

        <div className="p-4 border rounded-lg shadow-sm bg-gray-50">
          <h4 className="text-xl font-semibold text-gray-700 mb-4">
            Your Appointments
          </h4>
          {appointments.length === 0 ? (
            <p className="text-gray-600">No appointments scheduled yet.</p>
          ) : (
            <ul className="list-disc list-inside space-y-2">
              {appointments.map((a, i) => (
                <li key={i} className="text-gray-700">
                  <span className="font-medium">{a.date}</span> - {a.description}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default MotherDashboard;
