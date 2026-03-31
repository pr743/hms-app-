import React, { useContext, useState } from "react";
import API from "../api/axios";
import { Link, useNavigate } from "react-router-dom";
import Loader from "../components/Loader";
import { Lock, Mail, Eye, EyeOff } from "lucide-react";
import { AuthContext } from "../context/AuthContext";
import Navbar from "../components/Navbar";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";

function Login() {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  const [form, setForm] = useState({
    email: "",
    password: "",
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
      const res = await API.post("/auth/login", {
        email: form.email.trim(),
        password: form.password,
      });

      login(res.data);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      showAlert("Login successful", "success");

      setTimeout(() => {
        navigate(`/${res.data.user.role}`);
      }, 1200);
    } catch {
      showAlert("Invalid email or password", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Login  | Hospital Management System</title>

        <meta
          name="description"
          content="Login admin login to manage hospitals, doctors, patients and appointments in HMS system."
        />

        <meta
          name="keywords"
          content="hospital admin Login, HMS admin panel, healthcare management system, admin Login"
        />

        <meta name="author" content="HMS Team" />


        <meta property="og:title" content="Admin Login - HMS" />
        <meta
          property="og:description"
          content="Create admin account and manage full hospital system dashboard."
        />
        <meta property="og:type" content="website" />


        <meta name="robots" content="index, follow" />
      </Helmet>
      <Navbar />

      <div className="min-h-screen flex items-center justify-center px-4 pt-20
      bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 relative overflow-hidden">

        <div className="absolute w-[400px] h-[400px] bg-blue-500 opacity-20 blur-3xl rounded-full top-10 left-10"></div>
        <div className="absolute w-[300px] h-[300px] bg-purple-500 opacity-20 blur-3xl rounded-full bottom-10 right-10"></div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md relative z-10
          backdrop-blur-xl bg-white/10 border border-white/20
          rounded-2xl shadow-2xl p-8 text-white"
        >
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold">Welcome Back</h1>
            <p className="text-gray-300 text-sm mt-1">
              Login to Hospital Management System
            </p>
          </div>

          {alert && (
            <motion.div
              initial={{ y: -15, opacity: 0 }}
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

            <div className="mb-6">
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
              Login
            </motion.button>

            <p className="text-sm text-center mt-5 text-gray-300">
              Don’t have an account?{" "}
              <Link to="/admin/register" className="text-blue-400 hover:underline">
                Signup
              </Link>
            </p>

          </form>
        </motion.div>
      </div>
    </>
  );
}

export default Login;