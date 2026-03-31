import React, { useEffect, useState, useMemo } from "react";
import API from "../api/axios";
import Navbar from "../components/Navbar";
import Swal from "sweetalert2";
import { Helmet } from "react-helmet-async";

import {
  Calendar as BigCalendar,
  dateFnsLocalizer,
} from "react-big-calendar";

import { format, parse, startOfWeek, getDay } from "date-fns";
import enUS from "date-fns/locale/en-US";

import "react-big-calendar/lib/css/react-big-calendar.css";

import {
  CalendarDays,
  User,
  Stethoscope,
  Clock,
  XCircle,
} from "lucide-react";

const locales = { "en-US": enUS };

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

function Appointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);


  const fetchAppointments = async () => {
    try {
      const res = await API.get("/appointments/admin");
      setAppointments(res.data.data || []);
    } catch (error) {
      console.error("Failed to load appointments:", error);
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
        title: `${appt.patient?.user?.name || "Patient"} • ${appt.doctor?.user?.name || "Doctor"
          }`,
        start,
        end,
        status: appt.status,
        fullData: appt,
      };
    });
  }, [appointments]);


  const eventStyleGetter = (event) => {
    let bg = "#3b82f6";

    if (event.status === "completed") bg = "#16a34a";
    if (event.status === "cancelled") bg = "#ef4444";

    return {
      style: {
        backgroundColor: bg,
        color: "#fff",
        borderRadius: "6px",
        padding: "4px",
      },
    };
  };


  const handleSelectEvent = (event) => {
    const appt = event.fullData;

    Swal.fire({
      title: "Appointment Info",
      html: `
        <b>Patient:</b> ${appt.patient?.user?.name || "N/A"} <br/>
        <b>Doctor:</b> ${appt.doctor?.user?.name || "N/A"} <br/>
        <b>Date:</b> ${new Date(appt.appointmentDate).toLocaleDateString()} <br/>
        <b>Time:</b> ${appt.slotTime} <br/>
        <b>Status:</b> ${appt.status}
      `,
    });
  };


  const cancelAppointment = async (id) => {
    const result = await Swal.fire({
      title: "Cancel Appointment?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes",
    });

    if (!result.isConfirmed) return;

    await API.patch(`/appointments/${id}/cancel`);
    fetchAppointments();
  };


  const deleteAppointment = async (id) => {
    const result = await Swal.fire({
      title: "Delete Appointment?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Delete",
    });


    if (!result.isConfirmed) return;

    await API.delete(`/appointments/admin/${id}`);

    setAppointments((prev) =>
      prev.filter((appt) => appt._id !== id)
    );


  };

  return (
    <>

      <Helmet>
        <title>Appointments Dashboard | HMS Admin</title>

        <meta
          name="description"
          content="Manage all hospital appointments, scheduling, cancellations and patient flow from admin dashboard."
        />

        <meta
          name="keywords"
          content="appointments dashboard, hospital booking system, admin appointment panel, HMS appointments, manage doctor bookings"
        />

        <meta name="robots" content="noindex, nofollow" />

        <meta property="og:title" content="Appointments Dashboard | HMS" />
        <meta
          property="og:description"
          content="Admin panel to manage hospital appointments and scheduling."
        />
        <meta property="og:type" content="website" />
      </Helmet>


      <Navbar />

      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 px-4 py-10">

        <div className="max-w-7xl mx-auto">

          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6 mb-8 shadow-2xl">
            <h1 className="text-3xl font-bold text-white">
              📅 Appointments Dashboard
            </h1>
            <p className="text-gray-300 text-sm mt-1">
              Manage hospital bookings, schedule tracking & patient flow
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl p-4 mb-10">
            <div className="h-[520px]">
              <BigCalendar
                localizer={localizer}
                events={events}
                startAccessor="start"
                endAccessor="end"
                eventPropGetter={eventStyleGetter}
                onSelectEvent={handleSelectEvent}
                views={["month", "week", "day"]}
                className="text-white"
              />
            </div>
          </div>

          {loading ? (
            <div className="text-center text-white text-lg py-20">
              Loading appointments...
            </div>
          ) : (
            <>

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

                {appointments.map((appt) => (
                  <div
                    key={appt._id}
                    className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6 shadow-2xl hover:scale-[1.02] transition"
                  >

                    <div className="flex items-center justify-between mb-4">

                      <span
                        className={`px-4 py-1 rounded-full text-xs font-bold border
                      ${appt.status === "completed"
                            ? "bg-green-500/20 text-green-400 border-green-400/30"
                            : appt.status === "cancelled"
                              ? "bg-red-500/20 text-red-400 border-red-400/30"
                              : "bg-blue-500/20 text-blue-400 border-blue-400/30"
                          }`}
                      >
                        {appt.status.toUpperCase()}
                      </span>

                      <div className="flex gap-2">

                        {appt.status === "booked" && (
                          <button
                            onClick={() => cancelAppointment(appt._id)}
                            className="p-2 rounded-xl bg-red-500/20 border border-red-400/30 text-red-400 hover:scale-105 transition"
                          >
                            <XCircle size={18} />
                          </button>
                        )}

                        {(appt.status === "cancelled" || appt.status === "completed") && (
                          <button
                            onClick={() => deleteAppointment(appt._id)}
                            className="p-2 rounded-xl bg-black/40 border border-white/20 text-white hover:scale-105 transition"
                          >
                            🗑
                          </button>
                        )}

                      </div>

                    </div>

                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 bg-blue-500/20 rounded-xl">
                        <User className="text-blue-400" size={18} />
                      </div>
                      <p className="text-white font-medium">
                        {appt.patient?.user?.name}
                      </p>
                    </div>

                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 bg-purple-500/20 rounded-xl">
                        <Stethoscope className="text-purple-400" size={18} />
                      </div>
                      <p className="text-white font-medium">
                        {appt.doctor?.user?.name}
                      </p>
                    </div>

                    <div className="flex items-center gap-3 mb-2 text-gray-300">
                      <CalendarDays size={18} className="text-blue-400" />
                      <span>
                        {new Date(appt.appointmentDate).toLocaleDateString()}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 text-gray-300">
                      <Clock size={18} className="text-cyan-400" />
                      <span>{appt.slotTime}</span>
                    </div>

                  </div>
                ))}

                {appointments.length === 0 && (
                  <div className="col-span-full text-center text-gray-300 py-20">
                    No appointments found
                  </div>
                )}

              </div>

            </>
          )}

        </div>
      </div>
    </>
  );
}

export default Appointments;






















