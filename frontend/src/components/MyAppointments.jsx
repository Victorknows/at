import { useEffect, useState } from "react";
import axios from "axios";

const MyAppointments = ({ phoneNumber }) => {
  const [appointment, setAppointment] = useState(null);

  useEffect(() => {
    axios.get("http://localhost:5000/mothers").then((res) => {
      const mother = res.data[phoneNumber];
      if (mother?.clinicDate) {
        setAppointment(mother.clinicDate);
      }
    });
  }, [phoneNumber]);

  return (
    <div>
      <h2>My Appointment</h2>
      {appointment ? (
        <p>Your next clinic is on: {new Date(appointment).toDateString()}</p>
      ) : (
        <p>You haven't set a clinic appointment.</p>
      )}
    </div>
  );
};

export default MyAppointments;
