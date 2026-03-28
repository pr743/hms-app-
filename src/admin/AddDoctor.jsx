import { useState } from "react";
import API from "../api/axios";
import Navbar from "../components/Navbar";
import { UserPlus } from "lucide-react";
import Swal from "sweetalert2";

function AddDoctor() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    specialization: "",
    qualification: "",
    experience: "",
    consultationFee: "",
    avgConsultTime: "",
    dailyLimit: "",
  });


  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    try {
      setLoading(true);

      await API.post("/doctors", {
        ...form,
        experience: Number(form.experience || 0),
        consultationFee: Number(form.consultationFee || 0),
        avgConsultTime: Number(form.avgConsultTime || 15),
        dailyLimit: Number(form.dailyLimit || 20),
      });

      Swal.fire({
        icon: "success",
        title: "Doctor Added",
        text: "Doctor added successfully ✅",
        timer: 1800,
        showConfirmButton: false,
      });

      setForm({
        name: "",
        email: "",
        password: "",
        specialization: "",
        qualification: "",
        experience: "",
        consultationFee: "",
        avgConsultTime: "",
        dailyLimit: "",
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Failed",
        text: error.response?.data?.message || "Failed to add doctor ❌",
      });

      console.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />

      <div className="p-6 bg-gray-200 min-h-screen flex justify-center">
        <div className="bg-white w-full max-w-xl p-8 rounded-2xl shadow-lg">
          <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <UserPlus /> Add Doctor
          </h1>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input name="name" placeholder="Doctor Name" className="input" onChange={handleChange} required />
            <input name="email" placeholder="Doctor Email" className="input" onChange={handleChange} required />
            <input type="password" name="password" placeholder="Password" className="input" onChange={handleChange} required />
            <input name="specialization" placeholder="Specialization" className="input" onChange={handleChange} required />
            <input name="qualification" placeholder="Qualification" className="input" onChange={handleChange} />
            <input name="experience" placeholder="Experience (years)" className="input" onChange={handleChange} />
            <input name="consultationFee" placeholder="Consultation Fee" className="input" onChange={handleChange} />
            <input name="avgConsultTime" placeholder="Avg Consult Time (min)" className="input" onChange={handleChange} />
            <input name="dailyLimit" placeholder="Daily Patient Limit" className="input" onChange={handleChange} />

            <button className="w-full bg-blue-600 text-white py-3 rounded-xl">
              {loading ? "Saving..." : "Create Doctor"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

export default AddDoctor;
