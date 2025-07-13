// frontend/src/components/layout/Navbar.jsx
import { SignedOut, SignedIn, UserButton, useUser } from "@clerk/clerk-react";
import { FaBars, FaMoon, FaSun } from "react-icons/fa";
import { useState } from "react";
import { NavLink } from "react-router-dom";
import { links } from "./Sidebar";
import { motion, AnimatePresence } from "framer-motion";
import { useSettings } from "../../context/SettingsContext";
import { toast } from "react-hot-toast";

export default function Navbar() {
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
	const { user } = useUser();
	const { settings, setSettings, axiosInstance } = useSettings();
	const [toggling, setToggling] = useState(false);

	const toggleNightMode = async () => {
		setToggling(true);
		try {
			const newSettings = { ...settings, nightMode: !settings.nightMode };
			const res = await axiosInstance.post("/settings", newSettings);
			setSettings(res.data);
			toast.success(
				`Night mode ${res.data.nightMode ? "enabled" : "disabled"}`
			);
		} catch (err) {
			console.error("Error toggling night mode:", err);
			toast.error(
				err.response?.data?.message || "Failed to toggle night mode"
			);
		} finally {
			setToggling(false);
		}
	};

	return (
		<nav className="h-16 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between px-4 sm:px-6 lg:px-8 shadow-sm relative">
			{/* Left side: Logo */}
			<div className="flex items-center gap-3">
				<h1 className="text-lg font-bold text-slate-800 dark:text-slate-100 animate-fade-in">
					Car Notely 🚗
				</h1>
			</div>

			{/* Right side: user info, night mode toggle & hamburger */}
			<div className="flex items-center gap-3">
				{/* Desktop Clerk Info & Night Mode */}
				<SignedIn>
					<div className="hidden md:flex items-center gap-3">
						<span className="text-slate-600 dark:text-slate-300 text-sm">
							{user?.username ||
								user?.fullName ||
								user?.emailAddresses[0]?.emailAddress}
						</span>
						<button
							onClick={toggleNightMode}
							disabled={toggling}
							className="text-slate-600 dark:text-slate-300 hover:text-blue-500 dark:hover:text-blue-400 disabled:opacity-50"
							aria-label="Toggle night mode"
						>
							{settings.nightMode ? (
								<FaSun className="w-5 h-5" />
							) : (
								<FaMoon className="w-5 h-5" />
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

				{/* Mobile menu toggle */}
				<button
					className="md:hidden text-slate-600 dark:text-slate-300 focus:outline-none"
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
							{/* Mobile Clerk Info & Night Mode */}
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
											disabled={toggling}
											className="text-slate-600 dark:text-slate-300 hover:text-blue-500 dark:hover:text-blue-400 disabled:opacity-50"
											aria-label="Toggle night mode"
										>
											{settings.nightMode ? (
												<FaSun className="w-5 h-5" />
											) : (
												<FaMoon className="w-5 h-5" />
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
