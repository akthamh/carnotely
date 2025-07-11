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

export default function CarCard({ car, onEdit, onDelete }) {
	return (
		<div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 hover:shadow-md transition">
			<div className="flex justify-between items-start">
				<div>
					<h3 className="text-lg font-semibold text-slate-800">
						{car.make} {car.model}
					</h3>
					<p className="text-sm text-slate-500 flex items-center gap-1 mt-1">
						<FaCalendarAlt className="text-slate-400" /> Year:{" "}
						{car.year}
					</p>
				</div>
				<div className="flex gap-3">
					<button
						onClick={onEdit}
						className="p-2 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200 hover:text-blue-800 transition-all duration-200"
						aria-label={`Edit car ${car.make} ${car.model}`}
					>
						<FaEdit className="w-4 h-4" />
					</button>
					<button
						onClick={onDelete}
						className="p-2 rounded-full bg-red-100 text-red-600 hover:bg-red-200 hover:text-red-800 transition-all duration-200"
						aria-label={`Delete car ${car.make} ${car.model}`}
					>
						<FaTrash className="w-4 h-4" />
					</button>
				</div>
			</div>
			<div className="mt-4 grid grid-cols-2 gap-y-2 gap-x-4 text-sm text-slate-700">
				<div className="flex items-center gap-2">
					<FaIdCard className="text-slate-400" />
					<span className="hidden md:inline">Registration:</span>{" "}
					{car.registrationNumber}
				</div>
				{car.vin && (
					<div className="flex items-center gap-2">
						<FaBarcode className="text-slate-400" />
						<span className="hidden md:inline">VIN:</span> {car.vin}
					</div>
				)}
				{car.color && (
					<div className="flex items-center gap-2">
						<FaPalette className="text-slate-400" />
						<span className="hidden md:inline">Color:</span>{" "}
						{car.color}
					</div>
				)}
				{car.fuelType && (
					<div className="flex items-center gap-2">
						<FaGasPump className="text-slate-400" />
						<span className="hidden md:inline">Fuel:</span>{" "}
						{car.fuelType}
					</div>
				)}
			</div>
		</div>
	);
}
