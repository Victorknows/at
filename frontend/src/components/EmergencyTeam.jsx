import { useEffect, useState } from "react";
import axios from "axios";

const EmergencyTeam = () => {
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/help-requests").then((res) => {
      const list = [];
      for (const phone in res.data) {
        res.data[phone].forEach((alert) => {
          list.push({ phone, time: alert.time, registered: alert.registered });
        });
      }
      setAlerts(list);
    });
  }, []);

  return (
    <div>
      <h2>Emergency Requests</h2>
      <ul>
        {alerts.map((a, i) => (
          <li key={i}>
            {a.phone} - {new Date(a.time).toLocaleString()}{" "}
            {a.registered ? "(Registered)" : "(Unregistered)"}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default EmergencyTeam;
