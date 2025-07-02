// src/components/MotherTable.jsx
function MotherTable({ mothers }) {
  return (
    <div>
      <h5>Registered Mothers</h5>
      <table className="table table-bordered table-hover">
        <thead>
          <tr>
            <th>Phone</th>
            <th>Trimester</th>
            <th>Check-ins</th>
            <th>Registered</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(mothers) && mothers.length > 0 ? (
            mothers.map((m, i) => (
              <tr key={i}>
                <td>{m.phone}</td>
                <td>{m.stage}</td>
                <td>{m.checkIns}</td>
                <td>{new Date(m.registeredAt).toLocaleDateString()}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="text-center">No mothers registered.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default MotherTable;
