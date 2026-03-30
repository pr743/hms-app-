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

      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 p-6">

        <div className="w-full max-w-2xl backdrop-blur-xl bg-white/70 border border-white/40 shadow-2xl rounded-3xl p-8">

          <h1 className="text-3xl font-bold text-white mb-2">
            Book Appointment
          </h1>
          <p className="text-gray-200 mb-6">
            Schedule your consultation with top doctors 🚀
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">

            <div>
              <label className="text-sm font-semibold text-gray-600">
                Appointment Type
              </label>
              <select
                name="appointmentType"
                value={form.appointmentType}
                onChange={handleChange}
                className="w-full mt-2 p-3 rounded-xl bg-white shadow-sm border focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="normal">Normal</option>
                <option value="emergency">Emergency 🚨</option>
              </select>
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-600">
                Hospital
              </label>
              <div className="flex items-center mt-2 bg-white border rounded-xl px-3 shadow-sm focus-within:ring-2 focus-within:ring-blue-500">
                <User className="text-gray-400" size={18} />
                <select
                  name="hospitalId"
                  value={form.hospitalId}
                  onChange={handleChange}
                  className="w-full p-3 bg-transparent outline-none"
                >
                  <option value="">Select hospital</option>
                  {hospitals.map((h) => (
                    <option key={h._id} value={h._id}>
                      {h.name} ({h.city})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-600">
                Doctor
              </label>
              <div className="flex items-center mt-2 bg-white border rounded-xl px-3 shadow-sm focus-within:ring-2 focus-within:ring-blue-500">
                <User className="text-gray-400" size={18} />
                <select
                  name="doctorId"
                  value={form.doctorId}
                  onChange={handleChange}
                  className="w-full p-3 bg-transparent outline-none"
                >
                  <option value="">
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
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-600">
                Date
              </label>
              <div className="flex items-center mt-2 bg-white border rounded-xl px-3 shadow-sm focus-within:ring-2 focus-within:ring-blue-500">
                <Calendar className="text-gray-400" size={18} />
                <input
                  type="date"
                  name="appointmentDate"
                  value={form.appointmentDate}
                  onChange={handleChange}
                  className="w-full p-3 bg-transparent outline-none"
                />
              </div>
            </div>

            {form.appointmentType === "normal" && (
              <div>
                <label className="text-sm font-semibold text-gray-600">
                  Time Slot
                </label>
                <div className="flex items-center mt-2 bg-white border rounded-xl px-3 shadow-sm focus-within:ring-2 focus-within:ring-blue-500">
                  <Clock className="text-gray-400" size={18} />
                  <select
                    name="slotTime"
                    value={form.slotTime}
                    onChange={handleChange}
                    className="w-full p-3 bg-transparent outline-none"
                  >
                    <option value="">Select Time</option>

                    {loadingSlots ? (
                      <option disabled>Loading...</option>
                    ) : slots.length === 0 ? (
                      <option disabled>No slots</option>
                    ) : (
                      slots.map((slot) => (
                        <option
                          key={slot.time}
                          value={slot.time}
                          disabled={slot.isFull}
                        >
                          {slot.time} ({slot.availableSpots} left)
                        </option>
                      ))
                    )}
                  </select>
                </div>
              </div>
            )}

            <div>
              <label className="text-sm font-semibold text-gray-600">
                Reason
              </label>
              <div className="flex items-start mt-2 bg-white border rounded-xl px-3 shadow-sm focus-within:ring-2 focus-within:ring-blue-500">
                <FileText className="text-gray-400 mt-3" size={18} />
                <select
                  name="reason"
                  value={form.reason}
                  onChange={handleChange}
                  className="w-full p-3 bg-transparent outline-none"
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
              className="w-full py-3 rounded-xl font-semibold text-white 
              bg-gradient-to-r from-blue-600 to-indigo-600 
              hover:from-blue-700 hover:to-indigo-700 
              shadow-lg transition duration-300"
            >
              {loading ? "Booking..." : "🚀 Book Appointment"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

export default BookAppointment;


























