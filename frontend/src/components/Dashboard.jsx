import { useMemo } from "react";
import { FaCar, FaGasPump, FaWrench, FaPlus } from "react-icons/fa";
import { Link } from "react-router-dom";
import dayjs from "dayjs";
import {
	LineChart,
	Line,
	BarChart,
	Bar,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	ResponsiveContainer,
	Label,
} from "recharts";
import DashboardLayout from "./DashboardLayout";
import { useSettings } from "../contexts/SettingsContext";
import { formatCurrency } from "../utils/formatCurrency";
import { formatDistance } from "../utils/formatDistance";
import { useData } from "../contexts/DataContext";
import { motion } from "framer-motion";

export default function Dashboard() {
	const { settings, nightMode } = useSettings();
	const {
		cars,
		fuels,
		services,
		getRecentFuels,
		getRecentServices,
		monthlyFuelData,
		monthlyServiceData,
		loadingCars,
		loadingFuels,
	} = useData();

	const totalFuelCost = monthlyFuelData.reduce(
		(sum, item) => sum + item.totalCost,
		0
	);
	const totalServiceCost = monthlyServiceData.reduce(
		(sum, item) => sum + item.totalCost,
		0
	);

	const widgets = [
		{
			title: "Total Cars",
			value: cars.length.toString(),
			icon: <FaCar className="text-white text-xl" />,
			bgColor: "bg-blue-500 dark:bg-blue-600",
			iconBg: "bg-blue-400 dark:bg-blue-500",
			link: "/cars",
		},
		{
			title: "Total Fuel Cost",
			value: formatCurrency(totalFuelCost, settings.currency),
			icon: <FaGasPump className="text-white text-xl" />,
			bgColor: "bg-amber-500 dark:bg-amber-600",
			iconBg: "bg-amber-400 dark:bg-amber-500",
			link: "/fuel",
		},
		{
			title: "Total Service Cost",
			value: formatCurrency(totalServiceCost, settings.currency),
			icon: <FaWrench className="text-white text-xl" />,
			bgColor: "bg-emerald-500 dark:bg-emerald-600",
			iconBg: "bg-emerald-400 dark:bg-emerald-500",
			link: "/service",
		},
	];

	const carMap = useMemo(() => {
		return cars.reduce((map, car) => {
			map[car._id] = car;
			return map;
		}, {});
	}, [cars]);

	const mergedMonthlyData = useMemo(() => {
		const mergedMap = new Map();
		monthlyFuelData.forEach(({ month, totalCost }) => {
			mergedMap.set(month, {
				month,
				fuelCost: totalCost,
				serviceCost: 0,
			});
		});
		monthlyServiceData.forEach(({ month, totalCost }) => {
			if (mergedMap.has(month)) {
				mergedMap.get(month).serviceCost = totalCost;
			} else {
				mergedMap.set(month, {
					month,
					fuelCost: 0,
					serviceCost: totalCost,
				});
			}
		});
		const monthOrder = [
			"Jan",
			"Feb",
			"Mar",
			"Apr",
			"May",
			"Jun",
			"Jul",
			"Aug",
			"Sep",
			"Oct",
			"Nov",
			"Dec",
		];
		return Array.from(mergedMap.values()).sort(
			(a, b) => monthOrder.indexOf(a.month) - monthOrder.indexOf(b.month)
		);
	}, [monthlyFuelData, monthlyServiceData]);

	return (
		<DashboardLayout>
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 dark:bg-slate-900">
				<motion.h1
					className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-8"
					initial={{ opacity: 0, y: -20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.4 }}
				>
					Dashboard
				</motion.h1>

				<motion.div
					className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-10"
					initial="hidden"
					animate="visible"
					variants={{
						hidden: { opacity: 0 },
						visible: {
							opacity: 1,
							transition: { staggerChildren: 0.15 },
						},
					}}
				>
					{widgets.map((item, idx) => (
						<motion.div
							key={idx}
							variants={{
								hidden: { opacity: 0, y: 20 },
								visible: { opacity: 1, y: 0 },
							}}
						>
							<Link
								to={item.link}
								className={`rounded-2xl p-4 sm:p-6 text-white flex justify-between items-center hover:opacity-90 transition-opacity ${item.bgColor}`}
							>
								<div>
									<p className="text-base sm:text-lg font-medium mb-2">
										{item.title}
									</p>
									<p className="text-2xl sm:text-3xl font-bold">
										{item.value}
									</p>
								</div>
								<div
									className={`${item.iconBg} p-3 rounded-full shadow-md`}
								>
									{item.icon}
								</div>
							</Link>
						</motion.div>
					))}
				</motion.div>

				<motion.div
					className="mt-12 grid grid-cols-1 lg:grid-cols-3 gap-8"
					initial={{ opacity: 0, y: 30 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.3 }}
				>
					<div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow col-span-2">
						<h3 className="text-xl font-semibold mb-4 text-slate-700 dark:text-slate-200">
							Monthly Fuel & Service Spend (Line Chart)
						</h3>
						<ResponsiveContainer width="100%" height={300}>
							<LineChart
								data={mergedMonthlyData}
								margin={{
									top: 20,
									right: 10,
									left: 10,
									bottom: 5,
								}}
							>
								<CartesianGrid
									strokeDasharray="3 3"
									stroke="#d1d5db"
								/>
								<XAxis dataKey="month" stroke="#64748b" />
								<YAxis stroke="#64748b" />
								<Tooltip
									contentStyle={{
										backgroundColor: nightMode
											? "#1e293b"
											: "#fff",
										color: nightMode ? "#fff" : "#1e293b",
										borderRadius: "8px",
									}}
									formatter={(value) =>
										formatCurrency(value, settings.currency)
									}
								/>
								<Line
									type="monotone"
									dataKey="fuelCost"
									stroke="#f59e0b"
									strokeWidth={2}
									name="Fuel Cost"
									dot={{ r: 3 }}
									activeDot={{ r: 6 }}
								/>
								<Line
									type="monotone"
									dataKey="serviceCost"
									stroke="#10b981"
									strokeWidth={2}
									name="Service Cost"
									dot={{ r: 3 }}
									activeDot={{ r: 6 }}
								/>
							</LineChart>
						</ResponsiveContainer>
					</div>

					<div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow w-full">
						<h3 className="text-xl font-semibold mb-4 text-slate-700 dark:text-slate-200">
							Recent Fuel Logs
						</h3>
						<ul className="divide-y divide-gray-200 dark:divide-slate-700 p-0">
							{loadingFuels || loadingCars ? (
								<p className="text-slate-500 dark:text-slate-400">
									Loading logs...
								</p>
							) : fuels.length === 0 ? (
								<p className="text-slate-500 dark:text-slate-400">
									No recent logs.
								</p>
							) : (
								getRecentFuels.map((log) => (
									<li key={log._id} className="py-3 w-full">
										<div className="text-sm font-medium text-slate-800 dark:text-slate-200 flex gap-x-2 items-center w-full">
											<span>{log.fuelType}</span>
											<span>-</span>
											<span>
												{carMap[log.carId]?.model ||
													"Unknown Car"}
											</span>
										</div>
										<p className="text-sm text-slate-500 dark:text-slate-400 w-full flex flex-wrap gap-x-2">
											<span className="whitespace-nowrap">
												{dayjs(log.fuelDate).format(
													settings.dateFormat
												)}
											</span>
											<span className="whitespace-nowrap">
												{formatCurrency(
													log.fuelTotalCost,
													settings.currency
												)}
											</span>
											<span className="whitespace-nowrap">
												{formatDistance(
													settings.distanceUnit ===
														"miles"
														? log.mileage * 0.621371
														: log.mileage,
													settings.distanceUnit
												)}
											</span>
										</p>
									</li>
								))
							)}
						</ul>
					</div>
				</motion.div>

				<motion.div
					className="mt-12 grid grid-cols-1 lg:grid-cols-3 gap-8"
					initial={{ opacity: 0, y: 30 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.4 }}
				>
					<div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow w-full">
						<h3 className="text-xl font-semibold mb-4 text-slate-700 dark:text-slate-200">
							Recent service Logs
						</h3>
						<ul className="divide-y divide-gray-200 dark:divide-slate-700 p-0">
							{loadingFuels || loadingCars ? (
								<p className="text-slate-500 dark:text-slate-400">
									Loading logs...
								</p>
							) : fuels.length === 0 ? (
								<p className="text-slate-500 dark:text-slate-400">
									No recent logs.
								</p>
							) : (
								getRecentServices.map((log) => (
									<li key={log._id} className="py-3 w-full">
										<div className="text-sm font-medium text-slate-800 dark:text-slate-200 flex gap-x-2 items-center w-full">
											<span>{log.serviceName}</span>
											<span>-</span>
											<span>
												{carMap[log.carId]?.model ||
													"Unknown Car"}
											</span>
										</div>
										<p className="text-sm text-slate-500 dark:text-slate-400 w-full flex flex-wrap gap-x-2">
											<span className="whitespace-nowrap">
												{dayjs(log.fuelDate).format(
													settings.dateFormat
												)}
											</span>
											<span className="whitespace-nowrap">
												{formatCurrency(
													log.totalCost,
													settings.currency
												)}
											</span>
											<span className="whitespace-nowrap">
												{formatDistance(
													settings.distanceUnit ===
														"miles"
														? log.mileage * 0.621371
														: log.mileage,
													settings.distanceUnit
												)}
											</span>
										</p>
									</li>
								))
							)}
						</ul>
					</div>
					<div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow col-span-2">
						<h3 className="text-xl font-semibold mb-4 text-slate-700 dark:text-slate-200">
							Monthly Fuel & Service Spend (Bar Chart)
						</h3>
						<ResponsiveContainer width="100%" height={300}>
							<BarChart
								data={mergedMonthlyData}
								margin={{
									top: 20,
									right: 10,
									left: 10,
									bottom: 5,
								}}
							>
								<CartesianGrid
									strokeDasharray="3 3"
									stroke="#d1d5db"
								/>
								<XAxis dataKey="month" stroke="#64748b" />
								<YAxis stroke="#64748b" />
								<Tooltip
									contentStyle={{
										backgroundColor: nightMode
											? "#1e293b"
											: "#fff",
										color: nightMode ? "#fff" : "#1e293b",
										borderRadius: "8px",
									}}
									formatter={(value) =>
										formatCurrency(value, settings.currency)
									}
								/>
								<Bar
									dataKey="fuelCost"
									fill="#f59e0b"
									radius={[4, 4, 0, 0]}
									name="Fuel Cost"
								>
									<Label
										dataKey="fuelCost"
										position="bottom"
										fill="#64748b"
										formatter={(value) =>
											formatCurrency(
												value,
												settings.currency
											)
										}
										offset={-5}
										fontSize={12}
									/>
								</Bar>
								<Bar
									dataKey="serviceCost"
									fill="#10b981"
									radius={[4, 4, 0, 0]}
									name="Service Cost"
								>
									<Label
										dataKey="serviceCost"
										position="bottom"
										fill="#64748b"
										formatter={(value) =>
											formatCurrency(
												value,
												settings.currency
											)
										}
										offset={-5}
										fontSize={12}
									/>
								</Bar>
							</BarChart>
						</ResponsiveContainer>
					</div>
				</motion.div>
			</div>
		</DashboardLayout>
	);
}
