import { UserButton } from "@clerk/clerk-react";
import { FaBars } from "react-icons/fa";
import { useState } from "react";
import { NavLink } from "react-router-dom";
import { links } from "./Sidebar";

export default function Navbar() {
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

	return (
		<nav className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 md:px-6 shadow-sm">
			<div className="flex items-center gap-3">
				<button
					className="md:hidden text-gray-600 focus:outline-none"
					onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
				>
					<FaBars className="w-6 h-6" />
				</button>
				<h1 className="text-lg font-semibold text-gray-800">
					Car Service Tracker
				</h1>
			</div>
			<UserButton
				appearance={{
					elements: {
						userButtonAvatarBox:
							"w-10 h-10 border border-gray-300 rounded-full",
					},
				}}
			/>
			{/* Mobile Menu */}
			<div
				className={`absolute top-16 left-0 w-full bg-white border-t border-gray-200 shadow-md z-50 transition-all duration-300 ease-in-out ${
					isMobileMenuOpen
						? "opacity-100 translate-y-0"
						: "opacity-0 -translate-y-4 pointer-events-none"
				}`}
			>
				<nav className="flex flex-col gap-1 px-4 py-2">
					{links.map(({ to, label, icon }) => (
						<NavLink
							key={to}
							to={to}
							onClick={() => setIsMobileMenuOpen(false)}
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
			</div>
		</nav>
	);
}
