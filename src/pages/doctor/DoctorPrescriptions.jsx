import React, { useEffect, useState } from "react";
import API from "../../api/axios";
import Navbar from "../../components/Navbar";
import Swal from "sweetalert2";

function DoctorPrescriptions() {
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPrescriptions = async () => {
    try {
      const res = await API.get("/prescriptions/doctor");
      setPrescriptions(res.data.data);
    } catch (error) {
      console.error("Failed to load prescriptions", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrescriptions();
  }, []);


  const downloadPDF = async (id) => {
    try {
      const res = await API.get(`/prescriptions/${id}/pdf`, {
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");

      link.href = url;
      link.setAttribute("download", `prescription-${id}.pdf`);
      document.body.appendChild(link);
      link.click();

      link.remove();


      Swal.fire({
        icon: "success",
        title: "Downloaded",
        text: "Prescription PDF downloaded ✅",
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error("Download failed", error);
      Swal.fire({
        icon: "error",
        title: "Download Failed",
        text: "Failed to download PDF ❌",
      });
    }
  };


  const deletePrescription = async (id) => {
    const result = await Swal.fire({
      title: "Delete Prescription?",
      text: "This action cannot be undone",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Delete",
    });

    if (!result.isConfirmed) return;

    try {
      await API.delete(`/prescriptions/${id}`);

      setPrescriptions((prev) =>
        prev.filter((p) => p._id !== id)
      );

      Swal.fire({
        icon: "success",
        title: "Deleted",
        text: "Prescription deleted successfully",
        timer: 1200,
        showConfirmButton: false,
      });

    } catch (error) {
      console.error("Delete failed", error);

      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to delete ❌",
      });
    }
  };

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 p-6">

        <div className="mb-8">
          <h1 className="text-4xl font-extrabold text-white tracking-tight">
            💊 My Prescriptions
          </h1>
          <p className="text-gray-500 mt-1">
            Manage and download all patient prescriptions
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-purple-600"></div>
          </div>
        ) : prescriptions.length === 0 ? (
          <div className="text-center text-gray-200 mt-10">
            No prescriptions found
          </div>
        ) : (
          <div className="grid sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {prescriptions.map((prescription) => (
              <div
                key={prescription._id}
                className="bg-white/80 backdrop-blur-lg border border-gray-200 shadow-xl hover:shadow-2xl transition-all duration-300 rounded-2xl p-5 hover:-translate-y-1"
              >

                <div className="flex justify-between items-center mb-3">
                  <h2 className="text-lg font-bold text-gray-800">
                    {prescription.patient?.user?.name || "Unknown Patient"}
                  </h2>

                  <span className="text-xs bg-purple-100 text-purple-700 px-3 py-1 rounded-full">
                    {new Date(prescription.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <div className="mb-3">
                  <p className="text-sm text-gray-600 font-semibold">
                    Diagnosis
                  </p>
                  <p className="text-gray-800">
                    {prescription.diagnosis || "-"}
                  </p>
                </div>


                <div className="mb-4">
                  <p className="text-sm font-semibold text-gray-600 mb-1">
                    Medicines
                  </p>
                  <div className="space-y-1 max-h-28 overflow-auto pr-1">
                    {prescription.medicines.map((med, i) => (
                      <div
                        key={i}
                        className="text-sm bg-gray-50 px-3 py-1 rounded-lg"
                      >
                        💊 {med.name} • {med.dosage} • {med.duration}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2 mt-4">
                  <button
                    onClick={() => downloadPDF(prescription._id)}
                    className="flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white py-2 rounded-xl font-semibold shadow-md transition"
                  >
                    📄 PDF
                  </button>

                  <button
                    onClick={() => deletePrescription(prescription._id)}
                    className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 rounded-xl font-semibold shadow-md transition"
                  >
                    🗑 Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

export default DoctorPrescriptions;