import { useEffect, useState } from "react";
import API from "../../api/axios";
import Navbar from "../../components/Navbar";
import Swal from "sweetalert2";
import { Helmet } from "react-helmet-async";

export default function PatientHistory() {
  const [records, setRecords] = useState([]);

  const fetchHistory = async () => {
    try {
      const res = await API.get("/prescriptions/history");
      setRecords(res.data.data);
    } catch (error) {
      console.error("Error:", error.response?.data || error.message);
    }
  };


  const handleDelete = async (id) => {
    try {
      await API.delete(`/prescriptions/${id}`);

      Swal.fire({
        icon: "success",
        title: "Deleted",
        text: "Record deleted successfully",
        timer: 1500,
        showConfirmButton: false,
      });


      setRecords((prev) => prev.filter((r) => r._id !== id));

    } catch {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Delete failed ❌",
      });
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchHistory();
  }, []);




  return (
    <>


      <Helmet>
        <title>Medical History | HMS</title>
        <meta
          name="description"
          content="Check your complete medical history including diagnosis, doctor notes, and past treatments."
        />
        <meta name="keywords" content="medical history, patient records, diagnosis history" />

        <link rel="canonical" href="https://hms-app-l8ub.vercel.app/history" />
      </Helmet>

      <Navbar />


      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 p-6">

        <div className="max-w-6xl mx-auto mb-8">
          <h2 className="text-3xl font-bold text-white">
            Patient Medical History
          </h2>
          <p className="text-gray-100 mt-1">
            View all past diagnoses and doctor records 🧾
          </p>
        </div>

        <div className="max-w-6xl mx-auto">

          {records.length === 0 ? (
            <div className="text-center text-white text-lg mt-20">
              No history found
            </div>
          ) : (
            <div className="space-y-6">
              {records.map((record) => (
                <div
                  key={record._id}
                  className="bg-white/70 backdrop-blur-xl border border-white/40 
                shadow-lg hover:shadow-2xl transition duration-300 
                p-6 rounded-2xl"
                >
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="font-semibold text-lg text-gray-800">
                      {record.doctor?.user?.name}
                    </h3>

                    <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                      {new Date(record.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <p className="text-gray-700">
                    <span className="font-semibold text-gray-800">
                      Diagnosis:
                    </span>{" "}
                    {record.diagnosis}
                  </p>


                  {record.notes && (
                    <p className="text-gray-600 mt-3 bg-gray-50 p-3 rounded-lg border">
                      <span className="font-semibold text-gray-700">
                        Doctor Notes:
                      </span>{" "}
                      {record.notes}
                    </p>
                  )}

                  <div className="mt-4">
                    <span
                      className={`px-3 py-1 text-xs font-semibold rounded-full
                    ${record.appointment?.status === "completed"
                          ? "bg-green-100 text-green-600"
                          : record.appointment?.status === "cancelled"
                            ? "bg-red-100 text-red-500"
                            : "bg-blue-100 text-blue-600"
                        }`}
                    >
                      {record.appointment?.status}
                    </span>
                  </div>

                  <div className="flex justify-end mt-5">
                    <button
                      onClick={() => handleDelete(record._id)}
                      className="px-4 py-2 rounded-lg text-sm font-medium text-white
                    bg-gradient-to-r from-red-500 to-red-600
                    hover:from-red-600 hover:to-red-700
                    shadow-md transition"
                    >
                      🗑 Delete
                    </button>
                  </div>

                </div>
              ))}
            </div>
          )}

        </div>
      </div>
    </>
  );

}