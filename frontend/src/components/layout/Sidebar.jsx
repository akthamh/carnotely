import { NavLink } from "react-router-dom";
import {
  FaTachometerAlt,
  FaCar,
  FaGasPump,
  FaFileAlt,
  FaCog,
  FaWrench,
} from "react-icons/fa";
import { motion } from "framer-motion";

export const links = [
  { to: "/dashboard", label: "Dashboard", icon: <FaTachometerAlt /> },
  { to: "/cars", label: "Cars", icon: <FaCar /> },
  { to: "/fuel", label: "Fuel", icon: <FaGasPump /> },
  { to: "/service", label: "Service", icon: <FaWrench /> },
  { to: "/documents", label: "Documents", icon: <FaFileAlt /> },
  { to: "/settings", label: "Settings", icon: <FaCog /> },
];

export default function Sidebar() {
  return (
    <aside className="w-60 bg-white border-r border-slate-200 hidden md:block min-h-screen">
      <div className="p-4 text-xl font-bold text-slate-800">Menu</div>
      <nav className="flex flex-col gap-1 px-2">
        {links.map(({ to, label, icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2 rounded-xl transition-all duration-200 ${
                isActive
                  ? "bg-blue-100 text-blue-700 font-medium"
                  : "text-slate-700 hover:bg-blue-50"
              }`
            }
          >
            <motion.span
              className="text-lg"
              whileHover={{ scale: 1.1 }}
              transition={{ duration: 0.2 }}
            >
              {icon}
            </motion.span>
            {label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}