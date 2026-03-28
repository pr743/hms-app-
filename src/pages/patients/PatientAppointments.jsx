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

            <div className="p-6 bg-gray-100 min-h-screen">
                <h1 className="text-3xl font-bold mb-6">
                    My Appointments
                </h1>

                {loading ? (
                    <p>Loading...</p>
                ) : appointments.length === 0 ? (
                    <p>No appointments found</p>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {appointments.map((appt) => (
                            <div
                                key={appt._id}
                                className="bg-white p-5 rounded-xl shadow"
                            >
                                <h2 className="font-semibold text-lg">
                                    {appt.doctor?.user?.name}
                                </h2>

                                <p className="text-sm text-gray-500">
                                    {appt.hospital?.name} ({appt.hospital?.city})
                                </p>

                                <p className="mt-2">
                                    📅 {new Date(appt.appointmentDate).toLocaleDateString()}
                                </p>

                                <p>⏰ {appt.slotTime}</p>

                                <p className="mt-2 text-sm">
                                    <strong>Reason:</strong> {appt.reason}
                                </p>

                                <p
                                    className={`mt-2 text-sm font-bold
                  ${appt.status === "completed"
                                            ? "text-green-600"
                                            : appt.status === "cancelled"
                                                ? "text-red-500"
                                                : "text-blue-600"
                                        }`}
                                >
                                    {appt.status}
                                </p>

                                <button
                                    onClick={() => deleteAppointment(appt._id)}
                                    className="mt-4 w-full bg-red-500 text-white py-2 rounded"
                                >
                                    Delete
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