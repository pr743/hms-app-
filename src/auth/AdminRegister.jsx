// import React, { useContext, useState } from "react";
// import API from "../api/axios";
// import { Link, useNavigate } from "react-router-dom";
// import Loader from "../components/Loader";
// import { Lock, Mail, User, MapPin, Eye, EyeOff } from "lucide-react";
// import { AuthContext } from "../context/AuthContext";
// import Navbar from "../components/Navbar";

// function AdminRegister() {
//   const navigate = useNavigate();
//   const { login } = useContext(AuthContext);

//   const [loading, setLoading] = useState(false);
//   const [alert, setAlert] = useState(null);
//   const [showPassword, setShowPassword] = useState(false);


//   const [form, setForm] = useState({
//     name: "",
//     email: "",
//     password: "",
//     city: "",
//   });

//   const handleChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (loading) return;

//     setLoading(true);

//     try {
//       const res = await API.post("/auth/register-admin", {
//         name: form.name.trim(),
//         email: form.email.trim(),
//         password: form.password,
//         city: form.city.trim(),
//       });


//       showAlert("Admin registered successfully", "success");

//       setTimeout(() => {
//         login(res.data.admin);
//         navigate(`/${res.data.admin.role}`);
//       }, 1500);
//     } catch {
//       showAlert("Registration failed", "error");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const showAlert = (msg, type = "info") => {
//     setAlert({ msg, type });
//     setTimeout(() => {
//       setAlert(null);
//     }, 2000);
//   };

//   return (
//     <>
//       <Navbar />

//       <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-blue-500 to-blue-200 px-4 pt-12 pb-6">
//         <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-6 sm:p-8">
//           <div className="text-center mb-6">
//             <h1 className="text-3xl font-bold text-blue-600">HMS Register</h1>
//             <p className="text-gray-500 text-sm mt-1">
//               Create Hospital System Account
//             </p>
//           </div>

//           {alert && (
//             <div
//               className={`fixed top-4 left-1/2 -translate-x-1/2 
//               px-4 py-2 rounded-xl text-black font-semibold z-50
//               ${alert.type === "error"
//                   ? "bg-red-400"
//                   : "bg-green-400"
//                 }`}
//             >
//               {alert.msg}
//             </div>
//           )}

//           <form onSubmit={handleSubmit}>

//             <div className="mb-5">
//               <label className="text-black mb-2 block">Name</label>
//               <div className="flex items-center bg-gray-200 rounded-xl px-4 py-3 focus-within:ring-2 focus-within:ring-blue-500">
//                 <User size={20} className="text-gray-400" />
//                 <input
//                   name="name"
//                   type="text"
//                   placeholder="Enter your name"
//                   className="bg-transparent outline-none w-full px-3"
//                   onChange={handleChange}
//                   required
//                 />
//               </div>
//             </div>


//             <div className="mb-5">
//               <label className="text-black mb-2 block">Email</label>
//               <div className="flex items-center bg-gray-200 rounded-xl px-4 py-3 focus-within:ring-2 focus-within:ring-blue-500">
//                 <Mail size={20} className="text-gray-400" />
//                 <input
//                   name="email"
//                   type="email"
//                   placeholder="Enter email address"
//                   className="bg-transparent outline-none w-full px-3"
//                   onChange={handleChange}
//                   required
//                 />
//               </div>
//             </div>


//             <div className="mb-5">
//               <label className="text-black mb-2 block">Password</label>
//               <div className="flex items-center bg-gray-200 rounded-xl px-4 py-3 focus-within:ring-2 focus-within:ring-blue-500">
//                 <Lock size={18} className="text-gray-400" />
//                 <input
//                   type="password"
//                   name="password"
//                   placeholder="••••••••"
//                   className="bg-transparent outline-none w-full px-3"
//                   onChange={handleChange}
//                   required
//                 />

//                 <button
//                   type="button"
//                   onClick={() => setShowPassword(!showPassword)}
//                   onMouseDown={(e) => e.preventDefault()}
//                   className="text-gray-500"
//                 >
//                   {showPassword ? (
//                     <EyeOff size={20} />
//                   ) : (
//                     <Eye size={20} />
//                   )}
//                 </button>
//               </div>
//             </div>


//             <div className="mb-6">
//               <label className="text-black mb-2 block">City</label>
//               <div className="flex items-center bg-gray-200 rounded-xl px-4 py-3 focus-within:ring-2 focus-within:ring-blue-500">
//                 <MapPin size={18} className="text-gray-400" />
//                 <input
//                   type="text"
//                   name="city"
//                   placeholder="Enter hospital city"
//                   className="bg-transparent outline-none w-full px-3"
//                   onChange={handleChange}
//                   required
//                 />
//               </div>
//             </div>

//             {loading && <Loader />}

//             <button
//               type="submit"
//               disabled={loading}
//               className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold"
//             >
//               Create Admin
//             </button>

//             <p className="text-black text-sm text-center mt-5">
//               Already have an account?{" "}
//               <Link to="/login" className="text-blue-400 hover:text-blue-600">
//                 Login
//               </Link>
//             </p>
//           </form>
//         </div>
//       </div>
//     </>
//   );
// }

// export default AdminRegister;

















import React, { useContext, useState } from "react";
import API from "../api/axios";
import { Link, useNavigate } from "react-router-dom";
import Loader from "../components/Loader";
import { Lock, Mail, User, MapPin, Eye, EyeOff } from "lucide-react";
import { AuthContext } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import { motion } from "framer-motion";

function AdminRegister() {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    city: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const showAlert = (msg, type = "info") => {
    setAlert({ msg, type });
    setTimeout(() => setAlert(null), 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);

    try {
      const res = await API.post("/auth/register-admin", {
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
        city: form.city.trim(),
      });

      showAlert("Admin registered successfully", "success");

      setTimeout(() => {
        login(res.data.admin);
        navigate(`/${res.data.admin.role}`);
      }, 1200);
    } catch {
      showAlert("Registration failed", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />

      <div className="min-h-screen flex items-center justify-center px-4 pt-20
bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">

        <div className="absolute w-[400px] h-[400px] bg-blue-500 opacity-20 blur-3xl rounded-full top-10 left-10">  </div>
        <div className="absolute w-[300px] h-[300px] bg-purple-500 opacity-20 blur-3xl rounded-full bottom-10 right-10"></div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md relative z-10 
          backdrop-blur-xl bg-white/10 border border-white/20 
          rounded-2xl shadow-2xl p-8 text-white"
        >
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold">Create Admin</h1>
            <p className="text-gray-300 text-sm mt-1">
              Hospital Management System
            </p>
          </div>

          {alert && (
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className={`mb-4 text-center px-4 py-2 rounded-lg text-sm font-medium
              ${alert.type === "error"
                  ? "bg-red-500/80"
                  : "bg-green-500/80"
                }`}
            >
              {alert.msg}
            </motion.div>
          )}

          <form onSubmit={handleSubmit}>

            <div className="mb-5">
              <label className="text-sm text-gray-300">Name</label>
              <div className="flex items-center mt-2 bg-white/10 border border-white/20 rounded-xl px-4 py-3">
                <User size={18} className="text-gray-300" />
                <input
                  name="name"
                  type="text"
                  placeholder="Enter your name"
                  className="bg-transparent outline-none w-full px-3 text-white placeholder-gray-400"
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="mb-5">
              <label className="text-sm text-gray-300">Email</label>
              <div className="flex items-center mt-2 bg-white/10 border border-white/20 rounded-xl px-4 py-3">
                <Mail size={18} className="text-gray-300" />
                <input
                  name="email"
                  type="email"
                  placeholder="doctor@hms.com"
                  className="bg-transparent outline-none w-full px-3 text-white placeholder-gray-400"
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="mb-5">
              <label className="text-sm text-gray-300">Password</label>
              <div className="flex items-center mt-2 bg-white/10 border border-white/20 rounded-xl px-4 py-3">
                <Lock size={18} className="text-gray-300" />

                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="••••••••"
                  className="bg-transparent outline-none w-full px-3 text-white placeholder-gray-400"
                  onChange={handleChange}
                  required
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  onMouseDown={(e) => e.preventDefault()}
                  className="text-gray-300"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>


            <div className="mb-6">
              <label className="text-sm text-gray-300">City</label>
              <div className="flex items-center mt-2 bg-white/10 border border-white/20 rounded-xl px-4 py-3">
                <MapPin size={18} className="text-gray-300" />
                <input
                  name="city"
                  type="text"
                  placeholder="Hospital city"
                  className="bg-transparent outline-none w-full px-3 text-white placeholder-gray-400"
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {loading && <Loader />}

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl 
              bg-gradient-to-r from-blue-500 to-indigo-500 
              hover:from-blue-600 hover:to-indigo-600 
              transition font-semibold text-lg disabled:opacity-60"
            >
              Create Admin
            </motion.button>

            <p className="text-sm text-center mt-5 text-gray-300">
              Already have an account?{" "}
              <Link to="/login" className="text-blue-400 hover:underline">
                Login
              </Link>
            </p>
          </form>
        </motion.div>
      </div>
    </>
  );
}

export default AdminRegister;