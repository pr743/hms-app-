import React, { useContext, useState, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { Link } from "react-router-dom";
import { LogOut, User, Hospital, Menu, X } from "lucide-react";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";

function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    logout();
    window.location.href = "/login";
  };





  const closeMenu = () => setIsOpen(false);

  const overlayVariant = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 },
  };

  const drawerVariant = {
    hidden: { x: "-100%" },
    visible: {
      x: 0,
      transition: { type: "spring", stiffness: 80, damping: 15 },
    },
    exit: { x: "-100%" },
  };

  const itemVariant = {
    hidden: { x: -20, opacity: 0 },
    visible: (i) => ({
      x: 0,
      opacity: 1,
      transition: { delay: i * 0.05 },
    }),
  };




  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  const renderLinks = (onClick) => (
    <>
      {!user && (
        <>
          <motion.div custom={0} variants={itemVariant} initial="hidden" animate="visible">
            <Link onClick={onClick} to="/login">Login</Link>
          </motion.div>

          <motion.div custom={1} variants={itemVariant} initial="hidden" animate="visible">
            <Link onClick={onClick} to="/register">Patient Register</Link>
          </motion.div>

          <motion.div custom={2} variants={itemVariant} initial="hidden" animate="visible">
            <Link onClick={onClick} to="/admin/register">Admin Register</Link>
          </motion.div>
        </>
      )}

      {user?.role === "patient" && (
        <>
          <Link onClick={onClick} to="/patient">Dashboard</Link>
          <Link onClick={onClick} to="/patient/appointment">Book Appointment</Link>
          <Link onClick={onClick} to="/patient/appointments">Appointments</Link>
          <Link onClick={onClick} to="/hospitals">Hospitals</Link>
          <Link onClick={onClick} to="/saved-hospitals">Saved</Link>
        </>
      )}

      {user?.role === "doctor" && (
        <>
          <Link onClick={onClick} to="/doctor">Dashboard</Link>
          <Link onClick={onClick} to="/doctor/appointments">Appointments</Link>
          <Link onClick={onClick} to="/doctor/profile">Profile</Link>
        </>
      )}

      {user?.role === "admin" && (
        <>
          <Link onClick={onClick} to="/admin">Dashboard</Link>
          <Link onClick={onClick} to="/admin/doctors">Doctors</Link>
          <Link onClick={onClick} to="/admin/patients">Patients</Link>
        </>
      )}
    </>
  );

  return (
    <nav className="sticky top-0 w-full z-50 backdrop-blur-xl bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 text-white shadow-lg border-b border-white/10">


      <div className="flex items-center justify-between px-6 md:px-10 py-3">

        <div className="flex items-center gap-2 text-blue-300 font-bold text-xl">
          <Hospital size={26} />
          HMS
        </div>


        <div className="hidden md:flex items-center gap-6 text-sm font-medium">
          {renderLinks()}
        </div>

        <div className="flex items-center gap-3">

          {user && (
            <div className="hidden md:flex items-center gap-2 bg-white/10 px-3 py-1 rounded-lg backdrop-blur border border-white/10">
              <User size={16} />
              <span className="text-sm capitalize">{user.name}</span>
            </div>
          )}

          {user && (
            <button
              onClick={handleLogout}
              className="hidden md:flex items-center gap-2 bg-red-500 hover:bg-red-600 transition px-3 py-1.5 rounded-lg text-sm"
            >
              <LogOut size={16} />
            </button>
          )}

          <button onClick={() => setIsOpen(true)} className="md:hidden">
            <Menu size={26} />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <>

            <motion.div
              variants={overlayVariant}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[998]"
              onClick={closeMenu}
            />
            <motion.div
              variants={drawerVariant}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="fixed top-0 left-0 h-full w-80 ... z-[999]"
            >

              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-bold text-blue-300">HMS Menu</h2>
                <X size={24} className="cursor-pointer" onClick={closeMenu} />
              </div>

              <div className="flex flex-col gap-4 text-base">
                {renderLinks(closeMenu)}

                {user && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-6 border-t border-white/20 pt-4"
                  >
                    <p className="text-sm text-gray-300">Logged in as</p>
                    <p className="font-semibold capitalize mb-3">{user.name}</p>

                    <button
                      onClick={handleLogout}
                      className="w-full bg-red-500 hover:bg-red-600 py-2 rounded-lg"
                    >
                      Logout
                    </button>
                  </motion.div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
}

export default Navbar;