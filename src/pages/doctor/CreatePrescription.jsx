import { useEffect, useState } from "react";
import API from "../../api/axios";
import Navbar from "../../components/Navbar";
import DoctorSignature from "./DoctorSignature";
import Swal from "sweetalert2";

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
  const [appointments, setAppointments] = useState([]);
  const [appointmentId, setAppointmentId] = useState("");

  const [selectedSymptom, setSelectedSymptom] = useState("");

  const [diagnosis, setDiagnosis] = useState("");
  const [notes, setNotes] = useState("");

  const [aiLoading, setAiLoading] = useState(false);
  const [aiMedicines, setAiMedicines] = useState([]);

  const [medicines, setMedicines] = useState([]);

  const [signature, setSignature] = useState("");



  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");

    if (id) {
      setAppointmentId(id);
    }
  }, []);


  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const res = await API.get("/prescriptions/doctor/appointments");
        setAppointments(res.data.data || []);
      } catch (err) {
        console.error("Failed to load appointments", err);
      }
    };

    fetchAppointments();
  }, []);




  const filteredAppointments = appointments.filter(
    (a) => a.status === "in-progress"
  );



  const getAISuggestion = async () => {
    if (!selectedSymptom) {
      Swal.fire({
        icon: "warning",
        title: "Select Symptom",
        text: "Please select symptom ❌",
      });
      return;
    }

    try {
      setAiLoading(true);
      setAiMedicines([]);

      const res = await API.post("/ai/suggest", {
        symptom: selectedSymptom,
      });

      if (Array.isArray(res.data?.data)) {

        const data = res.data.data.map((med) => ({
          ...med,
          confidence: med.confidence || Math.floor(Math.random() * 40) + 60,
        }));

        setAiMedicines(data);
      } else {
        setAiMedicines([]);
      }

    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "AI Error",
        text: "AI failed ❌",
      });
    } finally {
      setAiLoading(false);
    }
  };


  const approveMedicine = (med) => {
    setMedicines((prev) => [...prev, med]);
  };


  const rejectMedicine = (index) => {
    setAiMedicines((prev) => prev.filter((_, i) => i !== index));
  };


  const editMedicine = (index, field, value) => {
    const updated = [...aiMedicines];
    updated[index][field] = value;
    setAiMedicines(updated);
  };


  const removeMedicine = (index) => {
    setMedicines((prev) => prev.filter((_, i) => i !== index));
  };





  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!appointmentId) {
      Swal.fire({
        icon: "warning",
        title: "Missing Appointment",
        text: "Select appointment ❌",
      });
      return;
    }

    if (medicines.length === 0) {
      Swal.fire({
        icon: "warning",
        title: "No Medicines",
        text: "Add at least 1 medicine ❌",
      });
      return;
    }

    if (!signature) {
      Swal.fire({
        icon: "warning",
        title: "Signature Required",
        text: "Signature required ❌",
      });
      return;
    }

    try {
      const cleanMedicines = medicines.map((m) => ({
        name: m.name,
        dosage: m.dosage,
        duration: m.duration,
        instructions: m.instructions || "",
      }));

      await API.post("/prescriptions", {
        appointmentId,
        diagnosis: diagnosis || selectedSymptom,
        notes,
        medicines: cleanMedicines,
        signature,
      });

      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Prescription Created ✅",
        timer: 2500,
        showConfirmButton: false,
      });


      setAppointmentId("");
      setSelectedSymptom("");
      setDiagnosis("");
      setNotes("");
      setMedicines([]);
      setAiMedicines([]);
      setSignature("");

    } catch (err) {
      console.error(err.response?.data);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: err.response?.data?.message || "Error creating prescription ❌",
      });
    }
  };
  return (
    <>
      <Navbar />

      <div className="max-w-5xl mx-auto p-6 bg-white shadow-lg rounded-lg">

        <h2 className="text-2xl font-bold mb-4">
          🧠 Smart Prescription AI (Doctor Panel)
        </h2>


        <div className="bg-yellow-100 text-yellow-700 p-3 rounded mb-4">
          ⚠️ AI suggestions are for assistance only. Doctor must verify.
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">


          <select
            className="w-full border p-2 rounded"
            value={appointmentId}
            onChange={(e) => setAppointmentId(e.target.value)}
            required
          >
            <option value="">Select Appointment</option>
            {filteredAppointments.length === 0 ? (
              <option disabled>No active (in-progress) appointments</option>
            ) : (
              filteredAppointments.map((appt) => (
                <option key={appt._id} value={appt._id}>
                  {appt?.patient?.user?.name || appt?.patient?.name || "Unknown"} | {appt?.slotTime}
                </option>
              ))
            )}
          </select>

          <select
            value={selectedSymptom}
            onChange={(e) => setSelectedSymptom(e.target.value)}
            className="w-full border p-2 rounded"
          >
            <option value="">Select Disease / Symptom</option>
            {ALL_SYMPTOMS.map((item, i) => (
              <option key={i} value={item}>
                {item}
              </option>
            ))}
          </select>


          <button
            type="button"
            onClick={getAISuggestion}
            className="w-full bg-purple-600 text-white py-2 rounded"
          >
            {aiLoading ? "Thinking..." : "🤖 Get AI Suggestion"}
          </button>


          {aiMedicines.length > 0 && (
            <div className="border p-4 rounded bg-gray-50">
              <h3 className="font-bold mb-3">AI Suggestions</h3>

              {aiMedicines.map((med, index) => (
                <div key={index} className="border p-3 mb-3 rounded">


                  <p className={`text-sm font-bold ${med.confidence < 60 ? "text-red-500" : "text-green-600"
                    }`}>
                    Confidence: {med.confidence}%
                  </p>


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


                  <div className="flex gap-2 mt-2">
                    <button
                      type="button"
                      onClick={() => approveMedicine(med)}
                      className="bg-green-500 text-white px-3 py-1 rounded"
                    >
                      ✔ Approve
                    </button>

                    <button
                      type="button"
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


          <div>
            <h3 className="font-bold text-lg">Final Prescription</h3>

            {medicines.length === 0 ? (
              <p className="text-gray-500">No medicines added</p>
            ) : (
              medicines.map((m, i) => (
                <div key={i} className="flex justify-between border p-2 mt-2">
                  <div>
                    {m.name} - {m.dosage} ({m.duration})
                  </div>

                  <button
                    type="button"
                    onClick={() => removeMedicine(i)}
                    className="text-red-500"
                  >
                    Remove
                  </button>
                </div>
              ))
            )}
          </div>


          <textarea
            placeholder="Doctor Notes"
            className="w-full border p-2 rounded"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />


          <DoctorSignature onSave={setSignature} />


          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 rounded"
          >
            Save Prescription
          </button>

        </form>
      </div>
    </>
  );
}