import React from "react";
import { useState } from "react";
import API from "../../api/axios";
import { useEffect } from "react";
import Navbar from "../../components/Navbar";

function DoctorProfile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchProfile = async () => {
    try {
      const res = await API.get("/doctors/profile");
      setProfile(res.data.data);
    } catch (error) {
      console.error("Error fetching doctor profile:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  if (loading) return <div className="p-6">Loading...</div>
  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 p-6">

        <div className="max-w-4xl mx-auto mb-8">
          <h1 className="text-4xl font-extrabold text-white">
            🩺 Doctor Profile
          </h1>
          <p className="text-gray-300 mt-1">
            Professional information & account overview
          </p>
        </div>
        {loading ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
          </div>
        ) : !profile ? (
          <div className="text-center text-red-500 font-semibold">
            Profile not found
          </div>
        ) : (
          <div className="max-w-4xl mx-auto bg-white/80 backdrop-blur-lg border border-gray-200 shadow-2xl rounded-3xl p-8 hover:shadow-3xl transition">

            <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b pb-6 mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">
                  {profile.user?.name}
                </h2>
                <p className="text-gray-500">{profile.user?.email}</p>
              </div>

              <span className="mt-3 md:mt-0 bg-blue-100 text-blue-700 px-4 py-1 rounded-full text-sm font-semibold">
                {profile.specialization || "General Doctor"}
              </span>
            </div>

            <div className="grid md:grid-cols-2 gap-5">

              <div className="bg-gray-50 p-4 rounded-2xl">
                <p className="text-gray-500 text-sm">Qualification</p>
                <p className="font-semibold text-gray-800">
                  {profile.qualification}
                </p>
              </div>

              <div className="bg-gray-50 p-4 rounded-2xl">
                <p className="text-gray-500 text-sm">Experience</p>
                <p className="font-semibold text-gray-800">
                  {profile.experience} Years
                </p>
              </div>

              <div className="bg-gray-50 p-4 rounded-2xl">
                <p className="text-gray-500 text-sm">Consultation Fee</p>
                <p className="font-semibold text-green-600">
                  ₹{profile.consultationFee}
                </p>
              </div>

              <div className="bg-gray-50 p-4 rounded-2xl">
                <p className="text-gray-500 text-sm">Daily Limit</p>
                <p className="font-semibold text-gray-800">
                  {profile.dailyLimit} Patients
                </p>
              </div>

              <div className="md:col-span-2 bg-gray-50 p-4 rounded-2xl">
                <p className="text-gray-500 text-sm">Hospital</p>
                <p className="font-semibold text-gray-800">
                  🏥 {profile.hospital?.name || "Not Assigned"}
                </p>
              </div>

            </div>

            <div className="mt-6 text-center">
              <span className="text-xs text-gray-400">
                Powered by Doctor Management System
              </span>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default DoctorProfile;
