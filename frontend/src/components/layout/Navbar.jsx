import { UserButton } from "@clerk/clerk-react";
import { NavLink } from "react-router-dom";
import { FaBars } from "react-icons/fa";
import { useState } from "react";
import { links } from "./Sidebar";

export default function Navbar() {
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

	return (
		<nav className="h-16 bg-gradient-to-r from-slate-800 to-slate-900 text-white flex items-center justify-between px-4 md:px-6 shadow-lg">
			<div className="flex items-center gap-3">
				<button
					className="md:hidden text-white focus:outline-none transform transition-transform hover:scale-110"
					onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
				>
					<FaBars className="w-6 h-6" />
				</button>
				<h1 className="text-xl md:text-2xl font-bold tracking-tight transition-all duration-300 hover:text-slate-200">
					Car Service Tracker
				</h1>
			</div>
			<div className="flex items-center gap-4">
				<UserButton
					appearance={{
						elements: {
							userButtonAvatarBox:
								"w-10 h-10 border-2 border-slate-300 rounded-full transition-all duration-300 hover:border-slate-100",
						},
					}}
				/>
			</div>
			<div
				className={`absolute top-16 left-0 w-full bg-gradient-to-b from-slate-800 to-slate-900 text-white p-4 md:hidden shadow-lg z-50 transition-all duration-300 ease-in-out ${
					isMobileMenuOpen
						? "opacity-100 translate-y-0"
						: "opacity-0 -translate-y-4 pointer-events-none"
				}`}
			>
				<nav className="flex flex-col gap-2">
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
							onClick={() => setIsMobileMenuOpen(false)}
						>
							<div className="transform transition-transform duration-200 hover:scale-110">
								{icon}
							</div>
							{label}
						</NavLink>
					))}
				</nav>
			</div>
		</nav>
	);
}
