import {
	FaGasPump,
	FaCalendarAlt,
	FaRoad,
	FaTrash,
	FaEdit,
	FaFillDrip,
	FaComment,
} from "react-icons/fa";

export default function FuelCard({ fuel, cars, onEdit, onDelete }) {
	const car = cars.find((c) => c._id === fuel.carId);
	const carName = car ? `${car.make} ${car.model}` : "Unknown Car";

	const formattedDate = new Date(fuel.fuelDate).toLocaleDateString();
	const totalCost = fuel.fuelTotalCost?.toFixed(2) || "N/A";

	return (
		<div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 hover:shadow-md transition">
			<div className="flex justify-between items-start">
				<div>
					<h3 className="text-lg font-semibold text-slate-800">
						{carName}
					</h3>
					<p className="text-sm text-slate-500 flex items-center gap-1 mt-1">
						<FaCalendarAlt className="text-slate-400" />{" "}
						{formattedDate}
					</p>
				</div>
				<div className="flex gap-3">
					<button
						onClick={onEdit}
						className="p-2 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200 hover:text-blue-800 transition-all duration-200"
						aria-label={`Edit fuel log for ${carName}`}
					>
						<FaEdit className="w-4 h-4" />
					</button>
					<button
						onClick={onDelete}
						className="p-2 rounded-full bg-red-100 text-red-600 hover:bg-red-200 hover:text-red-800 transition-all duration-200"
						aria-label={`Delete fuel log for ${carName}`}
					>
						<FaTrash className="w-4 h-4" />
					</button>
				</div>
			</div>

			<div className="mt-4 grid grid-cols-2 gap-y-2 gap-x-4 text-sm text-slate-700">
				<div className="flex items-center gap-2">
					<FaGasPump className="text-slate-400" />
					<span className="hidden md:inline">{fuel.fuelType} - </span>
					${fuel.pricePerLiter.toFixed(2)}/L
				</div>
				<div className="flex items-center gap-2">
					<FaFillDrip className="text-slate-400" />
					<span className="hidden md:inline">Volume:</span>{" "}
					<strong>{fuel.fuelVolume} L</strong>
				</div>
				<div className="flex items-center gap-2 col-span-2">
					<FaRoad className="text-slate-400" />
					<span className="hidden md:inline">Mileage:</span>{" "}
					<strong>{fuel.mileage} km</strong>
				</div>
				<div>
					Total Cost: <strong>${totalCost}</strong>
				</div>
				<div>
					Full Tank:{" "}
					<span
						className={`inline-block text-xs px-2 py-0.5 rounded-full font-medium ${
							fuel.isFullTank
								? "bg-green-100 text-green-700"
								: "bg-yellow-100 text-yellow-700"
						}`}
					>
						{fuel.isFullTank ? "Yes" : "Partial"}
					</span>
				</div>
			</div>

			<div className="mt-3 text-slate-500 italic text-sm border-t pt-2 flex items-start gap-2">
				<FaComment className="text-slate-400 mt-1" /> “
				{fuel.comment ? `${fuel.comment}` : "No comment"}”
			</div>
		</div>
	);
}
