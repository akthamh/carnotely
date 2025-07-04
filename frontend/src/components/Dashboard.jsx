import DashboardLayout from "./DashboardLayout";
import { FaCar, FaGasPump, FaWrench } from "react-icons/fa";

export default function Dashboard() {
	return (
		<DashboardLayout>
			<div className="container mx-auto py-6">
				<h2 className="text-3xl font-bold text-slate-800 mb-6 transition-all duration-300 hover:text-slate-700">
					Dashboard
				</h2>
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
					<Widget
						title="Total Cars"
						value="3"
						icon={
							<FaCar className="w-8 h-8 transition-transform duration-300 group-hover:scale-110" />
						}
						gradient="from-slate-600 to-slate-700"
					/>
					<Widget
						title="Total Fuel Cost"
						value="$150.00"
						icon={
							<FaGasPump className="w-8 h-8 transition-transform duration-300 group-hover:scale-110" />
						}
						gradient="from-slate-700 to-slate-800"
					/>
					<Widget
						title="Last Service Date"
						value="2025-06-30"
						icon={
							<FaWrench className="w-8 h-8 transition-transform duration-300 group-hover:scale-110" />
						}
						gradient="from-slate-800 to-slate-900"
					/>
				</div>
			</div>
		</DashboardLayout>
	);
}

function Widget({ title, value, icon, gradient }) {
	return (
		<div
			className={`bg-gradient-to-br ${gradient} rounded-2xl shadow-lg p-6 text-white transform hover:scale-105 transition-all duration-300 group`}
		>
			<div className="flex items-center justify-between">
				<div>
					<h2 className="text-lg font-semibold text-slate-200 transition-all duration-300 hover:text-slate-100">
						{title}
					</h2>
					<p className="text-3xl font-bold mt-2 text-slate-100 transition-all duration-300">
						{value}
					</p>
				</div>
				<div className="text-4xl text-slate-300">{icon}</div>
			</div>
		</div>
	);
}
