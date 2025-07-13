import { useEffect, useState, useMemo } from "react";
import { FaCar, FaGasPump, FaWrench, FaPlus } from "react-icons/fa";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth, useUser } from "@clerk/clerk-react";
import { setupAxios } from "../config/axios";
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

export default function Dashboard() {
	const { getToken } = useAuth();
	const { isSignedIn } = useUser();
	const axiosInstance = setupAxios(getToken);

	// State for fuel and service monthly data
	const [monthlyFuelData, setMonthlyFuelData] = useState([]);
	const [monthlyServiceData, setMonthlyServiceData] = useState([]);
	const [mergedMonthlyData, setMergedMonthlyData] = useState([]);
	const [totalFuelCost, setTotalFuelCost] = useState(0);
	const [totalServiceCost, setTotalServiceCost] = useState(0);
	const [recentFuels, setRecentFuels] = useState([]);
	const [loadingCars, setLoadingCars] = useState(false);
	const [cars, setCars] = useState([]);

	// Widgets update to use dynamic values
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
			value: `$${totalFuelCost.toFixed(2)}`,
			icon: <FaGasPump className="text-white text-xl" />,
			bgColor: "bg-amber-500 dark:bg-amber-600",
			iconBg: "bg-amber-400 dark:bg-amber-500",
			link: "/fuel",
		},
		{
			title: "Total Service Cost",
			value: `$${totalServiceCost.toFixed(2)}`,
			icon: <FaWrench className="text-white text-xl" />,
			bgColor: "bg-emerald-500 dark:bg-emerald-600",
			iconBg: "bg-emerald-400 dark:bg-emerald-500",
			link: "/service",
		},
	];

	// Map cars by id for quick lookup
	const carMap = useMemo(() => {
		return cars.reduce((map, car) => {
			map[car._id] = car;
			return map;
		}, {});
	}, [cars]);

	// Merge fuel and service monthly data by month key
	function mergeMonthlyData(fuelData, serviceData) {
		const mergedMap = new Map();
		fuelData.forEach(({ month, totalCost }) => {
			mergedMap.set(month, {
				month,
				fuelCost: totalCost,
				serviceCost: 0,
			});
		});
		serviceData.forEach(({ month, totalCost }) => {
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
	}

	// Fetch monthly fuel cost data
	const fetchMonthlyFuelCost = async () => {
		try {
			const res = await axiosInstance.get("/fuels/cost-month");
			const formatted = res.data.monthly.map((item) => ({
				month: dayjs(item.month, "YYYY-MM").format("MMM"),
				totalCost: item.totalCost,
			}));
			setMonthlyFuelData(formatted);
			setTotalFuelCost(res.data.grandTotal);
			return formatted;
		} catch (err) {
			console.error("Error loading monthly fuel cost:", err);
			return [];
		}
	};

	// Fetch monthly service cost data
	const fetchMonthlyServiceCost = async () => {
		try {
			const res = await axiosInstance.get("/services/monthly-cost");
			const formatted = res.data.monthly.map((item) => ({
				month: dayjs(item._id, "YYYY-MM").format("MMM"),
				totalCost: item.totalCost,
			}));
			setMonthlyServiceData(formatted);
			setTotalServiceCost(res.data.grandTotal);
			return formatted;
		} catch (err) {
			console.error("Error loading monthly service cost:", err);
			return [];
		}
	};

	// Fetch recent fuel logs
	const fetchRecentFuelLogs = async () => {
		try {
			const res = await axiosInstance.get("/fuels/last-five");
			setRecentFuels(res.data);
		} catch (err) {
			console.error("Error loading recent fuel logs:", err);
		}
	};

	// Fetch all cars
	const fetchCars = async () => {
		setLoadingCars(true);
		try {
			const response = await axiosInstance.get("/cars");
			setCars(response.data);
		} catch (error) {
			console.error("Error fetching cars:", error);
		} finally {
			setLoadingCars(false);
		}
	};

	useEffect(() => {
		if (isSignedIn) {
			(async () => {
				const [fuel, service] = await Promise.all([
					fetchMonthlyFuelCost(),
					fetchMonthlyServiceCost(),
				]);
				setMergedMonthlyData(mergeMonthlyData(fuel, service));
			})();
			fetchRecentFuelLogs();
			fetchCars();
		} else {
			setMonthlyFuelData([]);
			setMonthlyServiceData([]);
			setMergedMonthlyData([]);
			setRecentFuels([]);
			setCars([]);
			setTotalFuelCost(0);
			setTotalServiceCost(0);
		}
	}, [isSignedIn]);

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

				{/* Animated Cards */}
				<motion.div
					className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-10"
					initial="hidden"
					animate="visible"
					variants={{
						visible: { transition: { staggerChildren: 0.15 } },
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

				{/* Quick Actions */}
				<motion.div
					className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-sm"
					initial={{ opacity: 0, y: 30 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.2 }}
				>
					<h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-6">
						Quick Actions
					</h2>
					<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
						<Link
							to="/cars/new"
							className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-medium py-3 px-6 rounded-lg text-center transition-colors"
						>
							<FaPlus className="inline-block mr-2" />
							Add New Car
						</Link>
						<Link
							to="/fuel/new"
							className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-medium py-3 px-6 rounded-lg text-center transition-colors"
						>
							<FaPlus className="inline-block mr-2" />
							Add Fuel Entry
						</Link>
						<Link
							to="/service/new"
							className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-medium py-3 px-6 rounded-lg text-center transition-colors"
						>
							<FaPlus className="inline-block mr-2" />
							Log Service
						</Link>
					</div>
				</motion.div>

				{/* Combined Fuel & Service Charts */}
				<motion.div
					className="mt-12 grid grid-cols-1 lg:grid-cols-3 gap-8"
					initial={{ opacity: 0, y: 30 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.3 }}
				>
					{/* Combined Line Chart */}
					<div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow col-span-2">
						<h3 className="text-xl font-semibold mb-4 text-slate-700 dark:text-slate-200">
							Monthly Fuel & Service Spend (Line Chart)
						</h3>
						<ResponsiveContainer width="100%" height={300}>
							<LineChart
								data={mergedMonthlyData}
								margin={{
									top: 20,
									right: 30,
									left: 20,
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
										backgroundColor: "#fff",
										color: "#1e293b",
										borderRadius: "8px",
									}}
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

					{/* Recent Fuel Logs */}
					<div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow w-full">
						<h3 className="text-xl font-semibold mb-4 text-slate-700 dark:text-slate-200">
							Recent Fuel Logs
						</h3>
						<ul className="divide-y divide-gray-200 dark:divide-slate-700 p-0">
							{recentFuels.length === 0 ? (
								<p className="text-slate-500 dark:text-slate-400">
									No recent logs.
								</p>
							) : (
								recentFuels.map((log) => (
									<li key={log._id} className="py-3 w-full">
										<div className="text-sm font-medium text-slate-800 dark:text-slate-200 flex gap-x-2 items-center w-full">
											<span>{log.fuelType}</span>
											<span>-</span>
											<span>
												{carMap[log.carId]?.model ||
													"Unknown Car"}
											</span>
										</div>
										<p className="text-sm text-slate-500 dark:text-slate-400 w-full">
											{dayjs(log.fuelDate).format(
												"MMM D, YYYY"
											)}{" "}
											· ${log.fuelTotalCost.toFixed(2)} ·{" "}
											{log.carMileage} km
										</p>
									</li>
								))
							)}
						</ul>
					</div>
				</motion.div>

				{/* Combined Bar Chart */}
				<motion.div
					className="mt-8 bg-white dark:bg-slate-800 p-6 rounded-2xl shadow"
					initial={{ opacity: 0, y: 30 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.4 }}
				>
					<h3 className="text-xl font-semibold mb-4 text-slate-700 dark:text-slate-200">
						Monthly Fuel & Service Spend (Bar Chart)
					</h3>
					<ResponsiveContainer width="100%" height={300}>
						<BarChart
							data={mergedMonthlyData}
							margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
						>
							<CartesianGrid
								strokeDasharray="3 3"
								stroke="#d1d5db"
							/>
							<XAxis dataKey="month" stroke="#64748b" />
							<YAxis stroke="#64748b" />
							<Tooltip
								contentStyle={{
									backgroundColor: "#fff",
									color: "#1e293b",
									borderRadius: "8px",
								}}
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
										`$${value.toFixed(2)}`
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
										`$${value.toFixed(2)}`
									}
									offset={-5}
									fontSize={12}
								/>
							</Bar>
						</BarChart>
					</ResponsiveContainer>
				</motion.div>
			</div>
		</DashboardLayout>
	);
}
