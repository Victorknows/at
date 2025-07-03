import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";

const Login = ({ setUser }) => {
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState("Mother"); // Default role
  const [message, setMessage] = useState(""); // For displaying messages

  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await API.post("/login", { phone, role });
      if (res.data.success) {
        setUser({ phone, role: res.data.role }); // Use the role returned by the backend
        setMessage(`Logged in as ${res.data.role}`);

        // Redirect based on the logged-in user's role
        switch (res.data.role) {
          case "Mother":
            navigate("/mother");
            break;
          case "Doctor":
            navigate("/doctor");
            break;
          case "EmergencyTeam": // Ensure this matches the backend's expected role
            navigate("/emergency");
            break;
          default:
            navigate("/"); // Fallback for unknown roles
            break;
        }
      } else {
        setMessage(`Login failed: ${res.data.message}`);
      }
    } catch (error) {
      console.error("Login error:", error);
      if (error.response && error.response.data && error.response.data.message) {
        setMessage(`Login failed: ${error.response.data.message}`);
      } else {
        setMessage("Login failed. Please check your connection and try again.");
      }
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto bg-white rounded-lg shadow-md mt-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Login to MumConnect</h2>

      {message && (
        <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded relative mb-4" role="alert">
          <span className="block sm:inline">{message}</span>
          <span className="absolute top-0 bottom-0 right-0 px-4 py-3 cursor-pointer" onClick={() => setMessage("")}>
            <svg className="fill-current h-6 w-6 text-blue-500" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><title>Close</title><path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.103l-2.651 3.746a1.2 1.2 0 0 1-1.697-1.697l3.746-2.651-3.746-2.651a1.2 1.2 0 0 1 1.697-1.697L10 8.897l2.651-3.746a1.2 1.2 0 0 1 1.697 1.697L11.103 10l3.746 2.651a1.2 1.2 0 0 1 0 1.698z"/></svg>
          </span>
        </div>
      )}

      <div className="flex flex-col space-y-4">
        <input
          type="text"
          placeholder="Phone Number (e.g., 34)"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="Mother">Mother</option>
          <option value="Doctor">Doctor</option>
          <option value="EmergencyTeam">Emergency Team</option> {/* Changed value from "Emergency" to "EmergencyTeam" */}
        </select>
        <button
          onClick={handleLogin}
          className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition duration-200 ease-in-out shadow-md"
        >
          Login
        </button>
      </div>
    </div>
  );
};

export default Login;
