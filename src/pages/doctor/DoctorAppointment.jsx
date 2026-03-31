import { useEffect, useState, useMemo } from "react";
import { Calendar as BigCalendar, dateFnsLocalizer } from "react-big-calendar";
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";

import "react-big-calendar/lib/css/react-big-calendar.css";
import "react-big-calendar/lib/addons/dragAndDrop/styles.css";

import { format, parse, startOfWeek, getDay } from "date-fns";
import enUS from "date-fns/locale/en-US";

import API from "../../api/axios";
import Navbar from "../../components/Navbar";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { Helmet } from "react-helmet-async";

import {
  Calendar,
  Clock,
  User,
  AlertTriangle,
} from "lucide-react";

const locales = { "en-US": enUS };

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

const DnDCalendar = withDragAndDrop(BigCalendar);

function DoctorAppointment() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchAppointments = async () => {
    try {
      const res = await API.get("/appointments/doctor");
      setAppointments(res.data.data || []);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const events = useMemo(() => {
    return appointments.map((appt) => {
      const date = new Date(appt.appointmentDate);

      let hour = 9;
      let minute = 0;

      if (appt.slotTime) {
        const [time, modifier] = appt.slotTime.split(" ");
        let [h, m] = time.split(":");

        hour = parseInt(h);
        minute = parseInt(m);

        if (modifier === "PM" && hour !== 12) hour += 12;
        if (modifier === "AM" && hour === 12) hour = 0;
      }

      const start = new Date(date);
      start.setHours(hour, minute);

      const end = new Date(start);
      end.setMinutes(start.getMinutes() + 30);

      return {
        id: appt._id,
        title: `${appt.patient?.user?.name || "Patient"} • ${appt.slotTime}`,
        start,
        end,
        status: appt.status,
        type: appt.appointmentType,
      };
    });
  }, [appointments]);

  const markInProgress = async (id) => {
    try {
      await API.patch(`/appointments/doctor/${id}/status`, {
        status: "in-progress",
      });

      Swal.fire({
        icon: "success",
        title: "Started",
        timer: 1000,
        showConfirmButton: false,
      });

      fetchAppointments();
    } catch (err) {
      console.error(err.response?.data);

      Swal.fire({
        icon: "error",
        title: "Error",
        text: err.response?.data?.message || "Failed ❌",
      });
    }
  };

  const eventStyleGetter = (event) => {
    const status = event.status?.toLowerCase();
    const type = event.type?.toLowerCase();

    let bg = "#3b82f6";

    if (type === "emergency") {
      bg = "#b91c1c";
    } else if (status === "completed") {
      bg = "#16a34a";
    } else if (status === "booked") {
      bg = "#f59e0b";
    } else if (status === "cancelled") {
      bg = "#ef4444";
    } else if (status === "in-progress") {
      bg = "#2563eb";
    }

    return {
      style: {
        backgroundColor: bg,
        color: "#fff",
        borderRadius: "10px",
        padding: "6px",
        fontSize: "12px",
        border: "none",
        cursor: "pointer",
        boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
      },
    };
  };

  const handleSelectEvent = (event) => {
    navigate(`/doctor/create-prescription?id=${event.id}`, {
      replace: true,
    });
  };

  const moveEvent = async ({ event, start }) => {
    try {
      await API.patch(`/appointments/doctor/${event.id}/reschedule`, {
        newDate: start.toISOString(),
        newSlotTime: format(start, "hh:mm a"),
      });

      fetchAppointments();
    } catch {
      Swal.fire({
        icon: "error",
        title: "Failed",
        text: "Reschedule failed ❌",
      });
    }
  };

  const markCompleted = async (id) => {
    try {
      await API.patch(`/appointments/doctor/${id}/status`, {
        status: "completed",
      });

      fetchAppointments();
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const emergency = appointments.filter(
      (a) =>
        a.appointmentType === "emergency" &&
        a.status === "booked"
    );

    if (emergency.length > 0) {
      Swal.fire({
        icon: "warning",
        title: "Emergency Alert 🚨",
        text: `${emergency.length} Emergency patients waiting!`,
        confirmButtonColor: "#d33",
      });
    }
  }, [appointments]);

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="p-6 text-lg text-gray-600">Loading dashboard...</div>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>Doctor Appointments | HMS</title>

        <meta
          name="description"
          content="Manage doctor appointments, schedule, reschedule, and track patient visits in HMS dashboard."
        />

        <meta
          name="keywords"
          content="doctor appointments, HMS schedule, calendar doctor, patient booking system"
        />

        <meta name="author" content="HMS Team" />

        <meta property="og:title" content="Doctor Appointment Dashboard - HMS" />
        <meta
          property="og:description"
          content="Track and manage appointments with smart calendar system."
        />
        <meta property="og:type" content="website" />

        <meta name="robots" content="index, follow" />

        <link rel="canonical" href="https://hms-app-l8ub.vercel.app/doctor/appointments" />
      </Helmet>

      <Navbar />

      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 p-6">

        <div className="mb-6 flex items-end justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-100">
              📅 Doctor Revenue Dashboard
            </h1>
            <p className="text-sm text-gray-500">
              Manage patients, appointments & performance
            </p>
          </div>

          <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-2 rounded-xl shadow-md">
            💰 Earnings: ₹12,450
          </div>
        </div>

        <div className="flex flex-wrap gap-2 text-xs md:text-sm mb-4">
          <span className="px-3 py-1 rounded-full bg-green-100 text-green-700">🟢 Completed</span>
          <span className="px-3 py-1 rounded-full bg-yellow-100 text-yellow-700">🟠 Pending</span>
          <span className="px-3 py-1 rounded-full bg-red-100 text-red-700">🔴 Cancelled</span>
          <span className="px-3 py-1 rounded-full bg-red-200 text-red-800 font-semibold">🚨 Emergency</span>
        </div>


        <div className="bg-white/70 backdrop-blur-md border border-gray-100 rounded-2xl shadow-xl p-3 md:p-4 mb-6">
          <div className="h-[400px] md:h-[650px]">
            <DnDCalendar
              localizer={localizer}
              events={events}
              startAccessor="start"
              endAccessor="end"
              selectable
              popup
              onSelectEvent={handleSelectEvent}
              onDoubleClickEvent={handleSelectEvent}
              onEventDrop={moveEvent}
              eventPropGetter={eventStyleGetter}
              longPressThreshold={10}
            />
          </div>
        </div>

        <div className="space-y-3">
          {appointments.map((appt) => (
            <div
              key={appt._id}
              className={`bg-white/80 backdrop-blur-md border rounded-2xl p-4 shadow-sm hover:shadow-lg transition
              ${appt.appointmentType === "emergency"
                  ? "border-l-4 border-red-500"
                  : "border-l-4 border-blue-500"
                }`}
            >
              <div className="flex justify-between items-center">


                <div>
                  <div className="font-semibold flex items-center gap-2 text-gray-900">
                    <User size={14} />
                    {appt.patient?.user?.name || "N/A"}
                  </div>

                  <div className="text-xs text-gray-500 flex gap-3 mt-1">
                    <span className="flex items-center gap-1">
                      <Calendar size={12} />
                      {new Date(appt.appointmentDate).toLocaleDateString()}
                    </span>

                    <span className="flex items-center gap-1">
                      <Clock size={12} />
                      {appt.slotTime}
                    </span>
                  </div>

                  {appt.appointmentType === "emergency" && (
                    <div className="text-red-600 text-xs font-bold flex gap-1 mt-1">
                      <AlertTriangle size={12} /> Emergency
                    </div>
                  )}
                </div>

                <div className="flex flex-wrap gap-2 mt-2 md:mt-0 justify-end">

                  {(appt.status === "booked" || appt.status === "in-progress") && (
                    <>
                      {appt.status === "booked" && (
                        <button
                          onClick={() => markInProgress(appt._id)}
                          className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1.5 rounded-xl text-xs md:text-sm shadow hover:scale-105 transition"
                        >
                          Start
                        </button>
                      )}

                      <button
                        onClick={() => markCompleted(appt._id)}
                        className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-3 py-1.5 rounded-xl text-xs md:text-sm shadow hover:scale-105 transition"
                      >
                        Complete
                      </button>
                    </>
                  )}

                  <button
                    onClick={() =>
                      navigate(`/doctor/patient/${appt.patient._id}/history`)
                    }
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-3 py-1.5 rounded-xl text-xs md:text-sm shadow hover:scale-105 transition"
                  >
                    History
                  </button>

                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </>
  );
}

export default DoctorAppointment;
