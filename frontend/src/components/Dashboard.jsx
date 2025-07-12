import DashboardLayout from "./DashboardLayout";
import { FaCar, FaGasPump, FaWrench, FaPlus } from "react-icons/fa";
import { Link } from "react-router-dom";

export default function Dashboard() {
	const widgets = [
		{
			title: "Total Cars",
			value: "3",
			icon: <FaCar className="text-3xl text-white" />,
			bgColor: "bg-blue-500",
			link: "/cars",
		},
		{
			title: "Total Fuel Cost",
			value: "$150.00",
			icon: <FaGasPump className="text-3xl text-white" />,
			bgColor: "bg-amber-500",
			link: "/fuel",
		},
		{
			title: "Last Service Date",
			value: "2025-06-30",
			icon: <FaWrench className="text-3xl text-white" />,
			bgColor: "bg-emerald-500",
			link: "/service",
		},
	];

	return (
		<DashboardLayout>
			<div className="container mx-auto py-6  sm:px-6 lg:px-8">
				<h1 className="text-3xl font-bold text-slate-800 mb-8">
					Dashboard
				</h1>

				<div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
					{widgets.map((item, idx) => (
						<Link
							key={idx}
							to={item.link}
							className={`rounded-2xl p-6 text-white flex justify-between items-center hover:opacity-90 transition-opacity ${item.bgColor}`}
						>
							<div>
								<p className="text-lg font-medium mb-2">
									{item.title}
								</p>
								<p className="text-3xl font-bold">
									{item.value}
								</p>
							</div>
							{item.icon}
						</Link>
					))}
				</div>

				<div className="bg-white rounded-2xl p-8 shadow-sm">
					<h2 className="text-2xl font-bold text-slate-800 mb-6">
						Quick Actions
					</h2>
					<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
						<Link
							to="/cars"
							className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg text-center transition-colors"
						>
							<FaPlus className="inline-block mr-2" />
							Add New Car
						</Link>
						<Link
							to="/fuel"
							className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg text-center transition-colors"
						>
							<FaPlus className="inline-block mr-2" />
							Add Fuel Entry
						</Link>
						<Link
							to="/service"
							className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg text-center transition-colors"
						>
							<FaPlus className="inline-block mr-2" />
							Log Service
						</Link>
					</div>
				</div>
			</div>
		</DashboardLayout>
	);
}
