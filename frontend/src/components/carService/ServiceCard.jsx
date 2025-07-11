import { FaEdit, FaTrash } from "react-icons/fa";

export default function ServiceCard({ service, cars, onEdit, onDelete }) {
	const car = cars.find((c) => c._id === service.carId);
	const carName = car ? `${car.make} ${car.model}` : "Unknown Car";

	return (
		<div className="bg-gradient-to-br from-slate-600 to-slate-700 rounded-2xl shadow-lg p-6 text-white transform hover:scale-105 transition-all duration-300 group">
			<div className="flex items-center justify-between">
				<div>
					<h2 className="text-xl font-bold text-slate-100">
						{carName} - {service.serviceName}
					</h2>
					<p className="text-slate-300">
						Date:{" "}
						{new Date(service.serviceDate).toLocaleDateString()}
					</p>
					<p className="text-slate-300">
						Parts Cost: ${service.partsCost.toFixed(2)}
					</p>
					<p className="text-slate-300">
						Labor Cost: ${service.laborCost.toFixed(2)}
					</p>
					<p className="text-slate-300">
						Total Cost: ${service.totalCost?.toFixed(2) || "N/A"}
					</p>
					<p className="text-slate-300">
						Mileage: {service.mileage} km
					</p>
					{service.serviceCenterName && (
						<p className="text-slate-300">
							Service Center: {service.serviceCenterName}
						</p>
					)}
					{service.comment && (
						<p className="text-slate-300">
							Comment: {service.comment}
						</p>
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
