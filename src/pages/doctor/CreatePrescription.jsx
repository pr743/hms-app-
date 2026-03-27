// import { useEffect, useState } from "react";
// import API from "../../api/axios";
// import Navbar from "../../components/Navbar";

// const ALL_SYMPTOMS = [
//   "Fever", "Cold", "Cough", "Headache", "Migraine",
//   "Eye Pain", "Eye Infection", "Blur Vision",
//   "Ear Pain", "Hearing Issue",
//   "Chest Pain", "Heart Pain", "Breathing Problem",
//   "Stomach Pain", "Acidity", "Vomiting", "Diarrhea",
//   "Back Pain", "Joint Pain", "Muscle Pain",
//   "Skin Allergy", "Rash", "Itching",
//   "Diabetes", "High Blood Pressure", "Low BP",
//   "Thyroid", "Weakness", "Fatigue",
//   "Anxiety", "Depression", "Sleep Problem",
//   "Tooth Pain", "Gum Infection",
//   "Hair Fall", "Dandruff",
//   "Kidney Pain", "Urine Infection",
//   "Liver Problem",
//   "Asthma", "Sinus",
//   "Covid Symptoms",
// ];

// export default function CreatePrescription() {
//   const [appointments, setAppointments] = useState([]);
//   const [appointmentId, setAppointmentId] = useState("");

//   const [selectedSymptom, setSelectedSymptom] = useState("");

//   const [diagnosis, setDiagnosis] = useState("");
//   const [notes, setNotes] = useState("");

//   const [aiLoading, setAiLoading] = useState(false);
//   const [aiMedicines, setAiMedicines] = useState([]);

//   const [medicines, setMedicines] = useState([]);


//   useEffect(() => {
//     const fetchAppointments = async () => {
//       try {
//         const res = await API.get("/prescriptions/doctor/appointments");
//         setAppointments(res.data.data || []);
//       } catch (err) {
//         console.error("Failed to load appointments", err);
//       }
//     };

//     fetchAppointments();
//   }, []);


//   const getAISuggestion = async () => {
//     if (!selectedSymptom) {
//       alert("Please select symptom ❌");
//       return;
//     }

//     try {
//       setAiLoading(true);
//       setAiMedicines([]);

//       const res = await API.post("/ai/suggest", {
//         symptom: selectedSymptom,
//       });

//       if (Array.isArray(res.data?.data)) {
//         setAiMedicines(res.data.data);
//       } else {
//         setAiMedicines([]);
//       }
//     } catch (error) {
//       console.error(error);
//       alert("AI failed ❌");
//     } finally {
//       setAiLoading(false);
//     }
//   };

//   // ➕ ADD MEDICINE
//   const addMedicine = (med) => {
//     setMedicines((prev) => [...prev, med]);
//   };

//   // ❌ REMOVE MEDICINE
//   const removeMedicine = (index) => {
//     setMedicines((prev) => prev.filter((_, i) => i !== index));
//   };

//   // ✅ SUBMIT
//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!appointmentId) {
//       alert("Select appointment ❌");
//       return;
//     }

//     try {
//       await API.post("/prescriptions", {
//         appointmentId,
//         diagnosis: diagnosis || selectedSymptom,
//         notes,
//         medicines,
//       });

//       alert("Prescription Created ✅");

//       // remove used appointment
//       setAppointments((prev) =>
//         prev.filter((a) => a._id !== appointmentId)
//       );

//       // reset
//       setAppointmentId("");
//       setSelectedSymptom("");
//       setDiagnosis("");
//       setNotes("");
//       setMedicines([]);
//       setAiMedicines([]);

//     } catch {
//       alert("Error creating prescription ❌");
//     }
//   };

//   return (
//     <>
//       <Navbar />

//       <div className="max-w-5xl mx-auto p-6 bg-white shadow-lg rounded-lg">

//         <h2 className="text-2xl font-bold mb-4">
//           Smart Prescription AI (Doctor Panel)
//         </h2>

//         <form onSubmit={handleSubmit} className="space-y-4">


//           <select
//             className="w-full border p-2 rounded"
//             value={appointmentId}
//             onChange={(e) => setAppointmentId(e.target.value)}
//             required
//           >
//             <option value="">Select Appointment</option>

//             {appointments.length === 0 ? (
//               <option disabled>No completed appointments</option>
//             ) : (
//               appointments.map((appt) => (
//                 <option key={appt._id} value={appt._id}>
//                   {appt?.patient?.user?.name || "Unknown"} |{" "}
//                   {appt?.slotTime || "No Time"}
//                 </option>
//               ))
//             )}
//           </select>


//           <select
//             value={selectedSymptom}
//             onChange={(e) => setSelectedSymptom(e.target.value)}
//             className="w-full border p-2 rounded"
//           >
//             <option value="">Select Disease / Symptom</option>
//             {ALL_SYMPTOMS.map((item, i) => (
//               <option key={i} value={item}>
//                 {item}
//               </option>
//             ))}
//           </select>


//           <button
//             type="button"
//             onClick={getAISuggestion}
//             className="w-full bg-purple-600 text-white py-2 rounded"
//           >
//             {aiLoading ? "Thinking..." : "🤖 Get AI Suggestion"}
//           </button>


//           {aiMedicines.length > 0 && (
//             <div className="border p-4 rounded bg-gray-50">
//               <h3 className="font-bold mb-3">AI Suggested Medicines</h3>

//               {aiMedicines.map((med, index) => (
//                 <div
//                   key={index}
//                   className="flex justify-between items-center border p-2 mb-2 rounded"
//                 >
//                   <div>
//                     <p className="font-semibold">{med.name}</p>
//                     <p className="text-sm">
//                       {med.dosage} - {med.duration}
//                     </p>
//                   </div>

//                   <button
//                     type="button"
//                     onClick={() => addMedicine(med)}
//                     className="bg-green-500 text-white px-3 py-1 rounded"
//                   >
//                     Add
//                   </button>
//                 </div>
//               ))}
//             </div>
//           )}


//           <div>
//             <h3 className="font-bold text-lg">Final Prescription</h3>

//             {medicines.length === 0 ? (
//               <p className="text-gray-500">No medicines added</p>
//             ) : (
//               medicines.map((m, i) => (
//                 <div
//                   key={i}
//                   className="flex justify-between items-center border p-2 mt-2 rounded"
//                 >
//                   <div>
//                     {m.name} - {m.dosage} ({m.duration})
//                   </div>

//                   <button
//                     type="button"
//                     onClick={() => removeMedicine(i)}
//                     className="text-red-500"
//                   >
//                     Remove
//                   </button>
//                 </div>
//               ))
//             )}
//           </div>

//           <textarea
//             placeholder="Doctor Notes"
//             className="w-full border p-2 rounded"
//             value={notes}
//             onChange={(e) => setNotes(e.target.value)}
//           />


//           <button
//             type="submit"
//             className="w-full bg-green-600 text-white py-2 rounded"
//           >
//             Save Prescription
//           </button>

//         </form>
//       </div>
//     </>
//   );
// }







import { useState } from "react";
import API from "../../api/axios";
import Navbar from "../../components/Navbar";

const ALL_SYMPTOMS = [
  "Fever", "Cold", "Cough", "Headache", "Eye Pain", "Chest Pain",
  "Stomach Pain", "Diabetes", "Skin Allergy", "Back Pain"
];

export default function CreatePrescription() {
  const [symptom, setSymptom] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [aiMedicines, setAiMedicines] = useState([]);

  const [medicines, setMedicines] = useState([]);

  // 🤖 AI CALL
  const getAISuggestion = async () => {
    if (!symptom) return alert("Select symptom");

    try {
      setAiLoading(true);
      setAiMedicines([]);

      const res = await API.post("/ai/suggest", { symptom });

      setAiMedicines(res.data.data || []);
    } catch {
      alert("AI failed");
    } finally {
      setAiLoading(false);
    }
  };

  // ✅ APPROVE
  const approveMedicine = (med) => {
    setMedicines((prev) => [...prev, med]);
  };

  // ❌ REJECT
  const rejectMedicine = (index) => {
    setAiMedicines((prev) => prev.filter((_, i) => i !== index));
  };

  // ✏️ EDIT
  const editMedicine = (index, field, value) => {
    const updated = [...aiMedicines];
    updated[index][field] = value;
    setAiMedicines(updated);
  };

  // ❌ REMOVE FINAL
  const removeMedicine = (index) => {
    setMedicines((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <>
      <Navbar />

      <div className="p-6 max-w-4xl mx-auto bg-white shadow rounded">

        <h2 className="text-2xl font-bold mb-4">
          Smart AI Prescription
        </h2>

        {/* ⚠️ WARNING */}
        <div className="bg-yellow-100 text-yellow-700 p-3 rounded mb-4">
          ⚠️ AI suggestions are for assistance only. Doctor must verify.
        </div>

        {/* SYMPTOM */}
        <select
          value={symptom}
          onChange={(e) => setSymptom(e.target.value)}
          className="w-full border p-2 rounded"
        >
          <option value="">Select Symptom</option>
          {ALL_SYMPTOMS.map((s, i) => (
            <option key={i}>{s}</option>
          ))}
        </select>

        {/* AI BUTTON */}
        <button
          onClick={getAISuggestion}
          className="mt-3 bg-purple-600 text-white px-4 py-2 rounded"
        >
          {aiLoading ? "Thinking..." : "🤖 AI Suggest"}
        </button>

        {/* CLEAR AI */}
        {aiMedicines.length > 0 && (
          <button
            onClick={() => setAiMedicines([])}
            className="ml-3 bg-gray-500 text-white px-3 py-2 rounded"
          >
            Clear AI
          </button>
        )}

        {/* AI RESULT */}
        {aiMedicines.length > 0 && (
          <div className="mt-4 border p-4 rounded bg-gray-50">
            <h3 className="font-bold mb-3">AI Suggestions</h3>

            {aiMedicines.map((med, index) => (
              <div key={index} className="border p-3 mb-3 rounded">

                {/* CONFIDENCE */}
                <p className={`text-sm font-bold ${med.confidence < 60 ? "text-red-500" : "text-green-600"
                  }`}>
                  Confidence: {med.confidence || 70}%
                </p>

                {/* EDIT FIELDS */}
                <input
                  value={med.name}
                  onChange={(e) =>
                    editMedicine(index, "name", e.target.value)
                  }
                  className="border p-1 w-full mt-1"
                />

                <input
                  value={med.dosage}
                  onChange={(e) =>
                    editMedicine(index, "dosage", e.target.value)
                  }
                  className="border p-1 w-full mt-1"
                />

                <input
                  value={med.duration}
                  onChange={(e) =>
                    editMedicine(index, "duration", e.target.value)
                  }
                  className="border p-1 w-full mt-1"
                />

                {/* ACTIONS */}
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={() => approveMedicine(med)}
                    className="bg-green-500 text-white px-3 py-1 rounded"
                  >
                    ✔ Approve
                  </button>

                  <button
                    onClick={() => rejectMedicine(index)}
                    className="bg-red-500 text-white px-3 py-1 rounded"
                  >
                    ❌ Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* FINAL PRESCRIPTION */}
        <div className="mt-5">
          <h3 className="font-bold">Final Prescription</h3>

          {medicines.map((m, i) => (
            <div key={i} className="flex justify-between border p-2 mt-2">
              <div>
                {m.name} - {m.dosage} ({m.duration})
              </div>

              <button
                onClick={() => removeMedicine(i)}
                className="text-red-500"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
