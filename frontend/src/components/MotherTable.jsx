import React, { useEffect, useState } from "react";
import axios from "axios";

function MotherTable() {
  const [mothers, setMothers] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/mothers").then((res) => {
      const data = res.data;
      const motherList = Object.entries(data).map(([phone, details]) => ({
        phone,
        ...details,
      }));
      setMothers(motherList);
    });
  }, []);

  return (
    <div>
      <h2>📋 Registered Mothers</h2>
      {mothers.length === 0 ? (
        <p>No mothers found.</p>
      ) : (
        <table border="1" cellPadding="10">
          <thead>
            <tr>
              <th>Phone</th>
              <th>Trimester</th>
              <th>Registered At</th>
              <th>Next Clinic Date</th>
            </tr>
          </thead>
          <tbody>
            {mothers.map((mother, index) => (
              <tr key={index}>
                <td>{mother.phone}</td>
                <td>{mother.stage}</td>
                <td>{new Date(mother.registeredAt).toLocaleDateString()}</td>
                <td>
                  {mother.clinicDate
                    ? new Date(mother.clinicDate).toLocaleDateString()
                    : "Not set"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default MotherTable;
