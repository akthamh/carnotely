// frontend/src/components/layout/DashboardLayout.jsx
import Navbar from "./layout/Navbar";
import Sidebar from "./layout/Sidebar";

export default function DashboardLayout({ children }) {
	return (
		<div className="min-h-screen bg-umayyad-charcoal dark:bg-slate-900 flex transition-all duration-300">
			<Sidebar />
			<div className="flex-1 flex flex-col">
				<Navbar />
				<main className="flex-1 bg-slate-100 dark:bg-slate-900 px-4 sm:px-6 lg:px-8 py-6 transition-all duration-300">
					{children}
				</main>
			</div>
		</div>
	);
}
