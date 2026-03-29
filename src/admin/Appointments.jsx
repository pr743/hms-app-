import React, { useEffect, useState, useMemo } from "react";
import API from "../api/axios";
import Navbar from "../components/Navbar";
import Swal from "sweetalert2";

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

    if ((result.isConfirmed && !["cancelled", "completed"].includes(appointments.status))) return;

    await API.delete(`/appointments/admin/${id}`);

    setAppointments((prev) =>
      prev.filter((appt) => appt._id !== id)
    );


  };

  return (
    <>
      <Navbar />

      <div className="p-6 bg-gray-100 min-h-screen">

        <h1 className="text-3xl font-bold mb-6">
          📅 Appointments Dashboard
        </h1>


        <div className="bg-white rounded-xl shadow p-4 mb-8">
          <div className="h-[500px]">
            <BigCalendar
              localizer={localizer}
              events={events}
              startAccessor="start"
              endAccessor="end"
              eventPropGetter={eventStyleGetter}
              onSelectEvent={handleSelectEvent}
              views={["month", "week", "day"]}
            />
          </div>
        </div>


        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
            {appointments.map((appt) => (
              <div
                key={appt._id}
                className="bg-white p-5 rounded-xl shadow"
              >
                <div className="flex justify-between mb-3">

                  <span className="text-sm font-bold">
                    {appt.status}
                  </span>

                  {appt.status === "booked" && (
                    <XCircle
                      className="text-red-500 cursor-pointer"
                      onClick={() =>
                        cancelAppointment(appt._id)
                      }
                    />
                  )}

                  {/* {appt.status === "cancelled" || appt.status === "completed" && (
                    <button
                      onClick={() =>
                        deleteAppointment(appt._id)
                      }
                    >
                      🗑
                    </button>
                  )} */}



                  {(appt.status === "cancelled" ||
                    appt.status === "completed") && (
                      <button
                        className="text-red-600 text-sm"
                        onClick={() => deleteAppointment(appt._id)}
                      >
                        🗑
                      </button>
                    )}
                </div>

                <p><User size={14} /> {appt.patient?.user?.name}</p>
                <p><Stethoscope size={14} /> {appt.doctor?.user?.name}</p>
                <p><CalendarDays size={14} /> {new Date(appt.appointmentDate).toLocaleDateString()}</p>
                <p><Clock size={14} /> {appt.slotTime}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

export default Appointments;






















