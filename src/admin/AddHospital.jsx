import { useState } from "react";
import { Hospital } from "lucide-react";
import Navbar from "../components/Navbar";
import API from "../api/axios";
import Swal from "sweetalert2";
import { Helmet } from "react-helmet-async";

function AddHospital() {
  const [form, setForm] = useState({
    name: "",
    city: "",
    area: "",
    address: "",
    startTime: "09:00",
    endTime: "18:00",
    slotDuration: 15,
    emergencyEnabled: true,
  });

  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleAISuggest = async () => {
    try {
      if (!form.city) {
        alert("Enter city first ❌");
        return;
      }

      setAiLoading(true);

      const res = await API.post("/admin/ai-hospital-setup", {
        city: form.city,
        name: form.name,
      });

      const data = res.data.data;

      setForm((prev) => ({
        ...prev,
        slotDuration: data.slotDuration,
        startTime: data.startTime,
        endTime: data.endTime,
      }));

    } catch (err) {
      console.error(err);
      alert("AI failed ❌");
    } finally {
      setAiLoading(false);
    }
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);

      const res = await API.post("/hospitals", form);

      Swal.fire({
        icon: "success",
        title: "Saved",
        text: res.data.message || "Hospital saved successfully ✅",
        timer: 1800,
        showConfirmButton: false,
      });

      setForm({
        name: "",
        city: "",
        area: "",
        address: "",
        startTime: "09:00",
        endTime: "18:00",
        slotDuration: 15,
        emergencyEnabled: true,
      });

    } catch (err) {
      console.error(err);
      alert("Failed to save hospital ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Add Hospital | HMS Admin Panel</title>

        <meta
          name="description"
          content="Add and manage hospitals with AI-powered setup. Hospital Management System helps admins configure timings, slots, emergency services, and locations easily."
        />

        <meta
          name="keywords"
          content="Add Hospital, Hospital Setup, HMS Admin, Hospital Management System, AI Hospital Setup, Healthcare Platform India, Hospital Registration"
        />

        <meta name="author" content="HMS System" />

        <meta property="og:title" content="Add Hospital | HMS Admin Panel" />
        <meta
          property="og:description"
          content="Smart AI-powered hospital onboarding system with scheduling and emergency setup."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://yourdomain.com/admin/add-hospital" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Add Hospital | HMS" />
        <meta
          name="twitter:description"
          content="AI-powered hospital setup system for modern healthcare platforms."
        />
      </Helmet>



      <Navbar />

      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 px-4 py-10">

        <div className="max-w-3xl mx-auto">

          <div className="bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl rounded-3xl p-6 mb-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-500/20 rounded-2xl">
                <Hospital className="text-blue-400" size={34} />
              </div>

              <div>
                <h1 className="text-2xl font-bold text-white">
                  Add Hospital & Setup Schedule 🏥
                </h1>
                <p className="text-gray-300 text-sm">
                  Premium hospital onboarding system
                </p>

                <p className="hidden">
                  Add hospitals, manage schedules, enable emergency services, and optimize healthcare booking system using AI powered hospital management software.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl rounded-3xl p-8 space-y-5">

            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Hospital Name"
              className="w-full px-4 py-3 rounded-xl bg-white/10 text-white placeholder-gray-300 border border-white/10 focus:border-blue-400 outline-none"
            />

            <div className="grid grid-cols-2 gap-4">
              <input
                name="city"
                value={form.city}
                onChange={handleChange}
                placeholder="City"
                className="px-4 py-3 rounded-xl bg-white/10 text-white placeholder-gray-300 border border-white/10 focus:border-blue-400 outline-none"
              />

              <input
                name="area"
                value={form.area}
                onChange={handleChange}
                placeholder="Area"
                className="px-4 py-3 rounded-xl bg-white/10 text-white placeholder-gray-300 border border-white/10 focus:border-blue-400 outline-none"
              />
            </div>

            <textarea
              name="address"
              value={form.address}
              onChange={handleChange}
              placeholder="Full Address"
              className="w-full px-4 py-3 rounded-xl bg-white/10 text-white placeholder-gray-300 border border-white/10 focus:border-blue-400 outline-none"
            />

            <button
              onClick={handleAISuggest}
              className="w-full py-3 rounded-xl font-semibold text-white 
            bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 
            shadow-lg hover:scale-[1.02] transition"
            >
              {aiLoading ? "🤖 AI Thinking..." : "⚡ Auto Setup with AI"}
            </button>

            <div className="grid grid-cols-2 gap-4">
              <input
                type="time"
                name="startTime"
                value={form.startTime}
                onChange={handleChange}
                className="px-4 py-3 rounded-xl bg-white/10 text-white border border-white/10"
              />
              <input
                type="time"
                name="endTime"
                value={form.endTime}
                onChange={handleChange}
                className="px-4 py-3 rounded-xl bg-white/10 text-white border border-white/10"
              />
            </div>

            <input
              name="slotDuration"
              value={form.slotDuration}
              onChange={handleChange}
              placeholder="Slot Duration (minutes)"
              className="w-full px-4 py-3 rounded-xl bg-white/10 text-white border border-white/10"
            />


            <label className="flex items-center justify-between bg-white/5 px-4 py-3 rounded-xl border border-white/10">
              <span className="text-white font-medium">
                Emergency Enabled
              </span>

              <input
                type="checkbox"
                name="emergencyEnabled"
                checked={form.emergencyEnabled}
                onChange={handleChange}
                className="w-5 h-5 accent-blue-500"
              />
            </label>


            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full py-3 rounded-xl font-bold text-white 
            bg-gradient-to-r from-blue-600 to-cyan-500 
            shadow-xl hover:scale-[1.02] transition"
            >
              {loading ? "Saving..." : "💰 Save & Activate Hospital"}
            </button>

          </div>

          <div className="h-20 blur-3xl bg-blue-500/20 mt-10 rounded-full"></div>

        </div>
      </div>
    </>
  );

}

export default AddHospital;