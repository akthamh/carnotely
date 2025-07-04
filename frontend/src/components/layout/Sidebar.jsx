import { NavLink } from "react-router-dom";
import {
	FaTachometerAlt,
	FaCar,
	FaGasPump,
	FaFileAlt,
	FaCog,
} from "react-icons/fa";

export const links = [
	{
		to: "/dashboard",
		label: "Dashboard",
		icon: <FaTachometerAlt className="w-6 h-6" />,
	},
	{ to: "/cars", label: "Cars", icon: <FaCar className="w-6 h-6" /> },
	{ to: "/fuel", label: "Fuel", icon: <FaGasPump className="w-6 h-6" /> },
	{
		to: "/documents",
		label: "Documents",
		icon: <FaFileAlt className="w-6 h-6" />,
	},
	{ to: "/settings", label: "Settings", icon: <FaCog className="w-6 h-6" /> },
];

export default function Sidebar() {
	return (
		<aside className="w-60 bg-gradient-to-b from-slate-800 to-slate-900 text-white min-h-screen hidden md:block transition-all duration-300">
			<div className="p-4 text-2xl font-bold text-slate-100 transition-all duration-300 hover:text-slate-200">
				Menu
			</div>
			<nav className="flex flex-col gap-2 p-2">
				{links.map(({ to, label, icon }) => (
					<NavLink
						key={to}
						to={to}
						className={({ isActive }) =>
							`flex items-center gap-3 px-4 py-2 rounded-lg transition-all duration-200 hover:bg-slate-700 hover:text-slate-100 ${
								isActive
									? "bg-slate-800 text-slate-100"
									: "text-slate-300"
							}`
						}
					>
						<div className="transform transition-transform duration-200 hover:scale-110">
							{icon}
						</div>
						{label}
					</NavLink>
				))}
			</nav>
		</aside>
	);
}
