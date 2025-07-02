// src/pages/EmergencyTeam.jsx
import { useEffect, useState } from 'react';
import api from '../api';
import axios from "axios";


function EmergencyTeam() {
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
  axios.get("http://localhost:5000/emergencies")
    .then(res => {
      const emergencyData = res.data;

      // Convert from object to flat array with phone included
      const alertList = Object.entries(emergencyData).flatMap(([phone, alerts]) =>
        alerts.map(alert => ({ ...alert, phone }))
      );

      setAlerts(alertList); // alerts will now be an array
    });
}, []);


  return (
    <div className="container">
      <h2 className="mb-4">Emergency Alerts</h2>
      <table className="table table-bordered table-hover">
        <thead>
          <tr>
            <th>Phone</th>
            <th>Time</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {alerts.map((alert, i) => (
            <tr key={i}>
              <td>{alert.phone}</td>
              <td>{new Date(alert.time).toLocaleString()}</td>
              <td>{alert.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default EmergencyTeam;
