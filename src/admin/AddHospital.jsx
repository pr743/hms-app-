// import { useState } from "react";
// import { Hospital } from "lucide-react";
// import Navbar from "../components/Navbar";
// import API from "../api/axios";
// import Swal from "sweetalert2";

// function AddHospital() {
//   const [form, setForm] = useState({
//     name: "",
//     city: "",
//     address: "",
//   });

//   const [loading, setLoading] = useState(false);

//   const handleChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async () => {
//     try {
//       const res = await API.post("/hospitals", {
//         ...form,
//       });





//       Swal.fire({
//         icon: "success",
//         title: "Saved",
//         text: res.data.message || "Hospital saved successfully ✅",
//         timer: 1800,
//         showConfirmButton: false,
//       });


//       setForm({
//         name: "",
//         city: "",
//         address: "",
//         area: "",
//       });

//       setLoading(true);
//     } catch {
//       alert("Failed to save hospital ");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <>
//       <Navbar />

//       <div className="min-h-screen bg-gray-100 px-4 py-10">
//         <div className="max-w-2xl mx-auto bg-white shadow-xl rounded-2xl p-8">
//           <div className="flex items-center gap-3 mb-6">
//             <Hospital className="text-blue-600" size={32} />
//             <div>
//               <h1 className="text-2xl font-bold text-gray-800">
//                 Add New Hospital / update existing one
//               </h1>
//             </div>
//           </div>

//           <div className="space-y-5">
//             <input
//               name="name"
//               value={form.name}
//               onChange={handleChange}
//               placeholder="Hospital Name"
//               className="input"
//               required
//             />

//             <div className="grid grid-cols-2 gap-4">
//               <input
//                 name="city"
//                 value={form.city}
//                 onChange={handleChange}
//                 placeholder="City"
//                 className="input"
//                 required
//               />
//               <input
//                 name="area"
//                 value={form.area}
//                 onChange={handleChange}
//                 placeholder="Area"
//                 className="input"
//                 required
//               />
//             </div>

//             <textarea
//               name="address"
//               value={form.address}
//               onChange={handleChange}
//               placeholder="Hospital Address"
//               className="input"
//               rows={3}
//               required
//             />

//             <button
//               onClick={handleSubmit}
//               disabled={loading}
//               className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold"
//             >
//               {loading ? "Saving..." : "Save Hospital"}
//             </button>

//           </div>
//         </div>
//       </div>
//     </>
//   );
// }

// export default AddHospital;























import { useState } from "react";
import { Hospital } from "lucide-react";
import Navbar from "../components/Navbar";
import API from "../api/axios";
import Swal from "sweetalert2";

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

  // 🤖 AI Suggestion
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
      <Navbar />

      <div className="min-h-screen bg-gray-100 px-4 py-10">
        <div className="max-w-2xl mx-auto bg-white shadow-xl rounded-2xl p-8">

          <div className="flex items-center gap-3 mb-6">
            <Hospital className="text-blue-600" size={32} />
            <h1 className="text-2xl font-bold">
              Smart Hospital Setup 🏥
            </h1>
          </div>

          <div className="space-y-5">

            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Hospital Name"
              className="input"
            />

            <div className="grid grid-cols-2 gap-4">
              <input
                name="city"
                value={form.city}
                onChange={handleChange}
                placeholder="City"
                className="input"
              />

              <input
                name="area"
                value={form.area}
                onChange={handleChange}
                placeholder="Area"
                className="input"
              />
            </div>

            <textarea
              name="address"
              value={form.address}
              onChange={handleChange}
              placeholder="Address"
              className="input"
            />


            <button
              onClick={handleAISuggest}
              className="w-full bg-purple-600 text-white py-2 rounded"
            >
              {aiLoading ? "Thinking..." : "🤖 Auto Setup (AI)"}
            </button>


            <div className="grid grid-cols-2 gap-4">
              <input
                type="time"
                name="startTime"
                value={form.startTime}
                onChange={handleChange}
                className="input"
              />
              <input
                type="time"
                name="endTime"
                value={form.endTime}
                onChange={handleChange}
                className="input"
              />
            </div>

            <input
              type="number"
              name="slotDuration"
              value={form.slotDuration}
              onChange={handleChange}
              className="input"
              placeholder="Slot Duration (minutes)"
            />


            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                name="emergencyEnabled"
                checked={form.emergencyEnabled}
                onChange={handleChange}
              />
              Emergency Enabled
            </label>

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 rounded-xl"
            >
              {loading ? "Saving..." : "Save Hospital"}
            </button>

          </div>
        </div>
      </div>
    </>
  );
}

export default AddHospital;