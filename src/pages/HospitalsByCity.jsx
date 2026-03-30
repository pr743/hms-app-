import React, { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { fetchHospitalsByCity } from "../api/hospitalApi";
import HospitalCard from "../components/HospitalCard";
import { Search, MapPin, RotateCcw } from "lucide-react";
import Navbar from "../components/Navbar";
import Swal from "sweetalert2";
import API from "../api/axios";

function HospitalsByCity() {
  const { user } = useContext(AuthContext);

  const [city, setCity] = useState("");
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!city.trim()) {
      Swal.fire({
        icon: "warning",
        title: "City Required",
        text: "Please enter a city name",
      });
      return;
    }

    try {
      setLoading(true);

      const res = await fetchHospitalsByCity(city.trim());
      const hospitalList = res?.data?.data || [];

      setHospitals(hospitalList);

      if (hospitalList.length === 0) {
        Swal.fire({
          icon: "info",
          title: "No Results",
          text: "No hospitals found in this city",
        });
      }
    } catch {
      setHospitals([]);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to fetch hospitals",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setCity("");
    setHospitals([]);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };


  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 p-6">
        <div className="max-w-7xl mx-auto">


          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
              🏥 Find Hospitals Near You
            </h1>
            <p className="text-gray-100 mt-3 text-sm md:text-base">
              Discover top hospitals & book appointments instantly
            </p>
          </div>


          {user?.role === "admin" && (
            <div className="bg-yellow-100 border border-yellow-200 text-yellow-800 p-4 rounded-xl text-center mb-6 shadow-sm">
              ⚠️ Admin users cannot search hospitals.
            </div>
          )}


          {user?.role !== "admin" && (
            <div className="bg-white/70 backdrop-blur-lg border border-gray-200 shadow-xl rounded-2xl p-5 flex flex-col sm:flex-row gap-4 mb-10 transition">


              <div className="flex items-center gap-3 flex-1 bg-gray-100 px-4 py-3 rounded-xl focus-within:ring-2 focus-within:ring-blue-500">
                <MapPin className="text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Enter city (e.g. Ahmedabad)"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  onKeyDown={handleKeyPress}
                  className="bg-transparent outline-none w-full text-gray-700 placeholder-gray-400"
                />
              </div>

              <button
                onClick={handleSearch}
                disabled={loading}
                className="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:opacity-90 disabled:bg-gray-400 text-white px-8 py-3 rounded-xl font-semibold shadow-md hover:shadow-lg transition-all duration-300"
              >
                <Search size={18} />
                {loading ? "Searching..." : "Search"}
              </button>

              <button
                onClick={handleReset}
                className="flex items-center justify-center gap-2 bg-gray-200 hover:bg-gray-300 px-6 py-3 rounded-xl font-semibold transition"
              >
                <RotateCcw size={16} />
                Reset
              </button>
            </div>
          )}

          {loading && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="bg-white rounded-2xl p-5 shadow animate-pulse border"
                >
                  <div className="h-5 bg-gray-200 rounded w-2/3 mb-4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                </div>
              ))}
            </div>
          )}

          {!loading && hospitals.length > 0 && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {hospitals.map((hospital) => (
                <div
                  key={hospital._id}
                  className="group bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border border-gray-200 overflow-hidden"
                >

                  <div className="h-2 bg-gradient-to-r from-blue-500 to-indigo-500"></div>

                  <div className="p-5">

                    <h2 className="text-xl font-semibold text-gray-800 group-hover:text-blue-600 transition">
                      {hospital.name}
                    </h2>

                    <p className="text-sm text-gray-500 mt-1">
                      📍 {hospital.city}
                    </p>

                    <p className="text-sm text-gray-600 mt-3 line-clamp-2">
                      {hospital.address || "Trusted healthcare services available"}
                    </p>

                    <div className="mt-5">
                      <button
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg font-medium transition shadow-sm hover:shadow-md"
                      >
                        View Doctors →
                      </button>
                    </div>

                  </div>
                </div>
              ))}
            </div>
          )}

          {!loading && hospitals.length === 0 && (
            <div className="text-center mt-20 text-gray-200">
              <div className="text-6xl mb-4">🏥</div>
              <p className="text-lg">No hospitals found</p>
            </div>
          )}

        </div>
      </div>
    </>
  );
}

export default HospitalsByCity;






















