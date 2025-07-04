import { FaEdit, FaTrash } from "react-icons/fa";

export default function CarCard({ car, onEdit, onDelete }) {
	return (
		<div className="bg-gradient-to-br from-slate-600 to-slate-700 rounded-2xl shadow-lg p-6 text-white transform hover:scale-105 transition-all duration-300 group">
			<div className="flex items-center justify-between">
				<div>
					<h2 className="text-xl font-bold text-slate-100">
						{car.make} {car.model}
					</h2>
					<p className="text-slate-300">Year: {car.year}</p>
					<p className="text-slate-300">
						Registration: {car.registrationNumber}
					</p>
					{car.vin && (
						<p className="text-slate-300">VIN: {car.vin}</p>
					)}
					{car.color && (
						<p className="text-slate-300">Color: {car.color}</p>
					)}
					{car.fuelType && (
						<p className="text-slate-300">Fuel: {car.fuelType}</p>
					)}
				</div>
				<div className="flex gap-2">
					<button
						onClick={onEdit}
						className="p-2 rounded-full bg-slate-800 hover:bg-slate-700 transition-all duration-200 transform hover:scale-110"
					>
						<FaEdit className="w-5 h-5 text-slate-300" />
					</button>
					<button
						onClick={onDelete}
						className="p-2 rounded-full bg-slate-800 hover:bg-slate-700 transition-all duration-200 transform hover:scale-110"
					>
						<FaTrash className="w-5 h-5 text-slate-300" />
					</button>
				</div>
			</div>
		</div>
	);
}
