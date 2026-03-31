import React, { useEffect, useState } from "react";
import API from "../api/axios";
import Navbar from "../components/Navbar";
import { UserCheck, UserX } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { Helmet } from "react-helmet-async";

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
    const result = await Swal.fire({
      title: "Deactivate Doctor?",
      text: "This doctor will be removed from active list",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, deactivate",
    });

    if (!result.isConfirmed) return;

    try {
      await API.patch(`/admin/users/${userId}/toggle`);

      setDoctors(prev =>
        prev.filter(doc => doc.user._id !== userId)
      );

      Swal.fire({
        icon: "success",
        title: "Updated",
        text: "Doctor deactivated successfully",
        timer: 1500,
        showConfirmButton: false,
      });

    } catch (error) {
      console.error("Failed to update status", error);

      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to update status ❌",
      });
    }
  };


  const deleteDoctor = async (userId) => {
    const result = await Swal.fire({
      title: "Delete Doctor?",
      text: "Are you sure you want to delete this doctor?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#000",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, delete",
    });

    if (!result.isConfirmed) return;

    try {
      await API.delete(`/admin/users/${userId}`);

      setDoctors(prev =>
        prev.filter(doc => doc.user._id !== userId)
      );

      Swal.fire({
        icon: "success",
        title: "Deleted",
        text: "Doctor deleted successfully",
        timer: 1500,
        showConfirmButton: false,
      });

    } catch (error) {
      console.error("Failed to delete doctor", error);

      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to delete doctor ❌",
      });
    }
  };

  return (
    <>
      <Helmet>
        <title>Doctors Management Dashboard | HMS Admin</title>

        <meta
          name="description"
          content="Manage doctors in your hospital system. Activate, deactivate, edit, and monitor doctors efficiently using the HMS admin dashboard."
        />

        <meta
          name="keywords"
          content="Doctors Management, Admin Dashboard, Hospital Management System, Manage Doctors, Healthcare Admin Panel, Doctor Control System"
        />

        <meta name="author" content="HMS System" />

        <meta property="og:title" content="Doctors Dashboard | HMS Admin" />
        <meta
          property="og:description"
          content="Control doctor access, manage profiles, and monitor healthcare system performance."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://yourdomain.com/admin/doctors" />


        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content="Doctors Dashboard | HMS" />
        <meta
          name="twitter:description"
          content="Admin panel to manage doctors in hospital system."
        />
      </Helmet>

      <Navbar />

      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 px-4 py-10">

        <div className="max-w-6xl mx-auto">

          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6 mb-6 shadow-2xl">
            <h1 className="text-3xl font-bold text-white">
              👨‍⚕️ Doctors Management Dashboard
            </h1>
            <p className="text-gray-300 text-sm mt-1">
              Manage active doctors, control access & monitor system
            </p>
          </div>

          {loading ? (
            <div className="text-white text-center py-20 text-lg">
              Loading doctors...
            </div>
          ) : (
            <>
              <div className="hidden md:block bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl overflow-hidden">

                <table className="w-full text-left text-white">

                  <thead className="bg-white/10 text-gray-300">
                    <tr>
                      <th className="px-6 py-4">Doctor</th>
                      <th className="px-6 py-4">Email</th>
                      <th className="px-6 py-4">Specialization</th>
                      <th className="px-6 py-4">Actions</th>
                    </tr>
                  </thead>

                  <tbody>
                    {doctors.map((doc) => (
                      <tr
                        key={doc._id}
                        className="border-t border-white/10 hover:bg-white/5 transition"
                      >

                        <td className="px-6 py-5 font-semibold">
                          👨‍⚕️ {doc.user?.name}
                        </td>

                        <td className="px-6 py-5 text-gray-300">
                          {doc.user?.email}
                        </td>

                        <td className="px-6 py-5 text-gray-300">
                          {doc.specialization || "—"}
                        </td>

                        <td className="px-6 py-5 flex gap-2 flex-wrap">

                          <button
                            onClick={() => toggleStatus(doc.user._id)}
                            className="px-4 py-2 rounded-xl bg-gradient-to-r from-red-500 to-pink-600 text-white shadow-lg hover:scale-105 transition"
                          >
                            <UserX size={16} className="inline mr-1" />
                            Deactivate
                          </button>

                          <button
                            onClick={() => navigate(`/admin/doctors/edit/${doc._id}`)}
                            className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg hover:scale-105 transition"
                          >
                            Edit
                          </button>

                          <button
                            onClick={() => deleteDoctor(doc.user._id)}
                            className="px-4 py-2 rounded-xl bg-black border border-white/20 text-white shadow-lg hover:scale-105 transition"
                          >
                            Delete
                          </button>

                        </td>
                      </tr>
                    ))}

                    {doctors.length === 0 && (
                      <tr>
                        <td colSpan="4" className="text-center py-10 text-gray-300">
                          No doctors found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              <div className="md:hidden space-y-4">

                {doctors.map((doc) => (
                  <div
                    key={doc._id}
                    className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-5 shadow-xl"
                  >

                    <div className="mb-3">
                      <p className="text-white font-bold text-lg">
                        👨‍⚕️ {doc.user?.name}
                      </p>
                      <p className="text-gray-300 text-sm">
                        {doc.user?.email}
                      </p>
                      <p className="text-gray-400 text-sm mt-1">
                        {doc.specialization || "No specialization"}
                      </p>
                    </div>

                    <div className="grid grid-cols-1 gap-2">

                      <button
                        onClick={() => toggleStatus(doc.user._id)}
                        className="w-full py-2 rounded-xl bg-gradient-to-r from-red-500 to-pink-600 text-white font-medium"
                      >
                        <UserX size={16} className="inline mr-1" />
                        Deactivate
                      </button>

                      <button
                        onClick={() => navigate(`/admin/doctors/edit/${doc._id}`)}
                        className="w-full py-2 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-medium"
                      >
                        Edit Doctor
                      </button>

                      <button
                        onClick={() => deleteDoctor(doc.user._id)}
                        className="w-full py-2 rounded-xl bg-black border border-white/20 text-white"
                      >
                        Delete
                      </button>

                    </div>
                  </div>
                ))}

                {doctors.length === 0 && (
                  <p className="text-center text-white">No doctors found</p>
                )}

              </div>

            </>
          )}
        </div>
      </div>
    </>
  );
}

export default Doctors;




