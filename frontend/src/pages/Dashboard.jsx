// src/pages/Dashboard.jsx
import { useEffect, useState } from 'react';
import api from '../api';
import MotherTable from '../components/MotherTable';

function Dashboard() {
  const [mothers, setMothers] = useState([]);

  useEffect(() => {
  api.get('/mothers')
    .then(res => {
      const data = res.data;

      // Convert to array of { phone, ...motherData }
      const formatted = Object.entries(data).map(([phone, info]) => ({
        phone,
        ...info,
      }));

      setMothers(formatted);
    })
    .catch(err => {
      console.error("Error fetching mothers:", err);
      setMothers([]);
    });
}, []);


  return (
    <div className="container">
      <h2 className="mb-4">Dashboard</h2>
      <div className="row mb-4">
        <div className="col">
          <div className="card text-white bg-success mb-3">
            <div className="card-body">
              <h5 className="card-title">Total Mothers</h5>
              <p className="card-text fs-4">{mothers.length}</p>
            </div>
          </div>
        </div>
        {/* Add more cards if needed */}
      </div>

      <MotherTable mothers={mothers} />
    </div>
  );
}

export default Dashboard;
