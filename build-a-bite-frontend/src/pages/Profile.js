import React, { useEffect, useState } from 'react';
import axiosClient from '../api/axiosClient';

function Profile() {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    axiosClient.get('/auth/me')
      .then(res => setProfile(res.data))
      .catch(() => setProfile(null));
  }, []);

  if (!profile) return <p className="p-6 font-kidsFont text-farmGreenDark">Loading...</p>;

  return (
    <div className="min-h-screen bg-softWhite p-6 font-kidsFont text-farmGreenDark">
      <h2 className="text-4xl font-extrabold mb-6">Your Profile</h2>
      <p className="mb-4"><strong>Name:</strong> {profile.name}</p>
      <p><strong>Email:</strong> {profile.email}</p>
      {/* Optionally add avatar and edit profile button in future */}
    </div>
  );
}

export default Profile;
