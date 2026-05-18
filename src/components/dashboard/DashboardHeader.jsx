import { motion } from "framer-motion";
import {
  Bell,
  Search,
  Settings,
  Moon,
  Sun,
  User,
  LogOut,
} from "lucide-react";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function DashboardHeader() {
  const [darkMode, setDarkMode] = useState(true);
  const [user, setUser] = useState(null);
  const [showMenu, setShowMenu] = useState(false);

  const navigate = useNavigate();

  /* ---------------- LOAD USER ---------------- */
  useEffect(() => {
    const storedUser = sessionStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem("user");
    sessionStorage.removeItem("token");
    navigate("/");
  };

  const userName = user?.name || "Guest";
  const userRole = user?.isAdmin ? "Admin" : "Designer";

  const stats = [
    { title: "Models", value: "1.2K" },
    { title: "Garments", value: "8.4K" },
    { title: "Saves", value: "12K" },
    { title: "Render", value: "99%" },
  ];

  return (
    <header className="sticky top-0 z-40 backdrop-blur-xl bg-[#050816]/70 border-b border-white/10">

      {/* TOP BAR */}
      <div className="flex items-center justify-between px-5 py-3">

        {/* LEFT */}
        <div>
          <h1 className="text-lg font-bold">
            Fashion Dashboard
          </h1>
          <p className="text-[11px] text-gray-400">
            3D Design Control Panel
          </p>
        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-3">

          {/* SEARCH */}
          <div className="glass flex items-center gap-2 px-3 py-2 rounded-xl w-[180px]">
            <Search size={14} className="text-cyan-400" />
            <input
              type="text"
              placeholder="Search..."
              className="bg-transparent outline-none w-full text-xs text-white"
            />
          </div>

          {/* THEME */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="glass w-9 h-9 rounded-lg flex items-center justify-center"
          >
            {darkMode ? (
              <Sun size={16} className="text-yellow-400" />
            ) : (
              <Moon size={16} className="text-cyan-400" />
            )}
          </button>

          {/* NOTIFICATIONS */}
          <button className="relative glass w-9 h-9 rounded-lg flex items-center justify-center">
            <Bell size={16} />
            <span className="absolute top-2 right-2 w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
          </button>

          {/* SETTINGS */}
          <button className="glass w-9 h-9 rounded-lg flex items-center justify-center">
            <Settings size={16} />
          </button>

          {/* USER */}
          <div className="relative">

            <button
              onClick={() => setShowMenu(!showMenu)}
              className="flex items-center gap-2 glass px-3 py-2 rounded-xl"
            >
              <div className="w-7 h-7 rounded-full bg-gradient-to-r from-purple-500 to-cyan-500 flex items-center justify-center">
                <User size={14} />
              </div>

              <div className="hidden sm:block text-left">
                <p className="text-xs font-semibold">
                  {userName}
                </p>
                <p className="text-[10px] text-gray-400">
                  {userRole}
                </p>
              </div>
            </button>

            {/* DROPDOWN */}
            {showMenu && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute right-0 mt-2 w-36 glass rounded-xl p-2"
              >
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 w-full px-3 py-2 text-xs hover:bg-red-500/20 rounded-lg"
                >
                  <LogOut size={14} className="text-red-400" />
                  Logout
                </button>
              </motion.div>
            )}

          </div>

        </div>
      </div>

      {/* STATS CARDS (SMALL HEIGHT) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 px-5 pb-3">

        {stats.map((item, index) => (
          <motion.div
            key={index}
            whileHover={{ y: -2, scale: 1.02 }}
            className="glass rounded-xl p-3 border border-white/10 h-[70px] flex flex-col justify-center"
          >
            <p className="text-[10px] text-gray-400">
              {item.title}
            </p>

            <h3 className="text-lg font-bold gradient-text">
              {item.value}
            </h3>
          </motion.div>
        ))}

      </div>
    </header>
  );
}

export default DashboardHeader;