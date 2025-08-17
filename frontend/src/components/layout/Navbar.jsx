import { SignedOut, SignedIn, UserButton, useUser } from "@clerk/clerk-react";
import { FaBars, FaMoon, FaSun } from "react-icons/fa";
import { useState } from "react";
import { NavLink } from "react-router-dom";
import { links } from "./Sidebar";
import { motion, AnimatePresence } from "framer-motion";
import { useSettings } from "../../contexts/SettingsContext";

export default function Navbar() {
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
	const { user } = useUser();
	const { nightMode, toggleNightMode } = useSettings();

	return (
		<nav className="h-16 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between px-4 sm:px-6 lg:px-8 shadow-sm relative">
			<div className="flex items-center gap-3">
				<h1 className="text-lg font-bold text-slate-800 dark:text-slate-100 animate-fade-in">
					Car Notely 🚗
				</h1>
			</div>

			<div className="flex items-center gap-3">
				<SignedIn>
					<div className="hidden md:flex items-center gap-3">
						<span className="text-slate-600 dark:text-slate-300 text-sm">
							{user?.username ||
								user?.fullName ||
								user?.emailAddresses[0]?.emailAddress}
						</span>
						<button
							onClick={toggleNightMode}
							className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
							aria-label="Toggle night mode"
						>
							{nightMode ? (
								<FaSun className="text-yellow-500 w-5 h-5" />
							) : (
								<FaMoon className="text-slate-600 dark:text-slate-300 w-5 h-5" />
							)}
						</button>
						<UserButton
							appearance={{
								elements: {
									userButtonAvatarBox:
										"ring-2 ring-blue-500 dark:ring-blue-400",
									userButtonPopoverCard:
										"rounded-md shadow-lg border border-gray-200 dark:border-slate-600 dark:bg-slate-700",
								},
							}}
						/>
					</div>
				</SignedIn>

				<button
					className="md:hidden text-slate-600 dark:text-slate-300 focus:outline-none"
					onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
					aria-label="Toggle mobile menu"
				>
					<FaBars className="w-6 h-6" />
				</button>
			</div>

			<AnimatePresence>
				{isMobileMenuOpen && (
					<motion.div
						initial={{ opacity: 0, translateY: -10 }}
						animate={{ opacity: 1, translateY: 0 }}
						exit={{ opacity: 0, translateY: -10 }}
						transition={{ duration: 0.3, ease: "easeInOut" }}
						className="absolute top-16 left-0 w-full bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 shadow-md z-50"
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
												? "bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 font-medium"
												: "text-slate-700 dark:text-slate-200 hover:bg-blue-50 dark:hover:bg-blue-900"
										}`
									}
								>
									<span className="text-lg">{icon}</span>
									{label}
								</NavLink>
							))}
							<SignedIn>
								<div className="mt-4 flex items-center justify-between border-t dark:border-slate-600 pt-3">
									<span className="text-slate-600 dark:text-slate-300 text-sm">
										{user?.username ||
											user?.fullName ||
											user?.emailAddresses[0]
												?.emailAddress}
									</span>
									<div className="flex items-center gap-3">
										<button
											onClick={toggleNightMode}
											className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-blue-900 transition-colors"
											aria-label="Toggle night mode"
										>
											{nightMode ? (
												<FaSun className="text-yellow-500 w-5 h-5" />
											) : (
												<FaMoon className="text-slate-600 dark:text-slate-300 w-5 h-5" />
											)}
										</button>
										<UserButton
											appearance={{
												elements: {
													userButtonAvatarBox:
														"ring-2 ring-blue-500 dark:ring-blue-400",
													userButtonPopoverCard:
														"rounded-md shadow-lg border border-gray-200 dark:border-slate-600 dark:bg-slate-700",
												},
											}}
										/>
									</div>
								</div>
							</SignedIn>
						</nav>
					</motion.div>
				)}
			</AnimatePresence>
		</nav>
	);
}
