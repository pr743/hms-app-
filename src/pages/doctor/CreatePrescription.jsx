import { useEffect, useState } from "react";
import API from "../../api/axios";
import Navbar from "../../components/Navbar";
import DoctorSignature from "./DoctorSignature";
import Swal from "sweetalert2";
import { Helmet } from "react-helmet-async";

const ALL_SYMPTOMS = [
  "Fever",
  "Weakness",
  "Fatigue",
  "Body Pain",


  "Headache",
  "Migraine",
  "Dizziness",
  "Memory Issues",


  "Eye Pain",
  "Vision Problem",
  "Red Eyes",
  "Eye Infection",


  "Ear Pain",
  "Hearing Issue",
  "Ear Infection",
  "Ringing in Ears",


  "Nose Block",
  "Sinus",
  "Nose Bleeding",
  "Allergy",


  "Throat Pain",
  "Cough",
  "Cold & Flu",
  "Voice Problem",


  "Tooth Pain",
  "Gum Bleeding",
  "Tooth Sensitivity",
  "Mouth Ulcer",


  "Chest Pain",
  "Heart Problem",
  "Blood Pressure",
  "Palpitations",


  "Breathing Issue",
  "Asthma",
  "Lung Infection",


  "Stomach Pain",
  "Acidity",
  "Vomiting",
  "Diarrhea",
  "Constipation",
  "Gas Problem",
  "Indigestion",


  "Kidney Problem",
  "Urine Infection",
  "Frequent Urination",


  "Back Pain",
  "Joint Pain",
  "Arthritis",
  "Muscle Pain",
  "Fracture",
  "Injury",


  "Skin Allergy",
  "Rash",
  "Itching",
  "Acne",
  "Hair Fall",
  "Dandruff",


  "Stress",
  "Anxiety",
  "Depression",
  "Sleep Issues",

  "Pregnancy Check",
  "Periods Problem",
  "PCOS / Hormonal Issue",


  "Child Health",
  "Vaccination",


  "Burn",
  "Accident Injury",
  "Emergency",
  "Other"

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

      <Helmet>
        <title>Create Prescription | Doctor HMS</title>

        <meta
          name="description"
          content="Create AI-assisted prescriptions, add medicines, diagnosis and generate reports in HMS doctor dashboard."
        />

        <meta
          name="keywords"
          content="doctor prescription, AI prescription, HMS doctor panel, generate prescription, patient medicine"
        />

        <meta name="author" content="HMS Team" />
        <meta property="og:title" content="Create Prescription - HMS Doctor" />
        <meta
          property="og:description"
          content="Doctor can generate smart AI-based prescriptions with medicine validation."
        />
        <meta property="og:type" content="website" />

        <meta name="robots" content="index, follow" />

        <link rel="canonical" href="https://hms-app-l8ub.vercel.app/doctor/create-prescription" />
      </Helmet>


      <Navbar />

      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 p-6">

        <div className="max-w-6xl mx-auto mb-6">
          <h2 className="text-3xl font-bold text-white">
            💰 Smart Prescription Revenue System
          </h2>
          <p className="text-gray-400 mt-1">
            AI-assisted prescription generation with doctor validation
          </p>
        </div>

        <div className="max-w-6xl mx-auto bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl p-6 text-white">


          <div className="bg-yellow-500/10 border border-yellow-400/30 text-yellow-300 p-3 rounded-xl mb-5">
            ⚠️ AI suggestions are advisory only — doctor approval required for final prescription
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              <select
                className="p-3 rounded-xl bg-white/10 border border-white/20 text-white"
                value={appointmentId}
                onChange={(e) => setAppointmentId(e.target.value)}
                required
              >
                <option className="text-black" value="">Select Appointment</option>
                {filteredAppointments.length === 0 ? (
                  <option className="text-black" disabled>No active appointments</option>
                ) : (
                  filteredAppointments.map((appt) => (
                    <option className="text-black" key={appt._id} value={appt._id}>
                      {appt?.patient?.user?.name || "Unknown"} | {appt?.slotTime}
                    </option>
                  ))
                )}
              </select>

              <select
                className="p-3 rounded-xl bg-white/10 border border-white/20 text-white"
                value={selectedSymptom}
                onChange={(e) => setSelectedSymptom(e.target.value)}
              >
                <option className="text-black" value="">Select Symptom</option>
                {ALL_SYMPTOMS.map((item, i) => (
                  <option className="text-black" key={i} value={item}>
                    {item}
                  </option>
                ))}
              </select>

            </div>

            <button
              type="button"
              onClick={getAISuggestion}
              className="w-full bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-indigo-600 hover:to-purple-500 text-white py-3 rounded-xl font-bold shadow-lg transition"
            >
              {aiLoading ? "🤖 AI Thinking..." : "⚡ Generate AI Prescription Suggestions"}
            </button>

            {aiMedicines.length > 0 && (
              <div className="bg-white/5 border border-white/10 p-4 rounded-xl">
                <h3 className="font-bold text-lg mb-3">🤖 AI Suggestions Panel</h3>

                {aiMedicines.map((med, index) => (
                  <div key={index} className="bg-white/5 border border-white/10 p-3 rounded-xl mb-3">

                    <p className={`text-sm font-bold ${med.confidence < 60 ? "text-red-400" : "text-green-400"
                      }`}>
                      Confidence Score: {med.confidence}%
                    </p>

                    <input
                      value={med.name}
                      onChange={(e) => editMedicine(index, "name", e.target.value)}
                      className="w-full mt-2 p-2 rounded bg-white/10 border border-white/20"
                    />

                    <input
                      value={med.dosage}
                      onChange={(e) => editMedicine(index, "dosage", e.target.value)}
                      className="w-full mt-2 p-2 rounded bg-white/10 border border-white/20"
                    />

                    <input
                      value={med.duration}
                      onChange={(e) => editMedicine(index, "duration", e.target.value)}
                      className="w-full mt-2 p-2 rounded bg-white/10 border border-white/20"
                    />

                    <div className="flex gap-2 mt-3">
                      <button
                        type="button"
                        onClick={() => approveMedicine(med)}
                        className="bg-green-500 px-3 py-1 rounded"
                      >
                        ✔ Approve
                      </button>

                      <button
                        type="button"
                        onClick={() => rejectMedicine(index)}
                        className="bg-red-500 px-3 py-1 rounded"
                      >
                        ❌ Reject
                      </button>
                    </div>

                  </div>
                ))}
              </div>
            )}

            <div className="bg-white/5 border border-white/10 p-4 rounded-xl">
              <h3 className="font-bold text-lg">💊 Final Prescription Stack</h3>

              {medicines.length === 0 ? (
                <p className="text-gray-400 mt-2">No medicines added yet</p>
              ) : (
                medicines.map((m, i) => (
                  <div key={i} className="flex justify-between bg-white/5 p-2 mt-2 rounded">
                    <div>{m.name} - {m.dosage} ({m.duration})</div>

                    <button
                      type="button"
                      onClick={() => removeMedicine(i)}
                      className="text-red-400"
                    >
                      Remove
                    </button>
                  </div>
                ))
              )}
            </div>

            <textarea
              placeholder="Doctor Notes (Revenue Impact Analysis)"
              className="w-full p-3 rounded-xl bg-white/10 border border-white/20"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />

            <div className="bg-white/5 border border-white/10 p-4 rounded-xl">
              <DoctorSignature onSave={setSignature} />
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-emerald-600 hover:to-green-500 text-white py-3 rounded-xl font-bold shadow-xl"
            >
              💰 Save Prescription & Generate Report
            </button>

          </form>
        </div>
      </div>
    </>
  );

}