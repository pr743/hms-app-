import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import API from "../api/axios";
import {
  Users,
  UserCheck,
  CalendarDays,
  Stethoscope,
} from "lucide-react";

function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [aiData, setAiData] = useState(null);

  const [loading, setLoading] = useState(true);
  const [needsHospitalSetup, setNeedsHospitalSetup] = useState(false);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {

        const res = await API.get("/admin/dashboard");

        if (res.data.needsHospitalSetup) {
          setNeedsHospitalSetup(true);
          setStats(null);
          return;
        }

        setStats(res.data.data);

        try {
          const aiRes = await API.get("/admin/ai-insights");
          setAiData(aiRes.data.data);
        } catch (err) {
          console.error("AI failed:", err);
        }

      } catch (error) {
        console.error("Dashboard load failed", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);


  if (loading) {
    return (
      <>
        <Navbar />
        <div className="p-6 text-xl">Loading dashboard...</div>
      </>
    );
  }


  return (
    <>
      <Navbar />

      <div className="min-h-screen px-6 pt-24 pb-10
    bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 relative overflow-hidden">


        <div className="absolute w-[400px] h-[400px] bg-blue-500 opacity-20 blur-3xl rounded-full top-10 left-10"></div>
        <div className="absolute w-[300px] h-[300px] bg-purple-500 opacity-20 blur-3xl rounded-full bottom-10 right-10"></div>


        <div className="relative z-10 max-w-6xl mx-auto">


          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-white">
              Admin Dashboard
            </h1>
            <p className="text-gray-300 mt-1">
              Real-time hospital analytics overview
            </p>
          </div>


          {needsHospitalSetup && (
            <div className="flex items-center justify-center min-h-[60vh]">
              <div className="text-center
              bg-white/10 backdrop-blur-xl border border-white/20
              p-10 rounded-2xl shadow-2xl text-white">
                <h1 className="text-2xl font-bold">Welcome Admin 👋</h1>
                <p className="text-gray-300 mt-2">
                  Let’s set up your hospital first
                </p>

                <Link
                  to="/admin/add-hospital"
                  className="inline-block mt-6 px-6 py-3 rounded-xl
                bg-gradient-to-r from-blue-500 to-indigo-500
                hover:from-blue-600 hover:to-indigo-600
                transition font-semibold"
                >
                  Add Hospital
                </Link>
              </div>
            </div>
          )}


          {!needsHospitalSetup && stats && (

            <>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

                <StatCard
                  title="Total Doctors"
                  value={stats.totalDoctors}
                  icon={<Stethoscope size={26} />}
                  color="blue"
                />

                <StatCard
                  title="Active Doctors"
                  value={stats.activeDoctors}
                  icon={<UserCheck size={26} />}
                  color="orange"
                />

                <StatCard
                  title="Total Patients"
                  value={stats.totalPatients}
                  icon={<Users size={26} />}
                  color="green"
                />

                <StatCard
                  title="Appointments"
                  value={stats.totalAppointments}
                  icon={<CalendarDays size={26} />}
                  color="purple"
                />
              </div>


              {aiData && (
                <div className="mt-10
                bg-white/10 backdrop-blur-xl border border-white/20
                rounded-2xl p-6 text-white shadow-2xl">

                  <h2 className="text-xl font-semibold mb-4">
                    🤖 AI Insights
                  </h2>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-200 mb-4">
                    <p>Appointments: <b>{aiData.totalAppointments}</b></p>
                    <p>Doctors: <b>{aiData.totalDoctors}</b></p>
                    <p>Load: <b>{aiData.loadPerDoctor.toFixed(1)}</b></p>
                    <p>Emergency: <b>{aiData.emergencyCount}</b></p>
                  </div>

                  <div className="space-y-2">
                    {aiData.suggestions.map((s, i) => (
                      <div key={i} className="text-blue-300 text-sm">
                        • {s}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-10
              bg-white/10 backdrop-blur-xl border border-white/20
              rounded-2xl p-6 text-white shadow-xl">

                <h2 className="text-xl font-semibold mb-2">
                  System Status
                </h2>

                <p className="text-gray-300">
                  Live hospital data synced with backend in real-time.
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
function StatCard({ title, value, icon, color }) {
  const colors = {
    blue: "from-blue-500/20 to-blue-600/20 text-blue-300",
    green: "from-green-500/20 to-green-600/20 text-green-300",
    purple: "from-purple-500/20 to-purple-600/20 text-purple-300",
    orange: "from-orange-500/20 to-orange-600/20 text-orange-300",
  };

  return (
    <div className="group p-6 rounded-2xl
      bg-white/10 backdrop-blur-xl border border-white/20
      shadow-lg hover:scale-[1.03] transition duration-300">

      <div className="flex items-center justify-between">

        <div>
          <p className="text-gray-300 text-sm">{title}</p>
          <h2 className="text-3xl font-bold text-white mt-1">
            {value ?? 0}
          </h2>
        </div>

        <div className={`p-3 rounded-xl bg-gradient-to-br ${colors[color]}`}>
          {icon}
        </div>

      </div>
    </div>
  );
}

export default AdminDashboard;
