import { useEffect, useState } from "react";
import API from "../../api/axios";
import Navbar from "../../components/Navbar";
import Swal from "sweetalert2";

export default function PatientPrescriptions() {
  const [prescriptions, setPrescriptions] = useState([]);
  const [deletingId, setDeletingId] = useState(null);

  const fetchData = async () => {
    const res = await API.get("/prescriptions/patient");
    setPrescriptions(res.data.data);
  };

  const handleDelete = async (id) => {
    if (deletingId) return; // prevent multiple clicks

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
      <Navbar />

      <div className="min-h-screen bg-gray-100 px-4 py-6">

        <h2 className="text-2xl md:text-3xl font-bold mb-6 text-gray-800">
          My Medical History
        </h2>

        {prescriptions.length === 0 ? (
          <div className="text-center text-gray-500 mt-10">
            No prescriptions found
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-3">

            {prescriptions.map((p) => (
              <div
                key={p._id}
                className="bg-white rounded-2xl shadow-md hover:shadow-xl transition p-5 flex flex-col justify-between"
              >


                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="text-lg font-semibold text-green-600">
                      {p.doctor?.user?.name || "N/A"}
                    </h3>
                    <p className="text-xs text-gray-400">
                      Doctor
                    </p>
                  </div>

                  <span className="text-xs text-gray-500">
                    {new Date(p.createdAt).toLocaleDateString()}
                  </span>
                </div>


                <div className="mb-3">
                  <p className="text-sm text-gray-600">
                    <span className="font-semibold text-gray-800">
                      Diagnosis:
                    </span>{" "}
                    {p.diagnosis || "-"}
                  </p>
                </div>


                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">
                    Medicines
                  </h4>

                  <div className="space-y-2">
                    {p.medicines.map((m, i) => (
                      <div
                        key={i}
                        className="bg-green-50 border border-green-100 rounded-lg px-3 py-2 flex justify-between items-center"
                      >
                        <div>
                          <p className="text-sm font-medium">
                            {m.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {m.dosage}
                          </p>
                        </div>

                        <span className="text-xs bg-green-600 text-white px-2 py-1 rounded-full">
                          {m.duration}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>


                <div className="flex justify-end">
                  <button
                    onClick={() => handleDelete(p._id)}
                    disabled={deletingId === p._id}
                    className={`text-sm px-4 py-2 rounded-lg transition
    ${deletingId === p._id
                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                        : "bg-red-100 text-red-600 hover:bg-red-200"
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