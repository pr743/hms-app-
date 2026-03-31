import React, { useEffect, useState } from "react";
import API from "../api/axios";
import Navbar from "../components/Navbar";
import {
  CalendarCheck,
  CalendarClock,
  CheckCircle,
  FileText,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";

function PatientDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);


  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await API.get("/patient/dashboard");
        setStats(res.data.data);
      } catch (err) {

        const message = err.response?.data?.message;


        if (message === "Patient profile not found") {
          navigate("/patient/create-profile", {
            replace: true,
            state: {
              info: "Please complete your profile to access the dashboard",
            },
          });
        } else {
          console.error("Dashboard error:", err);
        }


        console.error(err.response?.data || err.message);

        console.error("Patient dashboard load failed");
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



  if (!stats) {
    return (
      <>
        <Navbar />
        <div className="p-6 text-xl text-red-500">
          Failed to load patient dashboard data
        </div>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>Patient Dashboard | HMS - Health & Appointments Tracker</title>

        <meta
          name="description"
          content="Manage your appointments, track health records, prescriptions and monitor your healthcare journey with HMS Patient Dashboard."
        />

        <meta
          name="keywords"
          content="patient dashboard, hospital management system, appointments tracking, health records, prescriptions, HMS India"
        />

        <meta name="author" content="HMS App" />
        <meta name="robots" content="index, follow" />


        <meta property="og:title" content="Patient Dashboard | HMS" />
        <meta
          property="og:description"
          content="Track your health, appointments and medical records easily."
        />
        <meta property="og:type" content="website" />
      </Helmet>

      <Navbar />

      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">
            💰 Patient Smart Health Wallet
          </h1>
          <p className="text-gray-400 mt-1">
            Track your health activity, appointments & care value
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

          <StatCard
            title="Total Appointments"
            value={stats.totalAppointments}
            icon={<CalendarCheck size={26} />}
            color="blue"
          />

          <StatCard
            title="Upcoming Care"
            value={stats.upcomingAppointments}
            icon={<CalendarClock size={26} />}
            color="orange"
          />

          <StatCard
            title="Completed Visits"
            value={stats.completedAppointments}
            icon={<CheckCircle size={26} />}
            color="green"
          />

          <StatCard
            title="Health Records"
            value={stats.totalPrescriptions}
            icon={<FileText size={26} />}
            color="purple"
          />
        </div>

        <div className="mt-8 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 text-white shadow-2xl">

          <h2 className="text-xl font-semibold">
            💡 Health Value Insight
          </h2>

          <p className="text-gray-300 mt-1">
            Your health activity score reflects engagement with care system & hospital services.
          </p>

          <div className="mt-5 grid grid-cols-1 md:grid-cols-3 gap-4">

            <div className="bg-white/10 p-4 rounded-xl">
              <p className="text-gray-400 text-sm">Health Score</p>
              <h3 className="text-2xl font-bold text-green-400">Good</h3>
            </div>

            <div className="bg-white/10 p-4 rounded-xl">
              <p className="text-gray-400 text-sm">Care Activity</p>
              <h3 className="text-2xl font-bold text-blue-400">Active</h3>
            </div>

            <div className="bg-white/10 p-4 rounded-xl">
              <p className="text-gray-400 text-sm">System Status</p>
              <h3 className="text-2xl font-bold text-purple-400">Healthy</h3>
            </div>

          </div>

        </div>

      </div>
    </>
  );

}


function StatCard({ title, value, icon, color }) {
  const colors = {
    blue: "from-blue-500/20 to-blue-700/10 text-blue-300",
    green: "from-green-500/20 to-green-700/10 text-green-300",
    purple: "from-purple-500/20 to-purple-700/10 text-purple-300",
    orange: "from-orange-500/20 to-orange-700/10 text-orange-300",
  };

  return (
    <>

      <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-6 rounded-2xl shadow-xl hover:scale-[1.03] transition-all duration-300">

        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-300 text-sm">{title}</p>
            <h2 className="text-3xl font-bold text-white mt-1">
              {value}
            </h2>
          </div>

          <div className={`p-3 rounded-xl bg-gradient-to-br ${colors[color]}`}>
            {icon}
          </div>
        </div>

      </div>
    </>
  );
}

export default PatientDashboard;
