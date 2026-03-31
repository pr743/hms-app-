import { useEffect, useState } from "react";
import API from "../../api/axios";
import Navbar from "../../components/Navbar";
import Swal from "sweetalert2";
import { Helmet } from "react-helmet-async";

export default function PatientPrescriptions() {
  const [prescriptions, setPrescriptions] = useState([]);
  const [deletingId, setDeletingId] = useState(null);

  const fetchData = async () => {
    const res = await API.get("/prescriptions/patient");
    setPrescriptions(res.data.data);
  };

  const handleDelete = async (id) => {
    if (deletingId) return;
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This record will be deleted permanently!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, delete it",
    });

    if (!result.isConfirmed) return;

    try {
      setDeletingId(id);
      await API.delete(`/prescriptions/${id}`);

      Swal.fire({
        icon: "success",
        title: "Deleted",
        text: "Record deleted successfully",
        timer: 1200,
        showConfirmButton: false,
      });

      setPrescriptions((prev) => prev.filter((p) => p._id !== id));

    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: err.response?.data?.message || "Delete failed ❌",
      });
    } finally {
      setDeletingId(null);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchData();
  }, []);

  return (
    <>

      <Helmet>
        <title>My Prescriptions | HMS</title>
        <meta
          name="description"
          content="View all your prescriptions, medicines, dosage, and treatment history."
        />
        <meta name="keywords" content="prescriptions, medicines, doctor prescription records" />
      </Helmet>

      <Navbar />

      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 p-6">

        <div className="mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white">
            🏥 My Medical History
          </h2>
          <p className="text-gray-100 mt-1 text-sm">
            View and manage your prescriptions professionally
          </p>
        </div>

        {prescriptions.length === 0 ? (
          <div className="flex flex-col items-center justify-center mt-20 text-gray-100">
            <div className="text-6xl mb-4">📄</div>
            <p className="text-lg">No prescriptions found</p>
          </div>
        ) : (

          <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-3">

            {prescriptions.map((p) => (
              <div
                key={p._id}
                className="group bg-white/70 backdrop-blur-lg border border-gray-200 
              rounded-2xl p-6 shadow-md hover:shadow-2xl transition-all duration-300 
              hover:-translate-y-1 flex flex-col justify-between"
              >

                <div>

                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-indigo-600 group-hover:text-indigo-700 transition">
                        {p.doctor?.user?.name || "N/A"}
                      </h3>
                      <p className="text-xs text-gray-400">
                        Doctor
                      </p>
                    </div>

                    <span className="text-xs bg-gray-100 px-3 py-1 rounded-full text-gray-500">
                      {new Date(p.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="mb-4 bg-indigo-50 border border-indigo-100 rounded-lg p-3">
                    <p className="text-sm text-gray-700">
                      <span className="font-semibold text-indigo-700">
                        Diagnosis:
                      </span>{" "}
                      {p.diagnosis || "-"}
                    </p>
                  </div>

                  <div className="mb-5">
                    <h4 className="text-sm font-semibold text-gray-100 mb-2">
                      💊 Medicines
                    </h4>

                    <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                      {p.medicines.map((m, i) => (
                        <div
                          key={i}
                          className="flex justify-between items-center bg-white border 
                        border-gray-200 rounded-lg px-3 py-2 hover:bg-gray-50 transition"
                        >
                          <div>
                            <p className="text-sm font-medium text-gray-800">
                              {m.name}
                            </p>
                            <p className="text-xs text-gray-500">
                              {m.dosage}
                            </p>
                          </div>

                          <span className="text-xs font-medium bg-green-500 text-white px-2 py-1 rounded-full shadow">
                            {m.duration}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>

                <div className="flex justify-end">
                  <button
                    onClick={() => handleDelete(p._id)}
                    disabled={deletingId === p._id}
                    className={`relative overflow-hidden text-sm px-5 py-2 rounded-lg font-medium transition-all duration-300
                  
                  ${deletingId === p._id
                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                        : "bg-red-500 text-white hover:bg-red-600 shadow-md hover:shadow-lg"
                      }`}
                  >
                    {deletingId === p._id ? "Deleting..." : "Delete"}
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