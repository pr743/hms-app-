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
  const [aiLoading, setAiLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };


  const getAISuggestion = async () => {
    if (!form.specialization) {
      return Swal.fire("Select specialization first ❌");
    }

    try {
      setAiLoading(true);

      const res = await API.post("/admin/ai-doctor-setup", {
        specialization: form.specialization,
        experience: Number(form.experience || 0),
      });

      const data = res.data.data;

      setForm((prev) => ({
        ...prev,
        avgConsultTime: data.avgConsultTime,
        dailyLimit: data.dailyLimit,
        consultationFee: data.consultationFee,
      }));

      Swal.fire({
        icon: "info",
        title: "🤖 AI Suggestion",
        html: `
          <b>Load per Doctor:</b> ${data.loadPerDoctor.toFixed(1)} <br/>
          <b>Suggestions:</b><br/>
          ${data.suggestions.map(s => `• ${s}`).join("<br/>")}
        `,
      });

    } catch (err) {
      console.error(err);
      Swal.fire("AI Failed ❌");
    } finally {
      setAiLoading(false);
    }
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
        title: "Doctor Added ✅",
        timer: 1500,
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
        text: error.response?.data?.message || "Error ❌",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 px-4 py-10">
        <div className="max-w-2xl mx-auto">


          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6 mb-6 shadow-2xl">
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              <UserPlus className="text-blue-400" />
              Add Doctor (Smart AI)
            </h1>
            <p className="text-gray-300 text-sm mt-1">
              AI-powered doctor onboarding system
            </p>
          </div>


          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl space-y-4">
            <form onSubmit={handleSubmit} className="space-y-4">

              <input
                name="name"
                placeholder="Doctor Name"
                className="w-full px-4 py-3 rounded-xl bg-white/10 text-white placeholder-gray-300 border border-white/10 focus:border-blue-400 outline-none"
                onChange={handleChange}
                required

              />
              <input name="email" placeholder="Email" className="w-full px-4 py-3 rounded-xl bg-white/10 text-white placeholder-gray-300 border border-white/10 focus:border-blue-400 outline-none" onChange={handleChange} required />
              <input type="password" name="password" className="w-full px-4 py-3 rounded-xl bg-white/10 text-white placeholder-gray-300 border border-white/10 focus:border-blue-400 outline-none" placeholder="Password" onChange={handleChange} required />

              <input name="specialization" placeholder="Specialization" className="w-full px-4 py-3 rounded-xl bg-white/10 text-white placeholder-gray-300 border border-white/10 focus:border-blue-400 outline-none" onChange={handleChange} required />
              <input name="qualification" placeholder="Qualification" className="w-full px-4 py-3 rounded-xl bg-white/10 text-white placeholder-gray-300 border border-white/10 focus:border-blue-400 outline-none" onChange={handleChange} />

              <input name="experience" placeholder="Experience (years)" className="w-full px-4 py-3 rounded-xl bg-white/10 text-white placeholder-gray-300 border border-white/10 focus:border-blue-400 outline-none" onChange={handleChange} />

              <button
                type="button"
                onClick={getAISuggestion}
                className="w-full py-3 rounded-xl font-semibold text-white 
            bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 
            shadow-xl hover:scale-[1.02] transition"
              >
                {aiLoading ? "🤖 AI Thinking..." : "⚡ Auto Setup Doctor (AI)"}
              </button>


              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 justify-center">
                <input name="consultationFee"
                  placeholder="Consultation Fee"
                  className="px-4 py-3 rounded-xl bg-white/10 text-white border border-white/10"
                  value={form.consultationFee}
                  onChange={handleChange}

                />
                <input
                  name="avgConsultTime"
                  placeholder="Avg Time (min)"
                  className="px-4 py-3 rounded-xl bg-white/10 text-white border border-white/10"
                  value={form.avgConsultTime} onChange={handleChange}

                />
                <input name="dailyLimit"
                  placeholder="Daily Limit"
                  className="px-4 py-3 rounded-xl bg-white/10 text-white border border-white/10"
                  value={form.dailyLimit}
                  onChange={handleChange} />

                <button className="w-full py-3 rounded-xl font-bold text-white 
            bg-gradient-to-r from-blue-600 to-cyan-500 
            shadow-xl hover:scale-[1.02] transition  justify-center items-center"
                >
                  {loading ? "Saving..." : "💰 Create & Activate Doctor"}
                </button>

              </div>
            </form>

          </div>

        </div>
      </div>
    </>
  );
}

export default AddDoctor;