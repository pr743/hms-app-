import React, { useEffect, useState } from "react";
import API from "../api/axios";
import Navbar from "../components/Navbar";
import { Helmet } from "react-helmet-async";
import {
  CalendarDays,
  ClipboardList,
  CheckCircle,
  Users,
} from "lucide-react";

function DoctorDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await API.get("/doctors/dashboard");
        setStats(res.data.data);
      } catch {
        console.error("Doctor dashboard load failed");
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
          Failed to load doctor dashboard data
        </div>
      </>
    );
  }


  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 p-6">

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">
            💰 Doctor Earnings Dashboard
          </h1>
          <p className="text-gray-400 mt-1">
            Track appointments, performance & revenue insights
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

          <StatCard
            title="Today's Appointments"
            value={stats.todayAppointment}
            icon={<CalendarDays size={26} />}
            color="blue"
          />

          <StatCard
            title="Pending Work"
            value={stats.pendingAppointment}
            icon={<ClipboardList size={26} />}
            color="orange"
          />

          <StatCard
            title="Completed"
            value={stats.completedAppointment}
            icon={<CheckCircle size={26} />}
            color="green"
          />

          <StatCard
            title="Total Patients"
            value={stats.totalPatients}
            icon={<Users size={26} />}
            color="purple"
          />
        </div>

        <div className="mt-8 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 text-white shadow-2xl">
          <h2 className="text-xl font-semibold">💸 Performance Insight</h2>
          <p className="text-gray-300 mt-1">
            Optimize consultation timing to increase daily earnings & patient flow
          </p>

          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white/10 p-4 rounded-xl">
              <p className="text-gray-400">Avg Efficiency</p>
              <h3 className="text-2xl font-bold text-green-400">92%</h3>
            </div>

            <div className="bg-white/10 p-4 rounded-xl">
              <p className="text-gray-400">Revenue Score</p>
              <h3 className="text-2xl font-bold text-blue-400">High</h3>
            </div>

            <div className="bg-white/10 p-4 rounded-xl">
              <p className="text-gray-400">Growth</p>
              <h3 className="text-2xl font-bold text-purple-400">+18%</h3>
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
      <Helmet>
        <title>Doctor Dashboard | HMS - Manage Appointments & Earnings</title>

        <meta
          name="description"
          content="Doctor dashboard to manage appointments, patients, prescriptions and track daily earnings in Hospital Management System."
        />

        <meta
          name="keywords"
          content="doctor dashboard, hospital management system, doctor appointments, patient management, doctor earnings, HMS India"
        />

        <meta name="author" content="HMS App" />
        <meta property="og:title" content="Doctor Dashboard | HMS" />
        <meta
          property="og:description"
          content="Manage appointments and track doctor performance and earnings."
        />
        <meta property="og:type" content="website" />
      </Helmet>


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

export default DoctorDashboard; 
