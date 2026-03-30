// import { useNavigate } from "react-router-dom";
// import { useState } from "react";
// import { motion } from "framer-motion";

// function Home() {
//     const navigate = useNavigate();
//     const [open, setOpen] = useState(false);

//     return (
//         <div className="bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white min-h-screen">

//             <motion.div
//                 className="flex justify-between items-center px-4 md:px-10 py-4 backdrop-blur-lg bg-white/10 border-b border-white/10 sticky top-0 z-50"
//                 initial={{ y: -60, opacity: 0 }}
//                 animate={{ y: 0, opacity: 1 }}
//             >
//                 <h1 className="text-lg md:text-xl font-bold text-blue-400">HMS</h1>

//                 <div className="hidden md:flex gap-6 items-center">
//                     <button onClick={() => navigate("/hospitals")}>Hospitals</button>
//                     <button onClick={() => navigate("/login")}>Login</button>

//                     <motion.button
//                         whileHover={{ scale: 1.05 }}
//                         onClick={() => navigate("/register")}
//                         className="bg-blue-500 px-4 py-1.5 rounded"
//                     >
//                         Register
//                     </motion.button>
//                 </div>

//                 <button className="md:hidden" onClick={() => setOpen(!open)}>
//                     ☰
//                 </button>
//             </motion.div>

//             {open && (
//                 <div className="md:hidden px-4 py-4 bg-white/10 backdrop-blur-lg">
//                     <div className="flex flex-col gap-3">
//                         <button onClick={() => navigate("/hospitals")}>Hospitals</button>
//                         <button onClick={() => navigate("/login")}>Login</button>
//                         <button
//                             onClick={() => navigate("/register")}
//                             className="bg-blue-500 px-4 py-2 rounded"
//                         >
//                             Register
//                         </button>
//                     </div>
//                 </div>
//             )}

//             <div className="grid md:grid-cols-2 items-center px-4 md:px-16 py-16 gap-10">

//                 <motion.div
//                     initial={{ opacity: 0, y: 40 }}
//                     animate={{ opacity: 1, y: 0 }}
//                 >
//                     <p className="text-blue-400 text-xs uppercase mb-2 tracking-widest">
//                         Healthcare Platform
//                     </p>

//                     <h1 className="text-3xl md:text-5xl font-bold leading-tight mb-4">
//                         Next Generation Hospital Management System
//                     </h1>

//                     <p className="text-gray-300 mb-6 text-sm md:text-base">
//                         A powerful digital solution for managing hospitals, doctors,
//                         patients, and appointments with speed and efficiency.
//                     </p>

//                     <div className="flex flex-wrap gap-3">
//                         <motion.button
//                             whileHover={{ scale: 1.05 }}
//                             onClick={() => navigate("/register")}
//                             className="bg-blue-500 px-6 py-2 rounded w-full md:w-auto"
//                         >
//                             Get Started
//                         </motion.button>

//                         <motion.button
//                             whileHover={{ scale: 1.05 }}
//                             onClick={() => navigate("/login")}
//                             className="border border-white/30 px-6 py-2 rounded w-full md:w-auto"
//                         >
//                             Login
//                         </motion.button>
//                     </div>
//                 </motion.div>

//                 <motion.div
//                     className="hidden md:block"
//                     initial={{ opacity: 0, x: 50 }}
//                     animate={{ opacity: 1, x: 0 }}
//                 >
//                     <img
//                         src="https://images.unsplash.com/photo-1586773860418-d37222d8fce3"
//                         className="rounded-xl shadow-2xl"
//                         alt=""
//                     />
//                 </motion.div>
//             </div>

//             <div className="grid grid-cols-2 md:grid-cols-4 gap-4 px-4 md:px-16 pb-12">

//                 {[
//                     { label: "Doctors", value: "120+" },
//                     { label: "Patients", value: "10K+" },
//                     { label: "Hospitals", value: "50+" },
//                     { label: "Appointments", value: "25K+" },
//                 ].map((item, i) => (
//                     <motion.div
//                         key={i}
//                         className="bg-white/10 backdrop-blur-lg p-6 rounded-xl text-center border border-white/10"
//                         whileHover={{ scale: 1.05 }}
//                     >
//                         <h3 className="text-2xl font-bold">{item.value}</h3>
//                         <p className="text-sm text-gray-300">{item.label}</p>
//                     </motion.div>
//                 ))}
//             </div>

//             <div className="px-4 md:px-16 py-12">

//                 <div className="text-center mb-10">
//                     <p className="text-blue-400 text-xs uppercase tracking-widest mb-2">
//                         Features
//                     </p>
//                     <h2 className="text-2xl md:text-4xl font-bold">
//                         Powerful Healthcare Tools
//                     </h2>
//                 </div>

//                 <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">

//                     {[
//                         "Appointment Management",
//                         "Emergency Handling",
//                         "Digital Prescriptions",
//                         "Patient History",
//                         "Admin Control",
//                         "Scalable System",
//                     ].map((item, i) => (
//                         <motion.div
//                             key={i}
//                             className="bg-white/10 backdrop-blur-lg p-6 rounded-xl border border-white/10"
//                             whileHover={{ scale: 1.05 }}
//                         >
//                             <h3 className="font-semibold mb-2">{item}</h3>
//                             <p className="text-sm text-gray-300">
//                                 Modern solution designed for fast and secure healthcare workflow.
//                             </p>
//                         </motion.div>
//                     ))}

//                 </div>
//             </div>

//             <div className="text-center py-16">
//                 <p className="text-blue-400 text-xs uppercase mb-2">
//                     Get Started
//                 </p>

//                 <h2 className="text-2xl md:text-4xl font-bold mb-4">
//                     Upgrade Your Hospital System Today
//                 </h2>

//                 <motion.button
//                     whileHover={{ scale: 1.05 }}
//                     onClick={() => navigate("/register")}
//                     className="bg-blue-500 px-6 py-2 rounded"
//                 >
//                     Create Account
//                 </motion.button>
//             </div>

//             <div className="border-t border-white/10 px-6 md:px-16 py-10">

//                 <div className="grid md:grid-cols-3 gap-8 text-gray-300">

//                     <div>
//                         <h2 className="text-white font-bold mb-3">HMS</h2>
//                         <p className="text-sm">
//                             Modern hospital management platform for efficient healthcare.
//                         </p>
//                     </div>

//                     <div>
//                         <h2 className="text-white font-bold mb-3">Links</h2>
//                         <ul className="space-y-2 text-sm">
//                             <li onClick={() => navigate("/")}>Home</li>
//                             <li onClick={() => navigate("/login")}>Login</li>
//                             <li onClick={() => navigate("/register")}>Register</li>
//                         </ul>
//                     </div>

//                     <div>
//                         <h2 className="text-white font-bold mb-3">Contact</h2>
//                         <p className="text-sm">support@hms.com</p>
//                         <p className="text-sm">+91 9876543210</p>
//                     </div>

//                 </div>

//                 <div className="text-center text-xs mt-8 text-gray-400">
//                     © 2026 HMS Platform
//                 </div>
//             </div>

//         </div>
//     );
// }

// export default Home;




















import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { motion } from "framer-motion";

function Home() {
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);

    return (
        <div className="relative bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white min-h-screen overflow-hidden">


            <div className="absolute top-0 left-0 w-72 h-72 bg-blue-500 opacity-20 blur-3xl rounded-full"></div>
            <div className="absolute bottom-0 right-0 w-72 h-72 bg-purple-500 opacity-20 blur-3xl rounded-full"></div>


            <motion.div
                className="flex justify-between items-center px-4 md:px-10 py-4 backdrop-blur-lg bg-white/10 border-b border-white/10 sticky top-0 z-50"
                initial={{ y: -60, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
            >
                <h1 className="text-lg md:text-xl font-bold text-blue-400">HMS</h1>

                <div className="hidden md:flex gap-6 items-center">
                    <button onClick={() => navigate("/hospitals")}>Hospitals</button>
                    <button onClick={() => navigate("/login")}>Login</button>

                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        onClick={() => navigate("/register")}
                        className="bg-blue-500 px-4 py-1.5 rounded"
                    >
                        Register
                    </motion.button>
                </div>

                <button className="md:hidden" onClick={() => setOpen(!open)}>
                    ☰
                </button>
            </motion.div>


            {open && (
                <div className="md:hidden px-4 py-4 bg-white/10 backdrop-blur-lg">
                    <div className="flex flex-col gap-3">
                        <button onClick={() => navigate("/hospitals")}>Hospitals</button>
                        <button onClick={() => navigate("/login")}>Login</button>
                        <button
                            onClick={() => navigate("/register")}
                            className="bg-blue-500 px-4 py-2 rounded"
                        >
                            Register
                        </button>
                    </div>
                </div>
            )}


            <div className="grid md:grid-cols-2 items-center px-4 md:px-16 min-h-[90vh] gap-10">

                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <p className="text-blue-400 text-xs uppercase mb-2 tracking-widest">
                        Healthcare Platform
                    </p>

                    <h1 className="text-3xl md:text-5xl font-bold leading-tight mb-4">
                        Next Generation Hospital Management System
                    </h1>

                    <p className="text-gray-300 mb-6 text-sm md:text-base">
                        A powerful digital solution for managing hospitals, doctors,
                        patients, and appointments with speed and efficiency.
                    </p>

                    <div className="flex flex-wrap gap-3">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            onClick={() => navigate("/register")}
                            className="bg-blue-500 px-6 py-2 rounded w-full md:w-auto"
                        >
                            Get Started
                        </motion.button>

                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            onClick={() => navigate("/login")}
                            className="border border-white/30 px-6 py-2 rounded w-full md:w-auto"
                        >
                            Login
                        </motion.button>
                    </div>
                </motion.div>

                <motion.div
                    className="hidden md:block"
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                >
                    <img
                        src="https://images.unsplash.com/photo-1586773860418-d37222d8fce3"
                        className="rounded-xl shadow-2xl"
                        alt=""
                    />
                </motion.div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 px-4 md:px-16 pb-12">
                {[
                    { label: "Doctors", value: "120+" },
                    { label: "Patients", value: "10K+" },
                    { label: "Hospitals", value: "50+" },
                    { label: "Appointments", value: "25K+" },
                ].map((item, i) => (
                    <motion.div
                        key={i}
                        className="bg-white/10 backdrop-blur-lg p-6 rounded-xl text-center border border-white/10 hover:border-blue-400 transition"
                        whileHover={{ scale: 1.05 }}
                    >
                        <h3 className="text-2xl font-bold">{item.value}</h3>
                        <p className="text-sm text-gray-300">{item.label}</p>
                        <p className="text-xs text-gray-500 mt-1">
                            Active platform usage
                        </p>
                    </motion.div>
                ))}
            </div>

            <div className="px-4 md:px-16 py-10 text-center">
                <p className="text-gray-400 text-sm mb-6">
                    Trusted by hospitals and clinics across India
                </p>

                <div className="flex flex-wrap justify-center gap-6 opacity-70 text-sm">
                    <span>Apollo</span>
                    <span>Fortis</span>
                    <span>AIIMS</span>
                    <span>Medanta</span>
                    <span>Care Hospital</span>
                </div>
            </div>


            <div className="px-4 md:px-16 py-12">

                <div className="text-center mb-10">
                    <p className="text-blue-400 text-xs uppercase tracking-widest mb-2">
                        Features
                    </p>
                    <h2 className="text-2xl md:text-4xl font-bold">
                        Powerful Healthcare Tools
                    </h2>
                </div>

                <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {[
                        "Appointment Management",
                        "Emergency Handling",
                        "Digital Prescriptions",
                        "Patient History",
                        "Admin Control",
                        "Scalable System",
                    ].map((item, i) => (
                        <motion.div
                            key={i}
                            className="bg-white/10 backdrop-blur-lg p-6 rounded-xl border border-white/10 hover:border-blue-400 transition"
                            whileHover={{ scale: 1.05 }}
                        >
                            <h3 className="font-semibold text-lg mb-2">{item}</h3>
                            <p className="text-sm text-gray-300">
                                Modern solution designed for fast and secure healthcare workflow.
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>

            <div className="text-center py-16">
                <p className="text-blue-400 text-xs uppercase mb-2">
                    Get Started
                </p>

                <h2 className="text-2xl md:text-4xl font-bold mb-4">
                    Upgrade Your Hospital System Today
                </h2>

                <motion.button
                    whileHover={{ scale: 1.05 }}
                    onClick={() => navigate("/register")}
                    className="bg-blue-500 px-6 py-2 rounded"
                >
                    Create Account
                </motion.button>
            </div>


            <div className="border-t border-white/10 px-6 md:px-16 py-10 bg-black/30 backdrop-blur-lg">

                <div className="grid md:grid-cols-3 gap-8 text-gray-300">

                    <div>
                        <h2 className="text-white font-bold mb-3">HMS</h2>
                        <p className="text-sm">
                            Modern hospital management platform for efficient healthcare.
                        </p>
                    </div>

                    <div>
                        <h2 className="text-white font-bold mb-3">Links</h2>
                        <ul className="space-y-2 text-sm">
                            <li onClick={() => navigate("/")}>Home</li>
                            <li onClick={() => navigate("/login")}>Login</li>
                            <li onClick={() => navigate("/register")}>Register</li>
                        </ul>
                    </div>

                    <div>
                        <h2 className="text-white font-bold mb-3">Contact</h2>
                        <p className="text-sm">support@hms.com</p>
                        <p className="text-sm">+91 9876543210</p>
                    </div>

                </div>

                <div className="text-center text-xs mt-8 text-gray-400">
                    © 2026 HMS Platform
                </div>
            </div>

        </div>
    );
}

export default Home;