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

  return (
    <>
      <Navbar />

      <div className="p-6 bg-gray-100 min-h-screen">
        <h1 className="text-3xl font-bold mb-6">
          My Prescriptions
        </h1>

        {loading ? (
          <p>Loading...</p>
        ) : prescriptions.length === 0 ? (
          <p>No prescriptions found</p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {prescriptions.map((prescription) => (
              <div
                key={prescription._id}
                className="bg-white p-5 rounded-xl shadow-md"
              >
                <h2 className="text-lg font-semibold">
                  {prescription.patient?.user?.name || "N/A"}
                </h2>

                <p className="text-sm text-gray-500">
                  {new Date(
                    prescription.createdAt
                  ).toLocaleDateString()}
                </p>

                <p className="mt-2 text-gray-700">
                  <strong>Diagnosis:</strong>{" "}
                  {prescription.diagnosis || "-"}
                </p>

                <div className="mt-2">
                  <strong>Medicines:</strong>
                  <ul className="list-disc ml-5 text-sm">
                    {prescription.medicines.map((med, i) => (
                      <li key={i}>
                        {med.name} - {med.dosage} ({med.duration})
                      </li>
                    ))}
                  </ul>
                </div>


                <button
                  onClick={() => downloadPDF(prescription._id)}
                  className="mt-4 w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-lg"
                >
                  📄 Download PDF
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

export default DoctorPrescriptions;