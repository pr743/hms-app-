import React, { useEffect, useState } from "react";
import API from "../api/axios";
import Navbar from "../components/Navbar";
import HospitalCard from "../components/HospitalCard";
import Swal from "sweetalert2";


function MySavedHospitals() {
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSaved = async () => {
      try {
        const res = await API.get("/hospitals/saved");
        setHospitals(res.data.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchSaved();
  }, []);

  const handleRemove = async (id) => {
    const confirm = await Swal.fire({
      title: "Remove Hospital?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, remove",
    });

    if (!confirm.isConfirmed) return;

    try {
      await API.delete(`/hospitals/saved/${id}`);

      setHospitals((prev) => prev.filter((h) => h._id !== id));

      Swal.fire("Removed!", "Hospital removed from saved list.", "success");
    } catch (error) {
      console.error(error);
    }
  };



  // return (
  //   <>
  //     <Navbar />

  //     <div className="min-h-screen bg-gray-100 py-10 px-4">
  //       <div className="max-w-6xl mx-auto">

  //         <h1 className="text-3xl font-bold mb-8">
  //           My Saved Hospitals
  //         </h1>

  //         {loading && (
  //           <p className="text-gray-500">Loading saved hospitals...</p>
  //         )}

  //         {!loading && hospitals.length === 0 && (
  //           <div className="bg-white p-6 rounded-xl shadow text-center">
  //             <p className="text-gray-600">
  //               You have not saved any hospitals yet.
  //             </p>
  //           </div>
  //         )}

  //         {!loading && hospitals.length > 0 && (
  //           <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
  //             {hospitals.map((hospital) => (
  //               <div key={hospital._id} className="relative group">

  //                 <HospitalCard
  //                   hospital={hospital}
  //                   userRole="patient"
  //                 />


  //                 <button
  //                   onClick={() => handleRemove(hospital._id)}
  //                   className="
  //         absolute top-2 right-2 
  //         bg-red-500 hover:bg-red-600 
  //         text-white 
  //         p-2 md:px-3 md:py-1 
  //         rounded-full md:rounded-lg 
  //         text-xs md:text-sm 
  //         shadow-md 
  //         transition-all duration-200

  //         opacity-100 

  //         md:opacity-0 md:group-hover:opacity-100
  //       "
  //                 >

  //                   <span className="md:hidden">❌</span>

  //                   <span className="hidden md:block">Remove</span>
  //                 </button>

  //               </div>
  //             ))}
  //           </div>

  //         )}
  //       </div>
  //     </div>
  //   </>
  // );


  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100 py-10 px-4">
        <div className="max-w-7xl mx-auto">

          {/* Header */}
          <div className="mb-10 flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
                ❤️ My Saved Hospitals
              </h1>
              <p className="text-gray-500 text-sm mt-1">
                Quickly access your favorite hospitals
              </p>
            </div>
          </div>

          {/* Loading */}
          {loading && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="bg-white rounded-2xl p-5 shadow animate-pulse border"
                >
                  <div className="h-5 bg-gray-200 rounded w-2/3 mb-4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-full"></div>
                </div>
              ))}
            </div>
          )}

          {/* Empty State */}
          {!loading && hospitals.length === 0 && (
            <div className="flex flex-col items-center justify-center mt-20 text-gray-400">
              <div className="text-6xl mb-4">🏥</div>
              <p className="text-lg">
                You have not saved any hospitals yet
              </p>
            </div>
          )}

          {/* Cards */}
          {!loading && hospitals.length > 0 && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {hospitals.map((hospital) => (
                <div
                  key={hospital._id}
                  className="relative group bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border border-gray-200 overflow-hidden"
                >

                  {/* Top Gradient Bar */}
                  <div className="h-1 bg-gradient-to-r from-pink-500 to-red-500"></div>

                  {/* Hospital Card */}
                  <div className="p-4">
                    <HospitalCard
                      hospital={hospital}
                      userRole="patient"
                    />
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => handleRemove(hospital._id)}
                    className="
                    absolute top-3 right-3
                    flex items-center gap-1
                    bg-red-500 hover:bg-red-600 text-white
                    px-3 py-1.5 rounded-full text-xs font-medium
                    shadow-md hover:shadow-lg transition-all duration-300

                    opacity-100 md:opacity-0 md:group-hover:opacity-100
                  "
                  >
                    ❌ Remove
                  </button>

                </div>
              ))}
            </div>
          )}

        </div>
      </div>
    </>
  );

}

export default MySavedHospitals;