import { NavLink } from "react-router-dom";
import {
	FaTachometerAlt,
	FaCar,
	FaGasPump,
	FaFileAlt,
	FaCog,
	FaWrench,
} from "react-icons/fa";

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
		<aside className="w-60 bg-white border-r border-gray-200 hidden md:block min-h-screen">
			<div className="p-4 text-xl font-semibold text-gray-800">Menu</div>
			<nav className="flex flex-col gap-1 px-2">
				{links.map(({ to, label, icon }) => (
					<NavLink
						key={to}
						to={to}
						className={({ isActive }) =>
							`flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
								isActive
									? "bg-indigo-100 text-indigo-700 font-medium"
									: "text-gray-700 hover:bg-gray-100"
							}`
						}
					>
						<span className="text-lg">{icon}</span>
						{label}
					</NavLink>
				))}
			</nav>
		</aside>
	);
}
