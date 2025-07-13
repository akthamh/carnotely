import { useState } from "react";
import {
	FaGasPump,
	FaCalendarAlt,
	FaRoad,
	FaTrash,
	FaEdit,
	FaFillDrip,
	FaComment,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

export default function FuelCard({ fuel, cars, onEdit, onDelete }) {
	const [isOpen, setIsOpen] = useState(false);
	const car = cars.find((c) => c._id === fuel.carId);
	const carName = car ? `${car.make} ${car.model}` : "Unknown Car";
	const formattedDate = new Date(fuel.fuelDate).toLocaleDateString();
	const totalCost = fuel.fuelTotalCost?.toFixed(2) || "N/A";

	return (
		<motion.div
			className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm p-4 mb-4 flex items-start gap-4 hover:shadow transition-all cursor-pointer"
			onClick={() => setIsOpen(!isOpen)}
			whileHover={{ scale: 1.01 }}
			transition={{ duration: 0.2 }}
		>
			<div className="flex-shrink-0 text-blue-500 dark:text-blue-400 text-3xl mt-2">
				<FaGasPump />
			</div>

			<div className="flex-1">
				<div className="flex justify-between items-center">
					<h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
						{carName}
					</h3>
					<span className="text-sm text-slate-500 dark:text-slate-400">
						<FaCalendarAlt className="inline mr-1" />
						{formattedDate}
					</span>
				</div>

				<div className="text-sm text-slate-600 dark:text-slate-300 mt-1">
					${totalCost} | {fuel.fuelVolume}L @ $
					{fuel.pricePerLiter.toFixed(2)}/L
				</div>

				<AnimatePresence>
					{isOpen && (
						<motion.div
							initial={{ height: 0, opacity: 0 }}
							animate={{ height: "auto", opacity: 1 }}
							exit={{ height: 0, opacity: 0 }}
							transition={{ duration: 0.3, ease: "easeInOut" }}
							className="mt-4 space-y-2 text-sm text-slate-700 dark:text-slate-300 border-t border-slate-200 dark:border-slate-700 pt-3 overflow-hidden"
						>
							<div className="flex items-center gap-2">
								<FaRoad className="text-slate-400 dark:text-slate-500" />
								Mileage:{" "}
								<strong className="text-indigo-700 dark:text-indigo-400">
									{fuel.mileage} km
								</strong>
							</div>
							<div className="flex items-center gap-2">
								<FaFillDrip className="text-slate-400 dark:text-slate-500" />
								Fuel Type: {fuel.fuelType}
							</div>
							<div className="flex items-center gap-2">
								Full Tank:{" "}
								<span
									className={`text-xs font-medium px-2 py-0.5 rounded-full ${
										fuel.isFullTank
											? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-400"
											: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-400"
									}`}
								>
									{fuel.isFullTank ? "Yes" : "Partial"}
								</span>
							</div>
							<div className="flex items-start gap-2">
								<FaComment className="text-slate-400 dark:text-slate-500 mt-1" />
								<i>{fuel.comment || "No comment"}</i>
							</div>

							<div className="flex gap-3 pt-3">
								<button
									onClick={(e) => {
										e.stopPropagation();
										onEdit();
									}}
									className="px-3 py-1 rounded-lg bg-blue-100 text-blue-700 hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-400 dark:hover:bg-blue-800 transition"
								>
									<FaEdit className="inline mr-1" /> Edit
								</button>
								<button
									onClick={(e) => {
										e.stopPropagation();
										onDelete();
									}}
									className="px-3 py-1 rounded-lg bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900 dark:text-red-400 dark:hover:bg-red-800 transition"
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
