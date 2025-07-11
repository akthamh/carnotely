import DashboardLayout from "./DashboardLayout";
import { FaCar, FaGasPump, FaWrench } from "react-icons/fa";

export default function Dashboard() {
	return (
		<DashboardLayout>
			<div className="container mx-auto py-6 px-4">
				<h2 className="text-3xl font-semibold text-gray-900 mb-6">
					Dashboard
				</h2>
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
					<Widget
						title="Total Cars"
						value="3"
						icon={<FaCar className="w-7 h-7 text-indigo-600" />}
						color="bg-white"
					/>
					<Widget
						title="Total Fuel Cost"
						value="$150.00"
						icon={<FaGasPump className="w-7 h-7 text-rose-600" />}
						color="bg-white"
					/>
					<Widget
						title="Last Service Date"
						value="2025-06-30"
						icon={<FaWrench className="w-7 h-7 text-emerald-600" />}
						color="bg-white"
					/>
				</div>
			</div>
		</DashboardLayout>
	);
}

function Widget({ title, value, icon, color }) {
	return (
		<div
			className={`rounded-2xl shadow-md p-5 ${color} transition-transform hover:scale-[1.02] duration-200`}
		>
			<div className="flex items-center justify-between">
				<div>
					<h3 className="text-sm font-medium text-gray-500">
						{title}
					</h3>
					<p className="text-2xl font-semibold text-gray-900 mt-1">
						{value}
					</p>
				</div>
				<div className="bg-gray-100 rounded-full p-3">{icon}</div>
			</div>
		</div>
	);
}
