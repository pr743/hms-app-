import React, { useEffect, useState } from "react";
import API from "../../api/axios";
import Navbar from "../../components/Navbar";
import Swal from "sweetalert2";

function PatientAppointments() {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchAppointments = async () => {
        try {
            const res = await API.get("/patient/appointments");

            console.log("ApI Data :", res.data);
            setAppointments(res.data.data || []);
        } catch (err) {
            console.error(err);
            Swal.fire("Error", "Failed to load appointments ❌", "error");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAppointments();
    }, []);

    const deleteAppointment = async (id) => {
        const confirm = await Swal.fire({
            title: "Are you sure?",
            text: "This appointment will be deleted!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            confirmButtonText: "Yes, delete",
        });

        if (!confirm.isConfirmed) return;

        try {
            await API.delete(`/patient/appointments/${id}`);

            setAppointments((prev) =>
                prev.filter((appt) => appt._id !== id)
            );

            Swal.fire("Deleted!", "Appointment removed ✅", "success");
        } catch {
            Swal.fire("Error", "Delete failed ❌", "error");
        }
    };

    return (
        <>
            <Navbar />


            <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 p-6">


                <div className="max-w-7xl mx-auto mb-8">
                    <h1 className="text-3xl md:text-4xl font-bold text-white">
                        My Appointments
                    </h1>
                    <p className="text-white mt-1">
                        Manage and track all your bookings 📅
                    </p>
                </div>

                {loading ? (
                    <div className="text-center text-lg text-gray-100">
                        Loading appointments...
                    </div>
                ) : appointments.length === 0 ? (
                    <div className="text-center text-gray-100 text-lg">
                        No appointments found
                    </div>
                ) : (
                    <div className="max-w-7xl mx-auto grid md:grid-cols-2 lg:grid-cols-3 gap-6">

                        {appointments.map((appt) => (
                            <div
                                key={appt._id}
                                className="relative bg-white/70 backdrop-blur-xl border border-white/40 p-6 rounded-2xl shadow-lg hover:shadow-2xl transition duration-300"
                            >


                                <h2 className="font-semibold text-lg text-gray-800">
                                    {appt.doctor?.user?.name}
                                </h2>


                                <p className="text-sm text-gray-500">
                                    {appt.hospital?.name} ({appt.hospital?.city})
                                </p>


                                <div className="mt-3 space-y-1 text-gray-700 text-sm">
                                    <p>📅 {new Date(appt.appointmentDate).toLocaleDateString()}</p>
                                    <p>⏰ {appt.slotTime}</p>
                                </div>


                                <p className="mt-3 text-sm text-gray-600">
                                    <strong>Reason:</strong> {appt.reason}
                                </p>


                                <div className="mt-3">
                                    <span
                                        className={`px-3 py-1 rounded-full text-xs font-semibold
                                        ${appt.status === "completed"
                                                ? "bg-green-100 text-green-600"
                                                : appt.status === "cancelled"
                                                    ? "bg-red-100 text-red-500"
                                                    : "bg-blue-100 text-blue-600"
                                            }`}
                                    >
                                        {appt.status}
                                    </span>
                                </div>


                                <button
                                    onClick={() => deleteAppointment(appt._id)}
                                    className="mt-5 w-full py-2 rounded-xl font-semibold text-white
                                    bg-gradient-to-r from-red-500 to-red-600
                                    hover:from-red-600 hover:to-red-700
                                    shadow-md transition"
                                >
                                    🗑 Delete Appointment
                                </button>
                            </div>
                        ))}

                    </div>
                )}
            </div>
        </>
    );
}

export default PatientAppointments;



















