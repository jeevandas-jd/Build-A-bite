import React, { useEffect, useState } from "react";
import axiosClient from "../api/axiosClient";
import { Loader2, User } from "lucide-react";

function Profile() {
  const [player, setPlayer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axiosClient.get("/auth/me");
        setPlayer(res.data);
      } catch (err) {
        setError("Failed to load profile.");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="animate-spin w-8 h-8 text-farmGreenDark" />
      </div>
    );
  }

  if (error) {
    return <div className="text-red-600 text-center">{error}</div>;
  }

  return (
    <div className="min-h-screen flex justify-center items-start bg-gradient-to-b from-softWhite to-green-50 p-6">
      <div className="w-full max-w-md bg-white border-4 border-green-500 rounded-3xl shadow-xl p-8 relative">
        {/* Green top frame accent */}
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-green-600 text-white px-4 py-1 rounded-full shadow-md">
          🌿 Player Profile
        </div>

        <div className="flex flex-col items-center mt-4">
          {player?.avatar ? (
            <img
              src={player.avatar}
              alt="avatar"
              className="w-28 h-28 rounded-full border-4 border-green-400 shadow-lg mb-3 object-cover"
            />
          ) : (
            <div className="w-28 h-28 flex items-center justify-center rounded-full border-4 border-green-300 bg-green-50 text-green-600 mb-3">
              <User className="w-16 h-16" />
            </div>
          )}

          <h2 className="text-2xl font-bold text-green-700">{player?.name}</h2>
          <p className="text-gray-600">{player?.email}</p>

          <div className="mt-6 w-full bg-green-50 rounded-xl p-4 shadow-inner">
            <p className="mb-2">
              
            </p>
            <p>
              <strong className="text-green-700">Joined:</strong>{" "}
              {new Date(player?.createdAt).toLocaleDateString()}
            </p>
          </div>

          <button className="mt-6 px-5 py-2 rounded-xl bg-green-600 text-white font-semibold shadow-md hover:bg-green-700 hover:shadow-lg transition">
            ✏️ Edit Profile
          </button>
        </div>
      </div>
    </div>
  );
}

export default Profile;
