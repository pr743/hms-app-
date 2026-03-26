import { useEffect, useState } from "react";
import API from "../../api/axios";
import Navbar from "../../components/Navbar";

export default function CreatePrescription() {
  const [appointments, setAppointments] = useState([]);
  const [appointmentId, setAppointmentId] = useState("");

  const [diagnosis, setDiagnosis] = useState("");
  const [notes, setNotes] = useState("");

  const [medicines, setMedicines] = useState([
    { name: "", dosage: "", duration: "", instructions: "" },
  ]);


  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const res = await API.get("/prescriptions/doctor/appointments");

        console.log("Appointments:", res.data.data);

        setAppointments(res.data.data || []);
      } catch (err) {
        console.error("Failed to load appointments", err);
      }
    };

    fetchAppointments();
  }, []);

  const handleMedicineChange = (index, e) => {
    const values = [...medicines];
    values[index][e.target.name] = e.target.value;
    setMedicines(values);
  };

  const addMedicine = () => {
    setMedicines([
      ...medicines,
      { name: "", dosage: "", duration: "", instructions: "" },
    ]);
  };

  const removeMedicine = (index) => {
    const values = [...medicines];
    values.splice(index, 1);
    setMedicines(values);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await API.post("/prescriptions", {
        appointmentId,
        diagnosis,
        notes,
        medicines,
      });

      alert("Prescription Created ✅");


      setAppointments((prev) =>
        prev.filter((a) => a._id !== appointmentId)
      );

      setAppointmentId("");
      setDiagnosis("");
      setNotes("");
      setMedicines([
        { name: "", dosage: "", duration: "", instructions: "" },
      ]);
    } catch {
      alert("Error creating prescription ❌");
    }
  };

  return (
    <>
      <Navbar />

      <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
        <h2 className="text-2xl font-bold mb-4">
          Create Prescription
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">


          <select
            className="w-full border p-2 rounded"
            value={appointmentId}
            onChange={(e) => setAppointmentId(e.target.value)}
            required
          >
            <option value="">Select Appointment</option>

            {appointments.length === 0 ? (
              <option disabled>No completed appointments</option>
            ) : (
              appointments.map((appt) => (
                <option key={appt._id} value={appt._id}>

                  {appt?.patient?.user?.name || "Unknown"} |{" "}
                  {appt?.slotTime || "No Time"}
                </option>
              ))
            )}
          </select>


          <textarea
            placeholder="Diagnosis"
            className="w-full border p-2 rounded"
            value={diagnosis}
            onChange={(e) => setDiagnosis(e.target.value)}
          />


          <textarea
            placeholder="Notes"
            className="w-full border p-2 rounded"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />


          <h3 className="text-lg font-semibold">Medicines</h3>

          {medicines.map((med, index) => (
            <div key={index} className="border p-3 rounded space-y-2">
              <input
                name="name"
                placeholder="Medicine Name"
                className="w-full border p-2 rounded"
                value={med.name}
                onChange={(e) => handleMedicineChange(index, e)}
                required
              />

              <div className="grid grid-cols-2 gap-2">
                <input
                  name="dosage"
                  placeholder="Dosage"
                  className="border p-2 rounded"
                  value={med.dosage}
                  onChange={(e) => handleMedicineChange(index, e)}
                  required
                />

                <input
                  name="duration"
                  placeholder="Duration"
                  className="border p-2 rounded"
                  value={med.duration}
                  onChange={(e) => handleMedicineChange(index, e)}
                  required
                />
              </div>

              <input
                name="instructions"
                placeholder="Instructions"
                className="w-full border p-2 rounded"
                value={med.instructions}
                onChange={(e) => handleMedicineChange(index, e)}
              />

              {medicines.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeMedicine(index)}
                  className="text-red-500 text-sm"
                >
                  Remove
                </button>
              )}
            </div>
          ))}

          <button
            type="button"
            onClick={addMedicine}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            + Add Medicine
          </button>

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