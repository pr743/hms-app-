import React, { useEffect, useState } from "react";
import API from "../../api/axios";
import Navbar from "../../components/Navbar";
import { Calendar, Clock, User } from "lucide-react";
import { useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";

function DoctorPatientHistory() {
  const { patientId } = useParams();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await API.get(
          `/appointments/patient/${patientId}/history`
        );
        setHistory(res.data.data);
      } catch {
        console.error("Failed to load history");
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [patientId]);

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="p-6 text-gray-600 text-lg">Loading history...</div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <Helmet>
        <title>Patient History | Doctor HMS</title>

        <meta
          name="description"
          content="View complete patient medical history, appointment records and treatment details."
        />

        <meta
          name="keywords"
          content="patient history, medical records, HMS doctor history, appointment history"
        />

        <meta name="author" content="HMS Team" />

        <meta property="og:title" content="Patient Medical History - HMS" />
        <meta
          property="og:description"
          content="Access full patient consultation and treatment history."
        />
        <meta property="og:type" content="website" />

        <meta name="robots" content="noindex, follow" />
      </Helmet>


      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 p-6">

        <div className="mb-6">
          <h1 className="text-3xl font-bold text-white">
            👤 Patient Medical History
          </h1>
          <p className="text-sm text-gray-500">
            Complete consultation & appointment records
          </p>
        </div>

        {history.length === 0 ? (
          <div className="bg-white rounded-2xl shadow p-6 text-gray-200">
            No history found
          </div>
        ) : (
          <div className="space-y-4">

            {history.map((appt) => (
              <div
                key={appt._id}
                className="bg-white/80 backdrop-blur-md border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-lg transition"
              >

                <div className="flex items-center gap-2 font-semibold text-gray-900 mb-2">
                  <div className="p-2 bg-blue-100 text-blue-600 rounded-full">
                    <User size={16} />
                  </div>
                  {appt.patient?.user?.name || "N/A"}
                </div>

                <div className="flex flex-wrap items-center gap-4 text-gray-600 text-sm mb-3">

                  <div className="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-full">
                    <Calendar size={14} />
                    {appt?.appointmentDate
                      ? new Date(appt.appointmentDate).toLocaleDateString()
                      : "N/A"}
                  </div>

                  <div className="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-full">
                    <Clock size={14} />
                    {appt?.slotTime || "N/A"}
                  </div>

                </div>

                <p className="mb-1">
                  <strong>Status:</strong>{" "}
                  <span
                    className={`font-semibold px-2 py-1 rounded-full text-xs ${appt.status === "completed"
                      ? "bg-green-100 text-green-700"
                      : appt.status === "cancelled"
                        ? "bg-red-100 text-red-700"
                        : "bg-blue-100 text-blue-700"
                      }`}
                  >
                    {appt.status}
                  </span>
                </p>

                <p className="text-sm text-gray-700">
                  <strong>Type:</strong>{" "}
                  <span className="text-gray-600">{appt.appointmentType}</span>
                </p>

                <p className="text-sm text-gray-700 mt-1">
                  <strong>Reason:</strong>{" "}
                  <span className="text-gray-500">
                    {appt.reason || "—"}
                  </span>
                </p>

              </div>
            ))}

          </div>
        )}
      </div>
    </>
  );
}

export default DoctorPatientHistory;