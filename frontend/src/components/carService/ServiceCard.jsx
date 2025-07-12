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

export const SERVICE_TYPES_WITH_ICONS = [
	{ type: "Periodic Maintenance", icon: FaTools }, // Wrench and screwdriver for general maintenance
	{ type: "Engine Air Filter", icon: MdAir }, // Airflow icon for air filter
	{ type: "Oil Filter", icon: RiOilFill }, // Oil drop for oil filter
	{ type: "Brake Fluid", icon: FaOilCan }, // Oil can for fluid
	{ type: "Oil Change", icon: FaOilCan }, // Oil can for oil change
	{ type: "Tire Change", icon: MdOutlineTireRepair }, // Tire with tool for tire change
	{ type: "Battery Replacement", icon: BiSolidCarBattery }, // Car battery icon
	{ type: "Brake Repair", icon: MdOutlineBuild }, // Build/repair icon for brakes
	{ type: "Brake Pad Replacement", icon: MdOutlineBuild }, // Same as brake repair
	{ type: "Brake Discs and Pads", icon: MdOutlineBuild }, // Same as brake repair
	{ type: "Spark Plugs", icon: FaPlug }, // Plug icon for spark plugs
	{ type: "Clutch Repair", icon: RiToolsLine }, // Tools for clutch repair
	{ type: "Wheels", icon: MdOutlineTireRepair }, // Tire with tool for wheels
	{ type: "Steering Repair", icon: RiSteering2Line }, // Steering wheel icon
	{ type: "Wash", icon: BiSolidCarWash }, // Car wash icon with bubbles
	{ type: "Suspension Repair", icon: RiDashboard2Line }, // Suspension/spring icon
	{ type: "Tire Repair", icon: MdOutlineTireRepair }, // Tire with tool for tire repair
	{ type: "Transmission Repair", icon: RiToolsLine }, // Tools for transmission repair
	{ type: "Diagnostic Service", icon: MdOutlineBuild }, // Build/repair for diagnostics
	{ type: "Other", icon: FaWrench }, // Default wrench for unspecified services
];
export default function ServiceCard({ service, cars, onEdit, onDelete }) {
	const [isOpen, setIsOpen] = useState(false);
	const car = cars.find((c) => c._id === service.carId);
	const carName = car ? `${car.make} ${car.model}` : "Unknown Car";
	const formattedDate = new Date(service.serviceDate).toLocaleDateString();
	const totalCost = service.totalCost
		? service.totalCost.toFixed(2)
		: (
				parseFloat(service.partsCost || 0) +
				parseFloat(service.laborCost || 0)
		  ).toFixed(2);
	const ServiceIcon =
		SERVICE_TYPES_WITH_ICONS.find((s) => s.type === service.serviceName)
			?.icon || FaWrench;

	return (
		<motion.div
			className="bg-white border border-slate-200 rounded-xl shadow-sm p-4 mb-4 flex items-start gap-4 hover:shadow transition-all cursor-pointer"
			onClick={() => setIsOpen(!isOpen)}
			whileHover={{ scale: 1.01 }}
			transition={{ duration: 0.2 }}
		>
			<div className="flex-shrink-0 text-blue-500 text-3xl mt-2">
				<ServiceIcon />
			</div>

			<div className="flex-1">
				<div className="flex justify-between items-center">
					<h3 className="text-sm md:text-lg font-semibold text-slate-800">
						<span className="text-sm hidden sm:inline">
							{carName} -
						</span>{" "}
						{service.serviceName}
					</h3>
					<span className="text-sm text-slate-500">
						<FaCalendarAlt className="inline mr-1" />
						{formattedDate}
					</span>
				</div>

				<div className="text-sm text-slate-600 mt-1">
					${totalCost} |{" "}
					<span className="text-indigo-700">
						{service.mileage} km
					</span>
				</div>

				<AnimatePresence>
					{isOpen && (
						<motion.div
							initial={{ height: 0, opacity: 0 }}
							animate={{ height: "auto", opacity: 1 }}
							exit={{ height: 0, opacity: 0 }}
							transition={{ duration: 0.3, ease: "easeInOut" }}
							className="mt-4 space-y-2 text-sm text-slate-700 border-t pt-3 overflow-hidden"
						>
							<div className="flex items-center gap-2">
								<FaCogs className="text-slate-400" />
								Parts Cost:{" "}
								<strong>
									${parseFloat(service.partsCost).toFixed(2)}
								</strong>
							</div>
							<div className="flex items-center gap-2">
								<FaUserCog className="text-slate-400" />
								Labor Cost:{" "}
								<strong>
									${parseFloat(service.laborCost).toFixed(2)}
								</strong>
							</div>
							<div className="flex items-center gap-2">
								<FaDollarSign className="text-slate-400" />
								Total Cost: <strong>${totalCost}</strong>
							</div>
							<div className="flex items-center gap-2">
								<FaRoad className="text-slate-400" />
								Mileage: <strong>{service.mileage} km</strong>
							</div>
							<div className="flex items-center gap-2">
								<FaBuilding className="text-slate-400" />
								Service Center:{" "}
								<strong>
									{service.serviceCenterName || "N/A"}
								</strong>
							</div>
							<div className="flex items-start gap-2">
								<FaComment className="text-slate-400 mt-1" />
								<i>{service.comment || "No comment"}</i>
							</div>

							<div className="flex gap-3 pt-3">
								<button
									onClick={(e) => {
										e.stopPropagation();
										onEdit();
									}}
									className="px-3 py-1 rounded-lg bg-blue-100 text-blue-700 hover:bg-blue-200 transition"
								>
									<FaEdit className="inline mr-1" /> Edit
								</button>
								<button
									onClick={(e) => {
										e.stopPropagation();
										onDelete();
									}}
									className="px-3 py-1 rounded-lg bg-red-100 text-red-700 hover:bg-red-200 transition"
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
