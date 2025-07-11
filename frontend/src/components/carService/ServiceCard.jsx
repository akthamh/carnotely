import {
	FaCar,
	FaEdit,
	FaTrash,
	FaWrench,
	FaCalendarAlt,
	FaCogs,
	FaUserCog,
	FaDollarSign,
	FaRoad,
	FaBuilding,
	FaComment,
} from "react-icons/fa";

export default function ServiceCard({ service, cars, onEdit, onDelete }) {
	const car = cars.find((c) => c._id === service.carId);
	const carName = car ? `${car.make} ${car.model}` : "Unknown Car";
	const formattedDate = new Date(service.serviceDate).toLocaleDateString();
	const totalCost = service.totalCost
		? service.totalCost.toFixed(2)
		: (
				parseFloat(service.partsCost || 0) +
				parseFloat(service.laborCost || 0)
		  ).toFixed(2);

	return (
		<div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 hover:shadow-md transition">
			<div className="flex justify-between items-start">
				<div>
					<h3 className="text-lg font-semibold text-slate-800">
						{carName} - {service.serviceName}
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
						aria-label={`Edit service log for ${carName}`}
					>
						<FaEdit className="w-4 h-4" />
					</button>
					<button
						onClick={onDelete}
						className="p-2 rounded-full bg-red-100 text-red-600 hover:bg-red-200 hover:text-red-800 transition-all duration-200"
						aria-label={`Delete service log for ${carName}`}
					>
						<FaTrash className="w-4 h-4" />
					</button>
				</div>
			</div>
			<div className="mt-4 grid grid-cols-2 gap-y-2 gap-x-4 text-sm text-slate-700">
				<div className="flex items-center gap-2">
					<FaWrench className="text-slate-400" />
					<span className="hidden md:inline">Service:</span>{" "}
					{service.serviceName}
				</div>
				<div className="flex items-center gap-2">
					<FaCogs className="text-slate-400" />
					<span className="hidden md:inline">Parts Cost:</span> $
					{parseFloat(service.partsCost).toFixed(2)}
				</div>
				<div className="flex items-center gap-2">
					<FaUserCog className="text-slate-400" />
					<span className="hidden md:inline">Labor Cost:</span> $
					{parseFloat(service.laborCost).toFixed(2)}
				</div>
				<div className="flex items-center gap-2">
					<FaDollarSign className="text-slate-400" />
					<span className="hidden md:inline">Total Cost:</span> $
					{totalCost}
				</div>
				<div className="flex items-center gap-2">
					<FaRoad className="text-slate-400" />
					<span className="hidden md:inline">Mileage:</span>{" "}
					{service.mileage} km
				</div>
				{service.serviceCenterName && (
					<div className="flex items-center gap-2">
						<FaBuilding className="text-slate-400" />
						<span className="hidden md:inline">
							Service Center:
						</span>{" "}
						{service.serviceCenterName}
					</div>
				)}
			</div>
			{service.comment && (
				<div className="mt-3 text-slate-500 italic text-sm border-t pt-2 flex items-start gap-2">
					<FaComment className="text-slate-400 mt-1" />"
					{service.comment}"
				</div>
			)}
		</div>
	);
}
