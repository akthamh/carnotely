import {
	FaCar,
	FaEdit,
	FaTrash,
	FaCalendarAlt,
	FaIdCard,
	FaBarcode,
	FaPalette,
	FaGasPump,
} from "react-icons/fa";
import { motion } from "framer-motion";

export default function CarCard({ car, onEdit, onDelete }) {
	return (
		<motion.div
			className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm p-4 mb-4 flex items-start gap-4 hover:shadow transition-all cursor-pointer"
			whileHover={{ scale: 1.01 }}
			transition={{ duration: 0.2 }}
		>
			<div className="flex-shrink-0 text-blue-500 dark:text-blue-400 text-3xl mt-2">
				<FaCar />
			</div>
			<div className="flex-1 min-w-0">
				<h3 className="text-sm md:text-lg font-semibold text-slate-800 dark:text-white truncate">
					{car.make} {car.model}
				</h3>
				<div className="mt-2 space-y-2 text-sm text-slate-700 dark:text-slate-300">
					<div className="flex items-center gap-2">
						<FaCalendarAlt className="text-slate-400 dark:text-slate-500" />
						Year: <strong>{car.year}</strong>
					</div>
					<div className="flex items-center gap-2">
						<FaIdCard className="text-slate-400 dark:text-slate-500" />
						Plate: <strong>{car.licensePlate}</strong>
					</div>
					<div className="flex items-center gap-2">
						<FaPalette className="text-slate-400 dark:text-slate-500" />
						Color: <strong>{car.color}</strong>
					</div>
				</div>
			</div>
			<div className="flex flex-col gap-2 ml-4 mt-2">
				<button
					onClick={onEdit}
					className="bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200 hover:bg-blue-200 dark:hover:bg-blue-800 px-3 py-1 rounded"
				>
					<FaEdit />
				</button>
				<button
					onClick={onDelete}
					className="bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 hover:bg-red-200 dark:hover:bg-red-800 px-3 py-1 rounded"
				>
					<FaTrash />
				</button>
			</div>
		</motion.div>
	);
}
