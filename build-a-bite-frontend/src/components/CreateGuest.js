import React, { useState } from "react";
import axiosClient from "../api/axiosClient";
import { useNavigate } from "react-router-dom";

const CreateGuest = () => {
  const [displayName, setDisplayName] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleCreateGuest = async () => {
    if (!displayName.trim()) {
      alert("Please enter a display name");
      return;
    }

    setLoading(true);
    try {
      const res = await axiosClient.post("auth/guest", { displayName });

      // Save guest token just like login
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.guest));

      // Redirect guest to dashboard
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      alert("Failed to create guest user");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md text-center">
        <h1 className="text-2xl font-bold mb-4">Create Guest User</h1>

        {/* Input for display name */}
        <input
          type="text"
          placeholder="Enter guest display name"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          className="w-full mb-4 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />

        <button
          onClick={handleCreateGuest}
          disabled={loading}
          className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-bold py-2 px-4 rounded-xl hover:scale-105 transition-all duration-300"
        >
          {loading ? "Creating..." : "Generate Guest Session"}
        </button>
      </div>
    </div>
  );
};

export default CreateGuest;
