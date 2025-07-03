import { useEffect, useState } from "react";
import axios from "axios";

const AllAppointments = () => {
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/appointments").then((res) => {
      setAppointments(res.data);
    });
  }, []);

  return (
    <div>
      <h2>All Appointments</h2>
      <ul>
        {appointments.map((a, i) => (
          <li key={i}>
            {a.phone}: {new Date(a.clinicDate).toDateString()}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AllAppointments;
