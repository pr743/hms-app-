import React, { useEffect, useState } from "react";
import API from "../api/axios";
import Navbar from "../components/Navbar";
import { UserCheck, UserX } from "lucide-react";
import { useNavigate } from "react-router-dom";

function Doctors() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);



  const navigate = useNavigate();

  const fetchDoctors = async () => {
    try {
      const res = await API.get("/admin/doctors");


      setDoctors(res.data.data.filter(doc => doc.user?.isActive));

    } catch {
      console.error("Failed to fetch doctors");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);


  const toggleStatus = async (userId) => {
    try {
      await API.patch(`/admin/users/${userId}/toggle`);


      setDoctors(prev =>
        prev.filter(doc => doc.user._id !== userId)
      );
    } catch {
      console.error("Failed to update status");
    }
  };


  const deleteDoctor = async (userId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this doctor?"
    );

    if (!confirmDelete) return;

    try {
      await API.delete(`/admin/users/${userId}`);


      setDoctors(prev =>
        prev.filter(doc => doc.user._id !== userId)
      );
    } catch {
      console.error("Failed to delete doctor");
    }
  };

  return (
    <>
      <Navbar />

      <div className="p-4 md:p-6 bg-gray-100 min-h-screen">
        <h1 className="text-2xl md:text-3xl font-bold mb-6">
          Doctors Management
        </h1>

        {loading ? (
          <p>Loading doctors...</p>
        ) : (
          <>

            <div className="hidden md:block bg-white rounded-xl shadow-md overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-6 py-3">Name</th>
                    <th className="px-6 py-3">Email</th>
                    <th className="px-6 py-3">Specialization</th>
                    <th className="px-6 py-3">Action</th>
                  </tr>
                </thead>

                <tbody>
                  {doctors.map((doc) => (
                    <tr key={doc._id} className="border-t">
                      <td className="px-6 py-4">{doc.user?.name}</td>
                      <td className="px-6 py-4">{doc.user?.email}</td>
                      <td className="px-6 py-4">
                        {doc.specialization || "—"}
                      </td>

                      <td className="px-6 py-4 flex gap-2">

                        <button
                          onClick={() => toggleStatus(doc.user._id)}
                          className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg"
                        >
                          <UserX size={16} /> Deactivate
                        </button>



                        {/* <button
                          onClick={() => navigate(`/admin/doctors/edit/${doc.user._id}`)}
                          className="px-4 py-2 bg-blue-500 text-white rounded-lg"
                        >
                          Edit
                        </button> */}


                        <button
                          onClick={() => navigate(`/admin/doctors/edit/${doc._id}`)}
                          className="px-4 py-2 bg-blue-500 text-white rounded-lg"
                        >
                          Edit
                        </button>


                        <button
                          onClick={() => deleteDoctor(doc.user._id)}
                          className="px-4 py-2 bg-black text-white rounded-lg"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}

                  {doctors.length === 0 && (
                    <tr>
                      <td colSpan="4" className="text-center py-6">
                        No doctors found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>


            <div className="md:hidden space-y-4">
              {doctors.map((doc) => (
                <div key={doc._id} className="bg-white p-4 rounded-xl shadow">
                  <p className="font-semibold">{doc.user?.name}</p>
                  <p className="text-sm text-gray-500">
                    {doc.user?.email}
                  </p>

                  <p className="text-sm mt-2">
                    {doc.specialization || "—"}
                  </p>

                  <button
                    onClick={() => toggleStatus(doc.user._id)}
                    className="w-full mt-3 bg-red-500 text-white py-2 rounded-lg"
                  >
                    Deactivate
                  </button>

                  <button
                    onClick={() => deleteDoctor(doc.user._id)}
                    className="w-full mt-2 bg-black text-white py-2 rounded-lg"
                  >
                    Delete
                  </button>
                </div>
              ))}

              {doctors.length === 0 && (
                <p className="text-center">No doctors found</p>
              )}
            </div>
          </>
        )}
      </div>
    </>
  );
}

export default Doctors;




