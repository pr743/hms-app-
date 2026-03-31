import React, { useContext, useState } from "react";
import API from "../api/axios";
import { Link, useNavigate } from "react-router-dom";
import Loader from "../components/Loader";
import { Lock, Mail, User, MapPin, Eye, EyeOff } from "lucide-react";
import { AuthContext } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import { Helmet } from "react-helmet-async";

function Register() {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const showAlert = (msg, type = "success") => {
    setAlert({ msg, type });
    setTimeout(() => {
      setAlert(null);
    }, 2000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);

    try {
      const res = await API.post("/auth/register", {
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
        role: "patient",
      });


      login(res.data);


      showAlert("Register Successfully ✅", "success");


      setTimeout(() => {
        login(res.data.admin);
        navigate(`/${res.data.user.role}`);
      }, 1500);
    } catch (err) {
      showAlert(
        err.response?.data?.message || "Register Failed ❌",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>patient Register | Hospital Management System</title>

        <meta
          name="description"
          content="register patient account to manage hospitals, doctors, patients and appointments in HMS system."
        />

        <meta
          name="keywords"
          content="hospital patient Register, HMS patient panel, healthcare management system, admin Login"
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
      bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 relative overflow-hidden">

        <div className="absolute w-[500px] h-[500px] bg-blue-500/20 blur-3xl rounded-full top-[-100px] left-[-100px]"></div>
        <div className="absolute w-[400px] h-[400px] bg-purple-500/20 blur-3xl rounded-full bottom-[-100px] right-[-100px]"></div>

        <div className="hidden lg:flex flex-col text-white w-[420px] mr-10">
          <h1 className="text-4xl font-bold leading-tight">
            Join Smart Healthcare Platform
          </h1>

          <p className="mt-4 text-gray-300">
            Book doctors, manage reports, and track your health — all in one place.
          </p>

          <div className="mt-6 space-y-3 text-sm text-gray-300">
            <p>✔ Fast appointment booking</p>
            <p>✔ Digital prescriptions</p>
            <p>✔ Secure medical records</p>
          </div>

          <div className="mt-8 p-4 rounded-xl bg-white/10 border border-white/10">
            <p className="text-sm text-gray-300">Trusted by patients</p>
            <p className="text-2xl font-bold text-blue-300">10,000+</p>
          </div>
        </div>

        <div className="w-full max-w-md relative z-10">

          <div className="backdrop-blur-xl bg-white/10 border border-white/20 
          rounded-2xl shadow-2xl p-8 text-white">

            <div className="text-center mb-6">
              <h1 className="text-3xl font-bold">Create Account</h1>
              <p className="text-gray-300 text-sm mt-1">
                Start your healthcare journey
              </p>
            </div>

            {alert && (
              <div className={`mb-4 text-center px-4 py-2 rounded-lg text-sm font-medium
              ${alert.type === "error" ? "bg-red-500/80" : "bg-green-500/80"}`}>
                {alert.msg}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-sm text-gray-300">Full Name</label>
                <div className="flex items-center mt-2 bg-white/10 border border-white/20 rounded-xl px-4 py-3">
                  <User size={18} className="text-gray-300" />
                  <input
                    name="name"
                    placeholder="John Doe"
                    className="bg-transparent outline-none w-full px-3 text-white placeholder-gray-400"
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              <div>
                <label className="text-sm text-gray-300">Email</label>
                <div className="flex items-center mt-2 bg-white/10 border border-white/20 rounded-xl px-4 py-3">
                  <Mail size={18} className="text-gray-300" />
                  <input
                    name="email"
                    type="email"
                    placeholder="patient@email.com"
                    className="bg-transparent outline-none w-full px-3 text-white placeholder-gray-400"
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div>
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
                    className="text-gray-300"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
              {loading && <Loader />}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl font-semibold text-lg
              bg-gradient-to-r from-blue-500 to-indigo-500
              hover:from-blue-600 hover:to-indigo-600
              transition transform hover:scale-[1.02] disabled:opacity-60"
              >
                Create Free Account
              </button>

              <p className="text-sm text-center text-gray-300 mt-4">
                Already have an account?{" "}
                <Link to="/login" className="text-blue-400 hover:underline">
                  Sign in
                </Link>
              </p>

            </form>
          </div>
        </div>
      </div>
    </>
  );




}



export default Register;























