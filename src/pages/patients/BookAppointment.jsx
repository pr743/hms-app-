import React, { useEffect, useState } from "react";
import { Calendar, Clock, User, FileText } from "lucide-react";
import API from "../../api/axios";
import Navbar from "../../components/Navbar";
import Swal from "sweetalert2";

function BookAppointment() {
  const [hospitals, setHospitals] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [slots, setSlots] = useState([]);

  const [loadingSlots, setLoadingSlots] = useState(false);

  const [form, setForm] = useState({
    hospitalId: "",
    doctorId: "",
    appointmentDate: "",
    slotTime: "",
    reason: "",
    appointmentType: "normal",
  });

  const reasonsList = [
    "Fever",
    "Cold & Cough",
    "Headache",
    "Migraine",
    "Body Pain",
    "Back Pain",
    "Chest Pain",
    "Stomach Pain",
    "Acidity",
    "Vomiting",
    "Diarrhea",
    "Constipation",
    "Skin Allergy",
    "Rash",
    "Itching",
    "Hair Fall",
    "Eye Pain",
    "Vision Problem",
    "Ear Pain",
    "Hearing Issue",
    "Nose Block",
    "Sinus",
    "Throat Pain",
    "Diabetes Check",
    "Blood Pressure",
    "Heart Problem",
    "Asthma",
    "Breathing Issue",
    "Kidney Problem",
    "Urine Infection",
    "Joint Pain",
    "Arthritis",
    "Fracture",
    "Injury",
    "Burn",
    "Pregnancy Check",
    "Child Health",
    "General Checkup",
    "Weakness",
    "Stress",
    "Anxiety",
    "Depression",
    "Other"
  ];

  useEffect(() => {
    const fetchHospitals = async () => {
      try {
        const res = await API.get("/patient/hospitals");
        setHospitals(Array.isArray(res.data.data) ? res.data.data : []);
      } catch (err) {
        console.error("Failed to load hospitals", err);
      }
    };
    fetchHospitals();
  }, []);

  useEffect(() => {
    if (!form.hospitalId) {
      setDoctors([]);
      return;
    }

    const fetchDoctors = async () => {
      try {
        const res = await API.get(
          `/patient/hospitals/${form.hospitalId}/doctors`,
        );

        const docs = Array.isArray(res.data.data) ? res.data.data : [];
        setDoctors(docs);

        setForm((prev) => ({ ...prev, doctorId: "" }));
      } catch (err) {
        console.error("Failed to load doctors", err);
        setDoctors([]);
      }
    };

    fetchDoctors();
  }, [form.hospitalId]);



  useEffect(() => {
    const fetchSlots = async () => {
      if (!form.doctorId || !form.appointmentDate) return;


      try {
        setLoadingSlots(true);

        const res = await API.get(
          `/appointments/available-slots?doctorId=${form.doctorId}&date=${form.appointmentDate}`,
        );


        setSlots(Array.isArray(res.data.data) ? res.data.data : []);
      } catch (error) {
        console.error("Failed to load slots", error);
        setSlots([]);
      } finally {
        setLoadingSlots(false);
      }

    };

    fetchSlots();

  }, [form.doctorId, form.appointmentDate]);





  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) return;

    try {
      setLoading(true);

      const res = await API.post("/patient/appointment", form);

      Swal.fire({
        icon: "success",
        title: "Booked",
        text: res.data.message,
      });

      setForm({
        hospitalId: "",
        doctorId: "",
        appointmentDate: "",
        slotTime: "",
        reason: "",
        appointmentType: "normal",
      });

      setSlots([]);
      setDoctors([]);
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Cannot Book Appointment",
        text:
          err.response?.data?.message ||
          "Something went wrong",
      });
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      <Navbar />

      <div className="p-6 bg-gray-100 min-h-screen flex justify-center">
        <div className="bg-white w-full max-w-xl p-8 rounded-2xl shadow-lg">
          <h1 className="text-2xl font-bold mb-6 text-gray-800">
            Book Appointment
          </h1>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block mb-1 font-medium">Appointment Type</label>
              <select
                name="appointmentType"
                value={form.appointmentType}
                onChange={handleChange}
                className="w-full bg-gray-100 p-3 rounded-lg outline-none"
                required
              >
                <option value="normal">Normal</option>
                <option value="emergency">Emergency (24×7)</option>
              </select>
            </div>

            <div>
              <label className="block mb-1 font-medium">Hospital</label>
              <div className="flex items-center bg-gray-100 rounded-lg px-3">
                <User className="text-gray-400 mr-2" size={18} />
                <select
                  name="hospitalId"
                  value={form.hospitalId}
                  onChange={handleChange}
                  className="w-full bg-transparent p-3 outline-none"
                  required
                >
                  <option value="" disabled>
                    Select hospital
                  </option>
                  {hospitals.map((h) => (
                    <option key={h._id} value={h._id}>
                      {h.name} ({h.city})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block mb-1 font-medium">Doctor</label>
              <div className="flex items-center bg-gray-100 rounded-lg px-3">
                <User className="text-gray-400 mr-2" size={18} />
                <select
                  name="doctorId"
                  value={form.doctorId}
                  onChange={handleChange}
                  className="w-full bg-transparent p-3 outline-none"
                  required
                >
                  <option value="" disabled>
                    {doctors.length === 0
                      ? "No doctors available"
                      : "Select Doctor"}
                  </option>

                  {doctors.map((doc) => (
                    <option key={doc._id} value={doc._id}>
                      {doc.user?.name} ({doc.specialization})
                    </option>
                  ))}
                </select>
              </div>

              {form.hospitalId && doctors.length === 0 && (
                <p className="text-sm text-red-500 mt-2">
                  No doctors available for this hospital
                </p>
              )}
            </div>

            <div>
              <label className="block mb-1 font-medium">Date</label>
              <div className="flex items-center bg-gray-100 rounded-lg px-3">
                <Calendar className="text-gray-400 mr-2" size={18} />
                <input
                  type="date"
                  name="appointmentDate"
                  value={form.appointmentDate}
                  onChange={handleChange}
                  className="w-full bg-transparent p-3 outline-none"
                  required
                />
              </div>
            </div>

            {form.appointmentType === "normal" && (
              <div>
                <label className="block mb-1 font-medium">Time Slot</label>
                <div className="flex items-center bg-gray-100 rounded-lg px-3">
                  <Clock className="text-gray-400 mr-2" size={18} />
                  <select
                    name="slotTime"
                    value={form.slotTime}
                    onChange={handleChange}
                    className="w-full bg-transparent p-3 outline-none"
                    required={form.appointmentType === "normal"}
                  >
                    <option value="" disabled>
                      Select Time
                    </option>

                    {loadingSlots ? (
                      <option disabled>Loading slots...</option>
                    ) : slots.length === 0 ? (
                      <option disabled>No slots available</option>
                    ) : (
                      slots.map((slot) => (
                        <option
                          key={slot.time}
                          value={slot.time}
                          disabled={slot.isFull}
                        >
                          {slot.time} ({slot.availableSpots} Left)
                        </option>
                      ))
                    )}
                  </select>



                </div>
              </div>
            )}

            {form.appointmentType === "emergency" && (
              <p className="text-red-500 font-semibold">
                Emergency appointments are available 24×7 and given priority.
              </p>
            )}

            <div>
              <label className="block mb-1 font-medium">Reason</label>
              <div className="flex items-start bg-gray-100 rounded-lg px-3">
                <FileText className="text-gray-400 mr-2 mt-3" size={18} />

                <select
                  name="reason"
                  value={form.reason}
                  onChange={handleChange}
                  className="w-full bg-transparent p-3 outline-none"
                  required
                >
                  <option value="">Select problem</option>
                  {reasonsList.map((r, i) => (
                    <option key={i} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <button
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold transition"
            >
              {loading ? "Booking..." : "Book Appointment"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

export default BookAppointment;


























