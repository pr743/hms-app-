// import { useEffect, useState } from "react";
// import API from "../../api/axios";
// import Navbar from "../../components/Navbar";

// export default function DoctorPrescriptions() {
//   const [prescriptions, setPrescriptions] = useState([]);

//   const fetchData = async () => {
//     const res = await API.get("/prescriptions/doctor");
//     setPrescriptions(res.data.data);
//   };

//   useEffect(() => {
//     // eslint-disable-next-line react-hooks/set-state-in-effect
//     fetchData();
//   }, []);

//   return (
//     <>
//       <Navbar />
//       <div className="p-6">
//         <h2 className="text-2xl font-bold mb-4">My Prescriptions</h2>

//         {prescriptions.map((p) => (
//           <div
//             key={p._id}
//             className="bg-white shadow-lg border rounded-xl p-6 mb-6"
//           >
//             <div className="flex justify-between items-center mb-3">
//               <h3 className="text-lg font-semibold text-blue-700">
//                 Patient: {p.patient?.user?.name || "N/A"}
//               </h3>
//               <span className="text-sm text-gray-500">
//                 {new Date(p.createdAt).toLocaleString()}
//               </span>
//             </div>

//             <div className="mb-4">
//               <p className="text-gray-700">
//                 <span className="font-semibold">Diagnosis:</span> {p.diagnosis}
//               </p>
//             </div>

//             <div>
//               <h4 className="font-semibold text-gray-800 mb-2">
//                 Prescribed Medicines
//               </h4>

//               <div className="space-y-3">
//                 {p.medicines.map((m, i) => (
//                   <div
//                     key={i}
//                     className="flex justify-between items-center bg-blue-50 border border-blue-100 rounded-lg px-4 py-3"
//                   >
//                     <div>
//                       <p className="font-medium text-gray-800">{m.name}</p>
//                       <p className="text-sm text-gray-600">
//                         Dosage: {m.dosage}
//                       </p>
//                     </div>

//                     <span className="text-sm bg-blue-600 text-white px-3 py-1 rounded-full">
//                       {m.duration}
//                     </span>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>
//     </>
//   );
// }
















import React, { useEffect, useState } from "react";
import API from "../../api/axios";
import Navbar from "../../components/Navbar";

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
                  onClick={() =>
                    window.open(
                      `${import.meta.env.VITE_API_URL
                      }/prescriptions/${prescription._id}/pdf`,
                      "_blank"
                    )
                  }
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