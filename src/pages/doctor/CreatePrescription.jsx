// import { useEffect, useState } from "react";
// import API from "../../api/axios";
// import Navbar from "../../components/Navbar";

// export default function CreatePrescription() {
//   const [appointments, setAppointments] = useState([]);
//   const [appointmentId, setAppointmentId] = useState("");

//   const [diagnosis, setDiagnosis] = useState("");
//   const [notes, setNotes] = useState("");

//   const [medicines, setMedicines] = useState([
//     { name: "", dosage: "", duration: "", instructions: "" },
//   ]);


//   useEffect(() => {
//     const fetchAppointments = async () => {
//       try {
//         const res = await API.get("/prescriptions/doctor/appointments");

//         console.log("Appointments:", res.data.data);

//         setAppointments(res.data.data || []);
//       } catch (err) {
//         console.error("Failed to load appointments", err);
//       }
//     };

//     fetchAppointments();
//   }, []);

//   const handleMedicineChange = (index, e) => {
//     const values = [...medicines];
//     values[index][e.target.name] = e.target.value;
//     setMedicines(values);
//   };

//   const addMedicine = () => {
//     setMedicines([
//       ...medicines,
//       { name: "", dosage: "", duration: "", instructions: "" },
//     ]);
//   };

//   const removeMedicine = (index) => {
//     const values = [...medicines];
//     values.splice(index, 1);
//     setMedicines(values);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     try {
//       await API.post("/prescriptions", {
//         appointmentId,
//         diagnosis,
//         notes,
//         medicines,
//       });

//       alert("Prescription Created ✅");


//       setAppointments((prev) =>
//         prev.filter((a) => a._id !== appointmentId)
//       );

//       setAppointmentId("");
//       setDiagnosis("");
//       setNotes("");
//       setMedicines([
//         { name: "", dosage: "", duration: "", instructions: "" },
//       ]);
//     } catch {
//       alert("Error creating prescription ❌");
//     }
//   };

//   return (
//     <>
//       <Navbar />

//       <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
//         <h2 className="text-2xl font-bold mb-4">
//           Create Prescription
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


//           <textarea
//             placeholder="Diagnosis"
//             className="w-full border p-2 rounded"
//             value={diagnosis}
//             onChange={(e) => setDiagnosis(e.target.value)}
//           />


//           <textarea
//             placeholder="Notes"
//             className="w-full border p-2 rounded"
//             value={notes}
//             onChange={(e) => setNotes(e.target.value)}
//           />


//           <h3 className="text-lg font-semibold">Medicines</h3>

//           {medicines.map((med, index) => (
//             <div key={index} className="border p-3 rounded space-y-2">
//               <input
//                 name="name"
//                 placeholder="Medicine Name"
//                 className="w-full border p-2 rounded"
//                 value={med.name}
//                 onChange={(e) => handleMedicineChange(index, e)}
//                 required
//               />

//               <div className="grid grid-cols-2 gap-2">
//                 <input
//                   name="dosage"
//                   placeholder="Dosage"
//                   className="border p-2 rounded"
//                   value={med.dosage}
//                   onChange={(e) => handleMedicineChange(index, e)}
//                   required
//                 />

//                 <input
//                   name="duration"
//                   placeholder="Duration"
//                   className="border p-2 rounded"
//                   value={med.duration}
//                   onChange={(e) => handleMedicineChange(index, e)}
//                   required
//                 />
//               </div>

//               <input
//                 name="instructions"
//                 placeholder="Instructions"
//                 className="w-full border p-2 rounded"
//                 value={med.instructions}
//                 onChange={(e) => handleMedicineChange(index, e)}
//               />

//               {medicines.length > 1 && (
//                 <button
//                   type="button"
//                   onClick={() => removeMedicine(index)}
//                   className="text-red-500 text-sm"
//                 >
//                   Remove
//                 </button>
//               )}
//             </div>
//           ))}

//           <button
//             type="button"
//             onClick={addMedicine}
//             className="bg-blue-500 text-white px-4 py-2 rounded"
//           >
//             + Add Medicine
//           </button>

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
  "Fever", "Cold", "Cough", "Headache", "Migraine",
  "Eye Pain", "Eye Infection", "Blur Vision",
  "Ear Pain", "Hearing Issue",
  "Chest Pain", "Heart Pain", "Breathing Problem",
  "Stomach Pain", "Acidity", "Vomiting", "Diarrhea",
  "Back Pain", "Joint Pain", "Muscle Pain",
  "Skin Allergy", "Rash", "Itching",
  "Diabetes", "High Blood Pressure", "Low BP",
  "Thyroid", "Weakness", "Fatigue",
  "Anxiety", "Depression", "Sleep Problem",
  "Tooth Pain", "Gum Infection",
  "Hair Fall", "Dandruff",
  "Kidney Pain", "Urine Infection",
  "Liver Problem",
  "Asthma", "Sinus",
  "Covid Symptoms",
];

export default function CreatePrescription() {
  const [search, setSearch] = useState("");
  const [selectedSymptom, setSelectedSymptom] = useState("");

  const [aiLoading, setAiLoading] = useState(false);
  const [aiMedicines, setAiMedicines] = useState([]);

  const [medicines, setMedicines] = useState([]);


  const filteredSymptoms = ALL_SYMPTOMS.filter((item) =>
    item.toLowerCase().includes(search.toLowerCase())
  );


  const getAISuggestion = async () => {
    const finalSymptom = selectedSymptom || search;

    if (!finalSymptom) {
      alert("Please select or type symptom ❌");
      return;
    }

    try {
      setAiLoading(true);
      setAiMedicines([]);

      const res = await API.post("/ai/suggest", {
        symptom: finalSymptom,
      });

      if (Array.isArray(res.data?.data)) {
        setAiMedicines(res.data.data);
      } else {
        setAiMedicines([]);
      }
    } catch (error) {
      console.error(error);
      alert("AI failed ❌");
    } finally {
      setAiLoading(false);
    }
  };

  // ➕ ADD MEDICINE
  const addMedicine = (med) => {
    setMedicines((prev) => [...prev, med]);
  };

  // ❌ REMOVE MEDICINE
  const removeMedicine = (index) => {
    setMedicines((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <>
      <Navbar />

      <div className="p-6 max-w-5xl mx-auto bg-white shadow rounded">

        <h2 className="text-2xl font-bold mb-4">
          🧠 Smart Prescription AI (Doctor Panel)
        </h2>

        {/* 🔍 SEARCH INPUT */}
        <input
          type="text"
          placeholder="Type symptom (e.g. heart pain, eye issue...)"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setSelectedSymptom("");
          }}
          className="w-full border p-2 rounded"
        />

        {/* 📋 SUGGESTION LIST */}
        {search && (
          <div className="border rounded mt-2 max-h-40 overflow-y-auto">
            {filteredSymptoms.length > 0 ? (
              filteredSymptoms.map((item, i) => (
                <div
                  key={i}
                  onClick={() => {
                    setSelectedSymptom(item);
                    setSearch(item);
                  }}
                  className="p-2 hover:bg-gray-100 cursor-pointer"
                >
                  {item}
                </div>
              ))
            ) : (
              <div className="p-2 text-gray-500">
                No match — will use custom input
              </div>
            )}
          </div>
        )}


        <button
          onClick={getAISuggestion}
          disabled={aiLoading}
          className="mt-4 w-full bg-purple-600 text-white py-2 rounded"
        >
          {aiLoading ? "Thinking..." : "🤖 Get AI Suggestion"}
        </button>

        {/* 🤖 AI RESULTS */}
        {aiMedicines.length > 0 && (
          <div className="mt-5 border p-4 rounded bg-gray-50">
            <h3 className="font-bold mb-3">AI Suggested Medicines</h3>

            {aiMedicines.map((med, index) => (
              <div
                key={index}
                className="flex justify-between items-center border p-2 mb-2 rounded"
              >
                <div>
                  <p className="font-semibold">{med.name}</p>
                  <p className="text-sm">
                    {med.dosage} - {med.duration}
                  </p>
                </div>

                <button
                  onClick={() => addMedicine(med)}
                  className="bg-green-500 text-white px-3 py-1 rounded"
                >
                  Add
                </button>
              </div>
            ))}
          </div>
        )}

        {/* 📦 FINAL PRESCRIPTION */}
        <div className="mt-6">
          <h3 className="font-bold text-lg">Final Prescription</h3>

          {medicines.length === 0 ? (
            <p className="text-gray-500 mt-2">No medicines added</p>
          ) : (
            medicines.map((m, i) => (
              <div
                key={i}
                className="flex justify-between items-center border p-2 mt-2 rounded"
              >
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
            ))
          )}
        </div>
      </div>
    </>
  );
}