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
			className="bg-white border border-slate-200 rounded-xl shadow-sm p-4 mb-4 flex items-start gap-4 hover:shadow transition-all cursor-pointer"
			whileHover={{ scale: 1.01 }}
			transition={{ duration: 0.2 }}
		>
			<div className="flex-shrink-0 text-blue-500 text-3xl mt-2">
				<FaCar />
			</div>
			<div className="flex-1">
				<div className="flex justify-between items-center">
					<h3 className="text-sm md:text-lg font-semibold text-slate-800">
						{car.make} {car.model}
					</h3>
					<div className="flex gap-3">
						<button
							onClick={(e) => {
								e.stopPropagation();
								onEdit();
							}}
							className="px-3 py-1 rounded-lg bg-blue-100 text-blue-700 hover:bg-blue-200 transition"
							aria-label={`Edit car ${car.make} ${car.model}`}
						>
							<FaEdit className="inline mr-1" /> Edit
						</button>
						<button
							onClick={(e) => {
								e.stopPropagation();
								onDelete();
							}}
							className="px-3 py-1 rounded-lg bg-red-100 text-red-700 hover:bg-red-200 transition"
							aria-label={`Delete car ${car.make} ${car.model}`}
						>
							<FaTrash className="inline mr-1" /> Delete
						</button>
					</div>
				</div>
				<div className="mt-2 space-y-2 text-sm text-slate-700">
					<div className="flex items-center gap-2">
						<FaCalendarAlt className="text-slate-400" />
						Year: <strong>{car.year}</strong>
					</div>
					<div className="flex items-center gap-2">
						<FaIdCard className="text-slate-400" />
						Registration: <strong>{car.registrationNumber}</strong>
					</div>
					{car.vin && (
						<div className="flex items-center gap-2">
							<FaBarcode className="text-slate-400" />
							VIN: <strong>{car.vin}</strong>
						</div>
					)}
					{car.color && (
						<div className="flex items-center gap-2">
							<FaPalette className="text-slate-400" />
							Color: <strong>{car.color}</strong>
						</div>
					)}
					{car.fuelType && (
						<div className="flex items-center gap-2">
							<FaGasPump className="text-slate-400" />
							Fuel: <strong>{car.fuelType}</strong>
						</div>
					)}
				</div>
			</div>
		</motion.div>
	);
}
