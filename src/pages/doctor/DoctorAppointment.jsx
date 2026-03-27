import { useEffect, useState } from "react";
import { Calendar as BigCalendar, dateFnsLocalizer } from "react-big-calendar";
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";

import "react-big-calendar/lib/css/react-big-calendar.css";
import "react-big-calendar/lib/addons/dragAndDrop/styles.css";

import { format, parse, startOfWeek, getDay } from "date-fns";
import enUS from "date-fns/locale/en-US";

import API from "../../api/axios";
import Navbar from "../../components/Navbar";
import { useNavigate } from "react-router-dom";

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

  // ✅ FETCH DATA
  const fetchAppointments = async () => {
    try {
      const res = await API.get("/appointments/doctor");
      setAppointments(res.data.data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  // ✅ CONVERT TO CALENDAR EVENTS
  const events = appointments.map((appt) => {
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
      raw: appt,
    };
  });


  // const eventStyleGetter = (event) => {
  //   let bg = "#3b82f6";

  //   if (event.status === "completed") bg = "#16a34a";
  //   else if (event.status === "booked") bg = "#f59e0b";
  //   else if (event.status === "cancelled") bg = "#dc2626";

  //   if (event.type === "emergency") bg = "#7f1d1d";

  //   return {
  //     style: {
  //       backgroundColor: bg,
  //       color: "#fff",
  //       borderRadius: "8px",
  //       padding: "6px",
  //       fontSize: "12px",
  //       border: "none",
  //     },
  //   };
  // };


  const eventStyleGetter = (event) => {
    let bg = "#3b82f6";

    const status = event.status?.toLowerCase();
    const type = event.type?.toLowerCase();


    if (type === "emergency") {
      bg = "#dc2626";
    } else if (status === "completed") {
      bg = "#16a34a";
    } else if (status === "booked") {
      bg = "#f59e0b";
    } else if (status === "cancelled") {
      bg = "#ef4444";
    }

    return {
      style: {
        backgroundColor: bg,
        color: "#fff",
        borderRadius: "8px",
        padding: "6px",
        fontSize: "12px",
        border: "none",
      },
    };
  };

  // const handleSelectEvent = (event) => {
  //   navigate(`/doctor/create-prescription/${event.id}`);
  // };


  const moveEvent = async ({ event, start }) => {
    try {
      await API.patch(`/appointments/${event.id}/reschedule`, {
        newDate: start.toISOString(),
        newSlotTime: format(start, "hh:mm a"),
      });

      fetchAppointments();
    } catch (err) {
      console.error(err);
      alert("Reschedule failed ❌");
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
      (a) => a.appointmentType === "emergency" && a.status === "booked"
    );

    if (emergency.length > 0) {
      alert(`🚨 ${emergency.length} Emergency patients waiting!`);
    }
  }, [appointments]);

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="p-6">Loading...</div>
      </>
    );
  }

  return (
    <>
      <Navbar />

      <div className="p-3 md:p-6 bg-gray-100 min-h-screen">

        <h1 className="text-xl md:text-3xl font-bold mb-4">
          My Appointment
        </h1>


        <div className="flex flex-wrap gap-3 text-xs md:text-sm mb-4">
          <span>🟢 Completed</span>
          <span>🟠 Pending</span>
          <span>🔴 Cancelled</span>
          <span>🚨 Emergency</span>
        </div>


        <div className="bg-white rounded-xl shadow p-2 md:p-4 mb-6">
          <div className="h-[400px] md:h-[650px]">
            {/* <DnDCalendar
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
            /> */}



            <DnDCalendar
              localizer={localizer}
              events={events}
              startAccessor="start"
              endAccessor="end"

              selectable
              popup

              onSelectEvent={(event) => {
                navigate(`/doctor/create-prescription/${event.id}`);
              }}

              onDoubleClickEvent={(event) => {
                navigate(`/doctor/create-prescription/${event.id}`);
              }}

              onSelectSlot={(slot) => {
                console.log("Slot clicked:", slot);
              }}

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
              className={`bg-white p-3 md:p-4 rounded-lg shadow
              ${appt.appointmentType === "emergency"
                  ? "border-l-4 border-red-600"
                  : ""
                }`}
            >
              <div className="flex justify-between items-center">

                <div>
                  <div className="font-semibold text-sm md:text-base flex items-center gap-2">
                    <User size={14} />
                    {appt.patient?.user?.name || "N/A"}
                  </div>

                  <div className="text-xs md:text-sm text-gray-500 flex gap-3">
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
                    <div className="text-red-600 text-xs font-bold flex items-center gap-1">
                      <AlertTriangle size={12} /> Emergency
                    </div>
                  )}
                </div>


                <div className="flex gap-2">

                  {appt.status === "booked" && (
                    <button
                      onClick={() => markCompleted(appt._id)}
                      className="bg-green-600 text-white px-3 py-1 rounded text-xs md:text-sm"
                    >
                      Complete
                    </button>
                  )}

                  <button
                    onClick={() =>
                      navigate(`/doctor/patient/${appt.patient._id}/history`)
                    }
                    className="bg-blue-600 text-white px-3 py-1 rounded text-xs md:text-sm"
                  >
                    History
                  </button>

                  <button
                    onClick={() =>
                      navigate(`/doctor/create-prescription/${appt._id}`)
                    }
                    className="bg-purple-600 text-white px-3 py-1 rounded text-xs md:text-sm"
                  >
                    Open
                  </button>

                </div>

              </div>
            </div>
          ))}

          {appointments.length === 0 && (
            <p className="text-center text-gray-500">
              No appointments found
            </p>
          )}
        </div>
      </div>
    </>
  );
}

export default DoctorAppointment;