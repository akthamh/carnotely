import { useState } from "react";
import {
	FaCalendarAlt,
	FaTrash,
	FaEdit,
	FaCogs,
	FaUserCog,
	FaDollarSign,
	FaRoad,
	FaBuilding,
	FaComment,
	FaOilCan,
	FaFilter,
	FaBatteryFull,
	FaTools,
	FaPlug,
	FaCarSide,
	FaSoap,
	FaCarCrash,
	FaDiagnoses,
	FaWrench,
	FaTachometerAlt,
	FaCar,
} from "react-icons/fa";

import {
	MdAir,
	MdBatteryChargingFull,
	MdOutlineTireRepair,
	MdOutlineBuild,
} from "react-icons/md";
import { BiSolidCarBattery, BiSolidCarWash } from "react-icons/bi";
import {
	RiOilFill,
	RiSteering2Line,
	RiDashboard2Line,
	RiToolsLine,
} from "react-icons/ri";

import { motion, AnimatePresence } from "framer-motion";
import dayjs from "dayjs";
import { useSettings } from "../../contexts/SettingsContext";
import { formatCurrency } from "../../utils/formatCurrency";
import { formatDistance } from "../../utils/formatDistance";

export const SERVICE_TYPES_WITH_ICONS = [
	{ type: "Periodic Maintenance", icon: FaTools },
	{ type: "Engine Air Filter", icon: MdAir },
	{ type: "Oil Filter", icon: RiOilFill },
	{ type: "Brake Fluid", icon: FaOilCan },
	{ type: "Oil Change", icon: FaOilCan },
	{ type: "Tire Change", icon: MdOutlineTireRepair },
	{ type: "Battery Replacement", icon: BiSolidCarBattery },
	{ type: "Brake Repair", icon: MdOutlineBuild },
	{ type: "Brake Pad Replacement", icon: MdOutlineBuild },
	{ type: "Brake Discs and Pads", icon: MdOutlineBuild },
	{ type: "Spark Plugs", icon: FaPlug },
	{ type: "Clutch Repair", icon: RiToolsLine },
	{ type: "Wheels", icon: MdOutlineTireRepair },
	{ type: "Steering Repair", icon: RiSteering2Line },
	{ type: "Wash", icon: BiSolidCarWash },
	{ type: "Suspension Repair", icon: RiDashboard2Line },
	{ type: "Tire Repair", icon: MdOutlineTireRepair },
	{ type: "Transmission Repair", icon: RiToolsLine },
	{ type: "Diagnostic Service", icon: MdOutlineBuild },
	{ type: "Other", icon: FaWrench },
];

export default function ServiceCard({ service, cars, onEdit, onDelete }) {
	const { settings } = useSettings();
	const [isOpen, setIsOpen] = useState(false);
	const car = cars.find((c) => c._id === service.carId);
	const carName = car ? `${car.make} ${car.model}` : "Unknown Car";
	const formattedDate = dayjs(service.serviceDate).format(
		settings.dateFormat
	);
	const totalCost = formatCurrency(
		service.totalCost ||
			parseFloat(service.partsCost || 0) +
				parseFloat(service.laborCost || 0),
		settings.currency
	);
	const partsCost = formatCurrency(service.partsCost || 0, settings.currency);
	const laborCost = formatCurrency(service.laborCost || 0, settings.currency);
	const mileage = formatDistance(
		settings.distanceUnit === "miles"
			? service.mileage * 0.621371
			: service.mileage,
		settings.distanceUnit
	);
	const ServiceIcon =
		SERVICE_TYPES_WITH_ICONS.find((s) => s.type === service.serviceName)
			?.icon || FaWrench;

	return (
		<motion.div
			className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm p-4 mb-4 flex items-start gap-4 hover:shadow transition-all cursor-pointer"
			onClick={() => setIsOpen(!isOpen)}
			whileHover={{ scale: 1.01 }}
			transition={{ duration: 0.2 }}
		>
			<div className="flex-shrink-0 text-blue-500 dark:text-blue-400 text-3xl mt-2">
				<ServiceIcon />
			</div>

			<div className="flex-1">
				<div className="flex justify-between items-center">
					<h3 className="text-sm md:text-lg font-semibold text-slate-800 dark:text-slate-100">
						<span className="text-sm hidden sm:inline">
							{carName} -{" "}
						</span>{" "}
						{service.serviceName}
					</h3>
					<span className="text-sm text-slate-500 dark:text-slate-400">
						<FaCalendarAlt className="inline mr-1" />
						{formattedDate}
					</span>
				</div>

				<div className="text-sm text-slate-600 dark:text-slate-300 mt-1">
					{totalCost} |{" "}
					<span className="text-indigo-700 dark:text-indigo-400">
						{mileage}
					</span>
				</div>

				<AnimatePresence>
					{isOpen && (
						<motion.div
							initial={{ height: 0, opacity: 0 }}
							animate={{ height: "auto", opacity: 1 }}
							exit={{ height: 0, opacity: 0 }}
							transition={{ duration: 0.3, ease: "easeInOut" }}
							className="mt-4 space-y-2 text-sm text-slate-700 dark:text-slate-300 border-t dark:border-slate-600 pt-3 overflow-hidden"
						>
							<div className="flex items-center gap-2">
								<FaCogs className="text-slate-400 dark:text-slate-500" />
								Parts Cost: <strong>{partsCost}</strong>
							</div>
							<div className="flex items-center gap-2">
								<FaUserCog className="text-slate-400 dark:text-slate-500" />
								Labor Cost: <strong>{laborCost}</strong>
							</div>
							<div className="flex items-center gap-2">
								<FaDollarSign className="text-slate-400 dark:text-slate-500" />
								Total Cost: <strong>{totalCost}</strong>
							</div>
							<div className="flex items-center gap-2">
								<FaRoad className="text-slate-400 dark:text-slate-500" />
								Mileage: <strong>{mileage}</strong>
							</div>
							<div className="flex items-center gap-2">
								<FaBuilding className="text-slate-400 dark:text-slate-500" />
								Service Center:{" "}
								<strong>
									{service.serviceCenterName || "N/A"}
								</strong>
							</div>
							<div className="flex items-start gap-2">
								<FaComment className="text-slate-400 dark:text-slate-500 mt-1" />
								<i>{service.comment || "No comment"}</i>
							</div>

							<div className="flex gap-3 pt-3">
								<button
									onClick={(e) => {
										e.stopPropagation();
										onEdit();
									}}
									className="px-3 py-1 rounded-lg bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-800 transition"
								>
									<FaEdit className="inline mr-1" /> Edit
								</button>
								<button
									onClick={(e) => {
										e.stopPropagation();
										onDelete();
									}}
									className="px-3 py-1 rounded-lg bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 hover:bg-red-200 dark:hover:bg-red-800 transition"
								>
									<FaTrash className="inline mr-1" /> Delete
								</button>
							</div>
						</motion.div>
					)}
				</AnimatePresence>
			</div>
		</motion.div>
	);
}
