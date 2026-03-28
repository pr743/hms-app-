// import { useState } from "react";
// import API from "../api/axios";
// import Navbar from "../components/Navbar";
// import { UserPlus } from "lucide-react";
// import Swal from "sweetalert2";

// function AddDoctor() {
//   const [form, setForm] = useState({
//     name: "",
//     email: "",
//     password: "",
//     specialization: "",
//     qualification: "",
//     experience: "",
//     consultationFee: "",
//     avgConsultTime: "",
//     dailyLimit: "",
//   });


//   const [loading, setLoading] = useState(false);

//   const handleChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (loading) return;

//     try {
//       setLoading(true);

//       await API.post("/doctors", {
//         ...form,
//         experience: Number(form.experience || 0),
//         consultationFee: Number(form.consultationFee || 0),
//         avgConsultTime: Number(form.avgConsultTime || 15),
//         dailyLimit: Number(form.dailyLimit || 20),
//       });

//       Swal.fire({
//         icon: "success",
//         title: "Doctor Added",
//         text: "Doctor added successfully ✅",
//         timer: 1800,
//         showConfirmButton: false,
//       });

//       setForm({
//         name: "",
//         email: "",
//         password: "",
//         specialization: "",
//         qualification: "",
//         experience: "",
//         consultationFee: "",
//         avgConsultTime: "",
//         dailyLimit: "",
//       });
//     } catch (error) {
//       Swal.fire({
//         icon: "error",
//         title: "Failed",
//         text: error.response?.data?.message || "Failed to add doctor ❌",
//       });

//       console.error(error.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <>
//       <Navbar />

//       <div className="p-6 bg-gray-200 min-h-screen flex justify-center">
//         <div className="bg-white w-full max-w-xl p-8 rounded-2xl shadow-lg">
//           <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
//             <UserPlus /> Add Doctor
//           </h1>

//           <form onSubmit={handleSubmit} className="space-y-4">
//             <input name="name" placeholder="Doctor Name" className="input" onChange={handleChange} required />
//             <input name="email" placeholder="Doctor Email" className="input" onChange={handleChange} required />
//             <input type="password" name="password" placeholder="Password" className="input" onChange={handleChange} required />
//             <input name="specialization" placeholder="Specialization" className="input" onChange={handleChange} required />
//             <input name="qualification" placeholder="Qualification" className="input" onChange={handleChange} />
//             <input name="experience" placeholder="Experience (years)" className="input" onChange={handleChange} />
//             <input name="consultationFee" placeholder="Consultation Fee" className="input" onChange={handleChange} />
//             <input name="avgConsultTime" placeholder="Avg Consult Time (min)" className="input" onChange={handleChange} />
//             <input name="dailyLimit" placeholder="Daily Patient Limit" className="input" onChange={handleChange} />

//             <button className="w-full bg-blue-600 text-white py-3 rounded-xl">
//               {loading ? "Saving..." : "Create Doctor"}
//             </button>
//           </form>
//         </div>
//       </div>
//     </>
//   );
// }

// export default AddDoctor;



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

  // 🤖 AI FUNCTION
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

      <div className="p-6 bg-gray-200 min-h-screen flex justify-center">
        <div className="bg-white w-full max-w-xl p-8 rounded-2xl shadow-lg">

          <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <UserPlus /> Add Doctor (Smart AI)
          </h1>

          <form onSubmit={handleSubmit} className="space-y-4">

            <input name="name" placeholder="Doctor Name" className="input" onChange={handleChange} required />
            <input name="email" placeholder="Email" className="input" onChange={handleChange} required />
            <input type="password" name="password" placeholder="Password" className="input" onChange={handleChange} required />

            <input name="specialization" placeholder="Specialization" className="input" onChange={handleChange} required />
            <input name="qualification" placeholder="Qualification" className="input" onChange={handleChange} />

            <input name="experience" placeholder="Experience (years)" className="input" onChange={handleChange} />


            <button
              type="button"
              onClick={getAISuggestion}
              className="w-full bg-purple-600 text-white py-2 rounded"
            >
              {aiLoading ? "Thinking..." : "🤖 Auto Setup Doctor"}
            </button>

            <input name="consultationFee" placeholder="Consultation Fee" className="input" value={form.consultationFee} onChange={handleChange} />
            <input name="avgConsultTime" placeholder="Avg Time (min)" className="input" value={form.avgConsultTime} onChange={handleChange} />
            <input name="dailyLimit" placeholder="Daily Limit" className="input" value={form.dailyLimit} onChange={handleChange} />

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