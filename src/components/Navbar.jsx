// import React, { useContext, useState } from "react";
// import { AuthContext } from "../context/AuthContext";
// import { Link } from "react-router-dom";
// import { LogOut, User, Hospital, Menu, X } from "lucide-react";

// function Navbar() {
//   const { user, logout } = useContext(AuthContext);
//   const [isOpen, setIsOpen] = useState(false);

//   const handleLogout = () => {
//     localStorage.removeItem("token");
//     localStorage.removeItem("user");
//     logout();
//     window.location.href = "/login";
//   };

//   const closeMenu = () => setIsOpen(false);

//   return (
//     <nav className="sticky top-0 w-full bg-blue-600 text-white shadow-md z-50">
//       <div className="flex items-center justify-between px-6 py-3">


//         <div className="flex items-center gap-2">
//           <Hospital size={28} />
//           <span className="text-xl font-bold">HMS</span>
//         </div>


//         <div className="hidden md:flex items-center gap-6 font-medium">
//           {!user && (
//             <>
//               <Link to="/login">Login</Link>
//               <Link to="/register">Patient Register</Link>
//               <Link to="/admin/register">Admin Register</Link>
//             </>
//           )}

//           {user?.role === "patient" && (
//             <>
//               <Link to="/patient">Dashboard</Link>
//               <Link to="/patient/appointment"> Book Appointment </Link>
//               <Link to="/patient/appointments">
//                 My Appointments
//               </Link>

//               <Link to="/hospitals">Find Hospital</Link>
//               <Link to="/saved-hospitals">Saved</Link>
//               <Link to="/patient/prescriptions"> Prescriptions </Link>
//               <Link to="/patient/history">History</Link>
//             </>
//           )}

//           {user?.role === "doctor" && (
//             <>
//               <Link to="/doctor">Dashboard</Link>
//               <Link to="/doctor/appointments">My Appointments</Link>
//               <Link to="/doctor/create-prescription">Create Prescription</Link>
//               <Link to="/doctor/prescriptions">View Prescription</Link>
//               <Link to="/doctor/profile">Profile</Link>
//             </>
//           )}

//           {user?.role === "admin" && (
//             <>
//               <Link to="/admin">Dashboard</Link>
//               <Link to="/admin/hospitals">Add Hospital</Link>
//               <Link to="/admin/doctors">Doctors</Link>
//               <Link to="/admin/patients">Patients</Link>
//               <Link to="/admin/appointments">Appointments</Link>
//               <Link to="/admin/add-doctor">Add Doctor</Link>
//             </>
//           )}
//         </div>


//         <div className="flex items-center gap-4">
//           {user && (
//             <div className="hidden md:flex items-center gap-2 bg-blue-500 px-3 py-1 rounded-lg">
//               <User size={18} />
//               <span className="capitalize">
//                 {user.name} ({user.role})
//               </span>
//             </div>
//           )}

//           {user && (
//             <button
//               onClick={handleLogout}
//               className="hidden md:flex items-center gap-2 bg-red-500 hover:bg-red-600 px-3 py-2 rounded-lg"
//             >
//               <LogOut size={18} />
//               Logout
//             </button>
//           )}


//           <button onClick={() => setIsOpen(true)} className="md:hidden">
//             <Menu size={26} />
//           </button>
//         </div>
//       </div>


//       {isOpen && (
//         <>

//           <div
//             className="fixed inset-0 bg-black bg-opacity-50 z-40"
//             onClick={closeMenu}
//           ></div>


//           <div className="fixed top-0 left-0 h-full w-72 bg-white text-black z-50 shadow-lg transition-transform duration-300">


//             <div className="flex justify-between items-center p-4 border-b">
//               <h2 className="text-lg font-bold text-blue-600">Menu</h2>
//               <X
//                 size={24}
//                 className="cursor-pointer"
//                 onClick={closeMenu}
//               />
//             </div>


//             <div className="flex flex-col p-4 space-y-4">

//               {!user && (
//                 <>
//                   <Link to="/login" onClick={closeMenu}>Login</Link>
//                   <Link to="/register" onClick={closeMenu}>Patient Register</Link>
//                   <Link to="/admin/register" onClick={closeMenu}>Admin Register</Link>
//                   <Link to="/hospitals" onClick={closeMenu}>Find Hospital</Link>
//                 </>
//               )}

//               {user?.role === "patient" && (
//                 <>
//                   <Link to="/patient" onClick={closeMenu}>Dashboard</Link>
//                   <Link to="/patient/appointment" onClick={closeMenu}> Book Appointment </Link>
//                   <Link to="/hospitals" onClick={closeMenu}>Find Hospital</Link>
//                   <Link to="/saved-hospitals" onClick={closeMenu}>Saved Hospitals</Link>
//                   <Link to="/patient/prescriptions" onClick={closeMenu}> Prescriptions </Link>
//                   <Link to="/patient/history" onClick={closeMenu}>History</Link>
//                 </>
//               )}

//               {user?.role === "doctor" && (
//                 <>
//                   <Link to="/doctor" onClick={closeMenu}>Dashboard</Link>
//                   <Link to="/doctor/appointments" onClick={closeMenu}>My Appointments</Link>
//                   <Link to="/doctor/create-prescription" onClick={closeMenu}>Create Prescription</Link>
//                   <Link to="/doctor/prescriptions" onClick={closeMenu}>View Prescription</Link>
//                   <Link to="/doctor/profile" onClick={closeMenu}>Profile</Link>
//                 </>
//               )}

//               {user?.role === "admin" && (
//                 <>
//                   <Link to="/admin" onClick={closeMenu}>Dashboard</Link>
//                   <Link to="/admin/hospitals" onClick={closeMenu}>Add Hospital</Link>
//                   <Link to="/admin/doctors" onClick={closeMenu}>Doctors</Link>
//                   <Link to="/admin/patients" onClick={closeMenu}>Patients</Link>
//                   <Link to="/admin/appointments" onClick={closeMenu}>Appointments</Link>
//                   <Link to="/admin/add-doctor" onClick={closeMenu}>Add Doctor</Link>
//                 </>
//               )}


//               {user && (
//                 <div className="border-t pt-4 mt-4">
//                   <div className="flex items-center gap-2 mb-3 bg-blue-100 px-3 py-2 rounded">
//                     <User size={18} />
//                     <span className="capitalize">
//                       {user.name} ({user.role})
//                     </span>
//                   </div>

//                   <button
//                     onClick={handleLogout}
//                     className="w-full bg-red-500 text-white py-2 rounded hover:bg-red-600"
//                   >
//                     Logout
//                   </button>
//                 </div>
//               )}

//             </div>
//           </div>
//         </>
//       )}
//     </nav>
//   );
// }

// export default Navbar;





























import React, { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { Link } from "react-router-dom";
import { LogOut, User, Hospital, Menu, X } from "lucide-react";
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

  return (
    <nav className="sticky top-0 w-full z-50 backdrop-blur-lg bg-white/10 border-b border-white/10 text-white">

      <div className="flex items-center justify-between px-4 md:px-10 py-3">

        {/* LOGO */}
        <div className="flex items-center gap-2 text-blue-400 font-bold text-lg">
          <Hospital size={26} />
          HMS
        </div>

        {/* DESKTOP MENU */}
        <div className="hidden md:flex items-center gap-6 text-sm font-medium">

          {!user && (
            <>
              <Link className="hover:text-blue-400" to="/login">Login</Link>
              <Link className="hover:text-blue-400" to="/register">Register</Link>
              <Link className="hover:text-blue-400" to="/admin/register">Admin</Link>
            </>
          )}

          {user?.role === "patient" && (
            <>
              <Link className="hover:text-blue-400" to="/patient">Dashboard</Link>
              <Link className="hover:text-blue-400" to="/patient/appointment">Book</Link>
              <Link className="hover:text-blue-400" to="/patient/appointments">Appointments</Link>
              <Link className="hover:text-blue-400" to="/hospitals">Hospitals</Link>
            </>
          )}

          {user?.role === "doctor" && (
            <>
              <Link className="hover:text-blue-400" to="/doctor">Dashboard</Link>
              <Link className="hover:text-blue-400" to="/doctor/appointments">Appointments</Link>
              <Link className="hover:text-blue-400" to="/doctor/profile">Profile</Link>
            </>
          )}

          {user?.role === "admin" && (
            <>
              <Link className="hover:text-blue-400" to="/admin">Dashboard</Link>
              <Link className="hover:text-blue-400" to="/admin/doctors">Doctors</Link>
              <Link className="hover:text-blue-400" to="/admin/patients">Patients</Link>
            </>
          )}
        </div>

        {/* RIGHT SIDE */}
        <div className="flex items-center gap-3">

          {user && (
            <div className="hidden md:flex items-center gap-2 bg-white/10 px-3 py-1 rounded-lg text-sm">
              <User size={16} />
              {user.name}
            </div>
          )}

          {user && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              onClick={handleLogout}
              className="hidden md:flex items-center gap-2 bg-red-500 px-3 py-1.5 rounded-lg text-sm"
            >
              <LogOut size={16} />
            </motion.button>
          )}

          {/* MOBILE BUTTON */}
          <button onClick={() => setIsOpen(true)} className="md:hidden">
            <Menu size={24} />
          </button>
        </div>
      </div>

      {/* MOBILE DRAWER */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* OVERLAY */}
            <motion.div
              className="fixed inset-0 bg-black/50 z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeMenu}
            />

            {/* DRAWER */}
            <motion.div
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ duration: 0.3 }}
              className="fixed top-0 left-0 h-full w-72 bg-slate-900 text-white z-50 shadow-xl p-4"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-bold text-blue-400">Menu</h2>
                <X size={22} onClick={closeMenu} className="cursor-pointer" />
              </div>

              <div className="flex flex-col gap-4 text-sm">

                {!user && (
                  <>
                    <Link onClick={closeMenu} to="/login">Login</Link>
                    <Link onClick={closeMenu} to="/register">Register</Link>
                    <Link onClick={closeMenu} to="/admin/register">Admin</Link>
                  </>
                )}

                {user?.role === "patient" && (
                  <>
                    <Link onClick={closeMenu} to="/patient">Dashboard</Link>
                    <Link onClick={closeMenu} to="/patient/appointment">Book Appointment</Link>
                    <Link onClick={closeMenu} to="/hospitals">Hospitals</Link>
                  </>
                )}

                {user?.role === "doctor" && (
                  <>
                    <Link onClick={closeMenu} to="/doctor">Dashboard</Link>
                    <Link onClick={closeMenu} to="/doctor/appointments">Appointments</Link>
                    <Link onClick={closeMenu} to="/doctor/profile">Profile</Link>
                  </>
                )}

                {user?.role === "admin" && (
                  <>
                    <Link onClick={closeMenu} to="/admin">Dashboard</Link>
                    <Link onClick={closeMenu} to="/admin/doctors">Doctors</Link>
                  </>
                )}

                {user && (
                  <div className="border-t border-white/20 pt-4 mt-4">
                    <p className="text-xs text-gray-400 mb-2">Logged in as</p>
                    <p className="mb-3">{user.name}</p>

                    <button
                      onClick={handleLogout}
                      className="w-full bg-red-500 py-2 rounded"
                    >
                      Logout
                    </button>
                  </div>
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