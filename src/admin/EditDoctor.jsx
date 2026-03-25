import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api/axios";
import Navbar from "../components/Navbar";

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
            const res = await API.get("/admin/doctor");
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

            alert("Doctor updated ✅");

            navigate("/admin/doctors");
        } catch {
            alert("Update failed ❌");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Navbar />

            <div className="p-6 bg-gray-100 min-h-screen flex justify-center">
                <form
                    onSubmit={handleSubmit}
                    className="bg-white p-6 rounded-xl shadow w-full max-w-lg space-y-4"
                >
                    <h2 className="text-xl font-bold">Edit Doctor</h2>

                    <input name="name" value={form.name} onChange={handleChange} className="input" placeholder="Name" />
                    <input name="email" value={form.email} onChange={handleChange} className="input" placeholder="Email" />
                    <input name="specialization" value={form.specialization} onChange={handleChange} className="input" placeholder="Specialization" />
                    <input name="qualification" value={form.qualification} onChange={handleChange} className="input" placeholder="Qualification" />
                    <input name="experience" value={form.experience} onChange={handleChange} className="input" placeholder="Experience" />
                    <input name="consultationFee" value={form.consultationFee} onChange={handleChange} className="input" placeholder="Fee" />
                    <input name="avgConsultTime" value={form.avgConsultTime} onChange={handleChange} className="input" placeholder="Time" />
                    <input name="dailyLimit" value={form.dailyLimit} onChange={handleChange} className="input" placeholder="Limit" />

                    <button className="w-full bg-blue-600 text-white py-2 rounded-lg">
                        {loading ? "Updating..." : "Update Doctor"}
                    </button>
                </form>
            </div>
        </>
    );
}

export default EditDoctor;