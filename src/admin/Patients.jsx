import React, { useEffect, useState } from "react";
import API from "../api/axios";
import Navbar from "../components/Navbar";
import { User, Mail, ShieldCheck, ShieldOff } from "lucide-react";
import Swal from "sweetalert2";

function Patients() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPatients = async () => {
    try {
      const res = await API.get("/admin/patients");
      setPatients(res.data.data || []);
      console.log("Patients loaded:", res.data);
    } catch {
      console.error("Failed to load patients");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  })
  const toggleStatus = async (userId) => {
    const result = await Swal.fire({
      title: "Change Status?",
      text: "Do you want to update patient status?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#2563eb",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, update",
    });

    if (!result.isConfirmed) return;

    try {
      await API.patch(`/admin/users/${userId}/toggle`);

      fetchPatients();

      Swal.fire({
        icon: "success",
        title: "Updated",
        text: "Patient status updated",
        timer: 1200,
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



  const deletePatient = async (userId) => {
    const result = await Swal.fire({
      title: "Delete Patient?",
      text: "Are you sure you want to delete this patient?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#000",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, delete",
    });

    if (!result.isConfirmed) return;

    try {
      await API.delete(`/admin/patients/${userId}`);

      setPatients((prev) =>
        prev.filter((p) => p.user._id !== userId)
      );

      Swal.fire({
        icon: "success",
        title: "Deleted",
        text: "Patient deleted successfully",
        timer: 1200,
        showConfirmButton: false,
      });

    } catch (error) {
      console.error("Delete failed", error);

      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to delete patient ❌",
      });
    }
  };

return (
  <>
    <Navbar />

    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 px-4 py-10">

      <div className="max-w-7xl mx-auto">

        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6 mb-8 shadow-2xl">
          <h1 className="text-3xl font-bold text-white">
            🧑‍⚕️ Patients Management Dashboard
          </h1>
          <p className="text-gray-300 text-sm mt-1">
            Monitor, block, activate and manage patient accounts
          </p>
        </div>

        {loading ? (
          <div className="text-center text-white text-lg py-20">
            Loading patients...
          </div>
        ) : (
          <>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

              {patients.map((patient) => (
                <div
                  key={patient._id}
                  className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6 shadow-2xl hover:scale-[1.02] transition"
                >

                  <div className="flex items-center gap-4 mb-5">

                    <div className="bg-blue-500/20 p-3 rounded-2xl">
                      <User className="text-blue-400" size={28} />
                    </div>

                    <div>
                      <h2 className="text-white font-bold text-lg">
                        {patient.user?.name || "N/A"}
                      </h2>
                      <p className="text-gray-300 text-sm">
                        {patient.gender || "—"} • {patient.age || "—"} yrs
                      </p>
                    </div>

                  </div>

                  <div className="flex items-center gap-2 text-gray-300 mb-5">
                    <Mail size={18} className="text-blue-400" />
                    <span className="text-sm break-all">
                      {patient.user?.email}
                    </span>
                  </div>

                  <div className="mb-5">
                    <span
                      className={`px-4 py-1 rounded-full text-xs font-bold tracking-wide
                      ${
                        patient.user?.isActive
                          ? "bg-green-500/20 text-green-400 border border-green-400/30"
                          : "bg-red-500/20 text-red-400 border border-red-400/30"
                      }`}
                    >
                      {patient.user?.isActive ? "ACTIVE USER" : "BLOCKED USER"}
                    </span>
                  </div>

                  <div className="space-y-3">

                    <button
                      onClick={() => toggleStatus(patient.user._id)}
                      className={`w-full py-3 rounded-2xl font-semibold text-white shadow-xl transition hover:scale-[1.02]
                      ${
                        patient.user?.isActive
                          ? "bg-gradient-to-r from-red-500 to-pink-600"
                          : "bg-gradient-to-r from-green-500 to-emerald-600"
                      }`}
                    >
                      {patient.user?.isActive ? (
                        <>
                          <ShieldOff className="inline mr-2" size={18} />
                          Block Patient
                        </>
                      ) : (
                        <>
                          <ShieldCheck className="inline mr-2" size={18} />
                          Activate Patient
                        </>
                      )}
                    </button>


                    {!patient.user?.isActive && (
                      <button
                        onClick={() => deletePatient(patient.user._id)}
                        className="w-full py-3 rounded-2xl font-semibold text-white bg-black/60 border border-white/20 hover:bg-black transition"
                      >
                        🗑 Delete Account
                      </button>
                    )}

                  </div>

                </div>
              ))}

              {patients.length === 0 && (
                <div className="col-span-full text-center text-gray-300 py-20">
                  No patients found
                </div>
              )}

            </div>

          </>
        )}

      </div>
    </div>
  </>
);
}

export default Patients;
















