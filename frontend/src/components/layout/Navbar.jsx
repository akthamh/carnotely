import { SignedOut, SignedIn, UserButton, useUser } from "@clerk/clerk-react";
import { FaBars } from "react-icons/fa";
import { useState } from "react";
import { NavLink } from "react-router-dom";
import { links } from "./Sidebar";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
	const { user } = useUser();

	return (
		<nav className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 sm:px-6 lg:px-8 shadow-sm relative">
			{/* Left side: Logo */}
			<div className="flex items-center gap-3">
				<h1 className="text-lg font-bold text-slate-800">
					Car Notely 🚗
				</h1>
			</div>

			{/* Right side: user info & hamburger */}
			<div className="flex items-center gap-3">
				{/* Desktop Clerk Info */}
				<SignedIn>
					<div className="hidden md:flex items-center gap-3">
						<span className="text-slate-600 text-sm">
							{user?.username ||
								user?.fullName ||
								user?.emailAddresses[0]?.emailAddress}
						</span>

						<UserButton
							appearance={{
								elements: {
									userButtonAvatarBox: "ring-2 ring-blue-500",
									userButtonPopoverCard:
										"rounded-md shadow-lg border border-gray-200",
								},
							}}
						/>
					</div>
				</SignedIn>

				{/* Mobile menu toggle */}
				<button
					className="md:hidden text-slate-600 focus:outline-none"
					onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
					aria-label="Toggle mobile menu"
				>
					<FaBars className="w-6 h-6" />
				</button>
			</div>

			{/* Mobile Menu */}
			<AnimatePresence>
				{isMobileMenuOpen && (
					<motion.div
						initial={{ opacity: 0, translateY: -10 }}
						animate={{ opacity: 1, translateY: 0 }}
						exit={{ opacity: 0, translateY: -10 }}
						transition={{ duration: 0.3, ease: "easeInOut" }}
						className="absolute top-16 left-0 w-full bg-white border-t border-slate-200 shadow-md z-50"
					>
						<nav className="flex flex-col gap-1 px-4 py-2">
							{links.map(({ to, label, icon }) => (
								<NavLink
									key={to}
									to={to}
									onClick={() => setIsMobileMenuOpen(false)}
									className={({ isActive }) =>
										`flex items-center gap-3 px-4 py-2 rounded-xl transition-all duration-200 ${
											isActive
												? "bg-blue-100 text-blue-700 font-medium"
												: "text-slate-700 hover:bg-blue-50"
										}`
									}
								>
									<span className="text-lg">{icon}</span>
									{label}
								</NavLink>
							))}

							{/* Mobile Clerk Info */}
							<SignedIn>
								<div className="mt-4 flex items-center justify-between border-t pt-3">
									<span className="text-slate-600 text-sm">
										{user?.username ||
											user?.fullName ||
											user?.emailAddresses[0]
												?.emailAddress}
									</span>
									<UserButton
										appearance={{
											elements: {
												userButtonAvatarBox:
													"ring-2 ring-blue-500",
												userButtonPopoverCard:
													"rounded-md shadow-lg border border-gray-200",
											},
										}}
									/>
								</div>
							</SignedIn>
						</nav>
					</motion.div>
				)}
			</AnimatePresence>
		</nav>
	);
}
