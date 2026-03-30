import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api/axios";
import Navbar from "../components/Navbar";
import Swal from "sweetalert2";

function EditDoctor() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [form, setForm] = useState({
        name: "",
        email: "",
        specialization: "",
        qualification: "",
        experience: "",
        consultationFee: "",
        avgConsultTime: "",
        dailyLimit: "",
    });

    const [loading, setLoading] = useState(false);
    const fetchDoctor = async () => {
        try {
            const res = await API.get("/admin/doctors");
            const doctor = res.data.data.find(d => d._id === id);

            if (doctor) {
                setForm({
                    name: doctor.user?.name || "",
                    email: doctor.user?.email || "",
                    specialization: doctor.specialization || "",
                    qualification: doctor.qualification || "",
                    experience: doctor.experience || "",
                    consultationFee: doctor.consultationFee || "",
                    avgConsultTime: doctor.avgConsultTime || "",
                    dailyLimit: doctor.dailyLimit || "",
                });
            }
        } catch {
            console.error("Failed to load doctor");
        }
    };

    useEffect(() => {
        fetchDoctor();
    }, []);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };


    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setLoading(true);

            await API.put(`/admin/doctors/${id}`, {
                ...form,
                experience: Number(form.experience),
                consultationFee: Number(form.consultationFee),
                avgConsultTime: Number(form.avgConsultTime),
                dailyLimit: Number(form.dailyLimit),
            });

            Swal.fire({
                icon: "success",
                title: "Updated",
                text: "Doctor updated successfully ✅",
                timer: 1500,
                showConfirmButton: false,
            });

            setTimeout(() => {
                navigate("/admin/doctors");
            }, 1500);

        } catch {
            Swal.fire({
                icon: "error",
                title: "Failed",
                text: "Update failed ❌",
            });
        } finally {
            setLoading(false);
        }
    };



    return (
        <>
            <Navbar />

            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-950 p-6 flex items-center justify-center">

                <div className="w-full max-w-2xl">

                    <div className="mb-6 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 text-white shadow-2xl">
                        <h1 className="text-2xl font-bold flex items-center gap-2">
                            💰 Doctor Revenue Dashboard
                        </h1>
                        <p className="text-sm text-gray-300 mt-1">
                            Manage doctor earnings, consultation settings & performance
                        </p>
                    </div>
                    <form
                        onSubmit={handleSubmit}
                        className="bg-white/10 backdrop-blur-xl border border-white/20 p-6 rounded-2xl shadow-2xl space-y-4"
                    >

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                            <input name="name" value={form.name} onChange={handleChange}
                                placeholder="Doctor Name"
                                className="p-3 rounded-xl bg-white/10 text-white placeholder-gray-300 border border-white/20 focus:outline-none"
                            />

                            <input name="email" value={form.email} onChange={handleChange}
                                placeholder="Email"
                                className="p-3 rounded-xl bg-white/10 text-white placeholder-gray-300 border border-white/20"
                            />

                            <input name="specialization" value={form.specialization} onChange={handleChange}
                                placeholder="Specialization"
                                className="p-3 rounded-xl bg-white/10 text-white placeholder-gray-300 border border-white/20"
                            />

                            <input name="qualification" value={form.qualification} onChange={handleChange}
                                placeholder="Qualification"
                                className="p-3 rounded-xl bg-white/10 text-white placeholder-gray-300 border border-white/20"
                            />

                            <input name="experience" value={form.experience} onChange={handleChange}
                                placeholder="Experience (Years)"
                                className="p-3 rounded-xl bg-white/10 text-white placeholder-gray-300 border border-white/20"
                            />

                            <input name="consultationFee" value={form.consultationFee} onChange={handleChange}
                                placeholder="💸 Consultation Fee"
                                className="p-3 rounded-xl bg-white/10 text-white placeholder-gray-300 border border-white/20"
                            />

                            <input name="avgConsultTime" value={form.avgConsultTime} onChange={handleChange}
                                placeholder="⏱ Avg Time"
                                className="p-3 rounded-xl bg-white/10 text-white placeholder-gray-300 border border-white/20"
                            />

                            <input name="dailyLimit" value={form.dailyLimit} onChange={handleChange}
                                placeholder="📊 Daily Limit"
                                className="p-3 rounded-xl bg-white/10 text-white placeholder-gray-300 border border-white/20"
                            />
                        </div>

                        {/* CTA BUTTON */}
                        <button
                            type="submit"
                            className="w-full mt-4 bg-gradient-to-r from-green-400 to-emerald-600 hover:from-emerald-600 hover:to-green-500 text-white font-bold py-3 rounded-xl shadow-lg transition"
                        >
                            {loading ? "Updating..." : "💰 Update & Save Earnings"}
                        </button>

                    </form>
                </div>
            </div>
        </>
    );
}

export default EditDoctor;