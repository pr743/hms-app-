import { useLocation, useNavigate } from "react-router-dom";
import API from "../api/axios";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";

function CreatePatientProfile() {
  const location = useLocation();
  const navigate = useNavigate();

  const [hospitals, setHospitals] = useState([]);

  const [form, setForm] = useState({
    age: "",
    gender: "",
    bloodGroup: "",
    hospitalId: "",
  });

  const message = location.state?.info;


  useEffect(() => {
    const fetchHospitals = async () => {
      try {
        const res = await API.get("/patient/hospitals");
        const data = res.data.data || [];

        setHospitals(data);


        if (data.length > 0) {
          setForm((prev) => ({
            ...prev,
            hospitalId: data[0]._id,
          }));
        }
      } catch (err) {
        console.error("Hospital fetch error", err);
      }
    };

    fetchHospitals();
  }, []);


  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      console.log("FORM DATA:", form);

      const payload = {
        age: Number(form.age),
        gender: form.gender,
        bloodGroup: form.bloodGroup,
        hospital: form.hospitalId,
      };

      await API.post("/patient/profile", payload);

      Swal.fire({
        icon: "success",
        title: "Profile Created",
        text: "Profile created successfully ✅",
        timer: 1500,
        showConfirmButton: false,
      });

      navigate("/patient/dashboard", { replace: true });

    } catch (err) {
      console.error(err);

      Swal.fire({
        icon: "error",
        title: "Profile Error",
        text: err.response?.data?.message || "Failed to create profile",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md">

        {message && (
          <div className="mb-4 p-3 bg-blue-100 text-blue-700 rounded-lg">
            {message}
          </div>
        )}

        <h1 className="text-2xl font-bold mb-4">
          Complete Your Profile
        </h1>

        <form onSubmit={handleSubmit} className="space-y-3">

          <input
            name="age"
            placeholder="Age"
            value={form.age}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          />


          <select
            name="gender"
            value={form.gender}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          >
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>


          {/* <input
            name="bloodGroup"
            placeholder="Blood Group"
            value={form.bloodGroup}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          /> */}


          <select
            name="bloodGroup"
            value={form.bloodGroup}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          >
            <option value="">Select Blood Group</option>
            <option value="A+">A+</option>
            <option value="A-">A-</option>
            <option value="B+">B+</option>
            <option value="B-">B-</option>
            <option value="O+">O+</option>
            <option value="O-">O-</option>
            <option value="AB+">AB+</option>
            <option value="AB-">AB-</option>
          </select>


          <select
            name="hospitalId"
            value={form.hospitalId}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          >
            <option value="">Select Hospital</option>

            {hospitals.map((h) => (
              <option key={h._id} value={h._id}>
                {h.name} ({h.city})
              </option>
            ))}
          </select>

          <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">
            Save & Continue
          </button>
        </form>
      </div>
    </div>
  );
}

export default CreatePatientProfile;