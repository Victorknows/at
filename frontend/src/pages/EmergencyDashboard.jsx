import React, { useEffect, useState } from "react";
import API from "../api";

const EmergencyDashboard = ({ user }) => {
  const [alerts, setAlerts] = useState([]);
  const [message, setMessage] = useState(""); // For custom alerts

  useEffect(() => {
    const loadAlerts = async () => {
      try {
        // Corrected endpoint from "/emergencies" to "/emergency"
        const res = await API.get(`/emergency?phone=${user.phone}`);
        setAlerts(res.data);
      } catch (error) {
        console.error("Error loading emergency alerts:", error);
        setMessage("Failed to load emergency alerts.");
      }
    };

    if (user && user.phone) {
      loadAlerts();
    }
  }, [user.phone]); // Re-run when user.phone changes

  return (
    <div className="p-4 max-w-2xl mx-auto bg-white rounded-lg shadow-md mt-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Emergency Team Dashboard</h2>

      {message && (
        <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded relative mb-4" role="alert">
          <span className="block sm:inline">{message}</span>
          <span className="absolute top-0 bottom-0 right-0 px-4 py-3" onClick={() => setMessage("")}>
            <svg className="fill-current h-6 w-6 text-blue-500" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><title>Close</title><path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.103l-2.651 3.746a1.2 1.2 0 0 1-1.697-1.697l3.746-2.651-3.746-2.651a1.2 1.2 0 0 1 1.697-1.697L10 8.897l2.651-3.746a1.2 1.2 0 0 1 1.697 1.697L11.103 10l3.746 2.651a1.2 1.2 0 0 1 0 1.698z"/></svg>
          </span>
        </div>
      )}

      <div className="p-4 border rounded-lg shadow-sm bg-gray-50">
        <h4 className="text-xl font-semibold text-gray-700 mb-4">Current Emergency Alerts</h4>
        {alerts.length === 0 ? (
          <p className="text-gray-600">No emergency alerts at this time.</p>
        ) : (
          <ul className="list-disc list-inside space-y-2">
            {alerts.map((e, i) => (
              <li key={i} className="text-gray-700">
                <span className="font-medium">Phone: {e.phone}</span> - Time: {new Date(e.time).toLocaleString()}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default EmergencyDashboard;
