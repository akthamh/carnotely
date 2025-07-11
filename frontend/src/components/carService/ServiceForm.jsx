import { useState } from "react";
import { FaTimes } from "react-icons/fa";

const SERVICE_TYPES = [
	"Periodic Maintenance",
	"Engine Air Filter",
	"Oil Filter",
	"Brake Fluid",
	"Oil Change",
	"Tire Change",
	"Battery Replacement",
	"Brake Repair",
	"Brake Pad Replacement",
	"Brake Discs and Pads",
	"Spark Plugs",
	"Clutch Repair",
	"Wheels",
	"Steering Repair",
	"Wash",
	"Suspension Repair",
	"Tire Repair",
	"Transmission Repair",
	"Diagnostic Service",
	"Other",
];

export default function ServiceForm({ service, cars, onSubmit, onClose }) {
	const [formData, setFormData] = useState({
		carId: service?.carId || "",
		serviceName: service?.serviceName || "",
		partsCost: service?.partsCost || "",
		laborCost: service?.laborCost || "",
		mileage: service?.mileage || "",
		serviceDate: service?.serviceDate
			? new Date(service.serviceDate).toISOString().split("T")[0]
			: "",
		serviceCenterName: service?.serviceCenterName || "",
		comment: service?.comment || "",
	});
	const [errors, setErrors] = useState({});

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData({
			...formData,
			[name]: value,
		});
		if (errors[name]) {
			setErrors({ ...errors, [name]: null });
		}
	};

	const validateForm = () => {
		const schema = {
			carId: (val) => (!val ? "Car is required" : null),
			serviceName: (val) => (!val ? "Service name is required" : null),
			partsCost: (val) => {
				if (!val) return "Parts cost is required";
				if (parseFloat(val) < 0)
					return "Parts cost must be non-negative";
				return null;
			},
			laborCost: (val) => {
				if (!val) return "Labor cost is required";
				if (parseFloat(val) < 0)
					return "Labor cost must be non-negative";
				return null;
			},
			mileage: (val) => {
				if (!val) return "Mileage is required";
				if (parseFloat(val) < 0) return "Mileage must be non-negative";
				return null;
			},
			serviceDate: (val) => (!val ? "Service date is required" : null),
			serviceCenterName: (val) =>
				val && val.length > 300
					? "Service center name must be 300 characters or less"
					: null,
			comment: (val) =>
				val && val.length > 1000
					? "Comment must be 1000 characters or less"
					: null,
		};
		const newErrors = {};
		Object.keys(schema).forEach((key) => {
			const error = schema[key](formData[key]);
			if (error) newErrors[key] = error;
		});
		return newErrors;
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		const newErrors = validateForm();
		if (Object.keys(newErrors).length > 0) {
			setErrors(newErrors);
			return;
		}
		onSubmit(formData);
	};

	return (
		<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fade-in">
			<div className="bg-slate-800 rounded-2xl p-6 w-full max-w-md transform transition-all duration-300 scale-100">
				<div className="flex justify-between items-center mb-4">
					<h2 className="text-2xl font-bold text-slate-100">
						{service ? "Edit Service Log" : "Add Service Log"}
					</h2>
					<button
						onClick={onClose}
						className="p-2 rounded-full bg-slate-700 hover:bg-slate-600 transition-all duration-200"
					>
						<FaTimes className="w-5 h-5 text-slate-300" />
					</button>
				</div>
				<form onSubmit={handleSubmit}>
					<div className="mb-4">
						<label className="block text-slate-300 mb-1">Car</label>
						<select
							name="carId"
							value={formData.carId}
							onChange={handleChange}
							className="w-full p-2 rounded-lg bg-slate-900 text-white border border-slate-600 focus:outline-none focus:border-slate-400 transition-all duration-200"
						>
							<option value="">Select Car</option>
							{cars.map((car) => (
								<option key={car._id} value={car._id}>
									{car.make} {car.model}
								</option>
							))}
						</select>
						{errors.carId && (
							<p className="text-red-400 text-sm mt-1">
								{errors.carId}
							</p>
						)}
					</div>
					<div className="mb-4">
						<label className="block text-slate-300 mb-1">
							Service Name
						</label>
						<select
							name="serviceName"
							value={formData.serviceName}
							onChange={handleChange}
							className="w-full p-2 rounded-lg bg-slate-900 text-white border border-slate-600 focus:outline-none focus:border-slate-400 transition-all duration-200"
						>
							<option value="">Select Service Type</option>
							{SERVICE_TYPES.map((type) => (
								<option key={type} value={type}>
									{type}
								</option>
							))}
						</select>
						{errors.serviceName && (
							<p className="text-red-400 text-sm mt-1">
								{errors.serviceName}
							</p>
						)}
					</div>
					<div className="mb-4">
						<label className="block text-slate-300 mb-1">
							Parts Cost
						</label>
						<input
							type="number"
							name="partsCost"
							value={formData.partsCost}
							onChange={handleChange}
							step="0.01"
							className="w-full p-2 rounded-lg bg-slate-900 text-white border border-slate-600 focus:outline-none focus:border-slate-400 transition-all duration-200"
						/>
						{errors.partsCost && (
							<p className="text-red-400 text-sm mt-1">
								{errors.partsCost}
							</p>
						)}
					</div>
					<div className="mb-4">
						<label className="block text-slate-300 mb-1">
							Labor Cost
						</label>
						<input
							type="number"
							name="laborCost"
							value={formData.laborCost}
							onChange={handleChange}
							step="0.01"
							className="w-full p-2 rounded-lg bg-slate-900 text-white border border-slate-600 focus:outline-none focus:border-slate-400 transition-all duration-200"
						/>
						{errors.laborCost && (
							<p className="text-red-400 text-sm mt-1">
								{errors.laborCost}
							</p>
						)}
					</div>
					<div className="mb-4">
						<label className="block text-slate-300 mb-1">
							Mileage (km)
						</label>
						<input
							type="number"
							name="mileage"
							value={formData.mileage}
							onChange={handleChange}
							step="1"
							className="w-full p-2 rounded-lg bg-slate-900 text-white border border-slate-600 focus:outline-none focus:border-slate-400 transition-all duration-200"
						/>
						{errors.mileage && (
							<p className="text-red-400 text-sm mt-1">
								{errors.mileage}
							</p>
						)}
					</div>
					<div className="mb-4">
						<label className="block text-slate-300 mb-1">
							Service Date
						</label>
						<input
							type="date"
							name="serviceDate"
							value={formData.serviceDate}
							onChange={handleChange}
							className="w-full p-2 rounded-lg bg-slate-900 text-white border border-slate-600 focus:outline-none focus:border-slate-400 transition-all duration-200"
						/>
						{errors.serviceDate && (
							<p className="text-red-400 text-sm mt-1">
								{errors.serviceDate}
							</p>
						)}
					</div>
					<div className="mb-4">
						<label className="block text-slate-300 mb-1">
							Service Center (Optional)
						</label>
						<input
							type="text"
							name="serviceCenterName"
							value={formData.serviceCenterName}
							onChange={handleChange}
							className="w-full p-2 rounded-lg bg-slate-900 text-white border border-slate-600 focus:outline-none focus:border-slate-400 transition-all duration-200"
						/>
						{errors.serviceCenterName && (
							<p className="text-red-400 text-sm mt-1">
								{errors.serviceCenterName}
							</p>
						)}
					</div>
					<div className="mb-4">
						<label className="block text-slate-300 mb-1">
							Comment (Optional)
						</label>
						<textarea
							name="comment"
							value={formData.comment}
							onChange={handleChange}
							className="w-full p-2 rounded-lg bg-slate-900 text-white border border-slate-600 focus:outline-none focus:border-slate-400 transition-all duration-200"
							rows="4"
						/>
						{errors.comment && (
							<p className="text-red-400 text-sm mt-1">
								{errors.comment}
							</p>
						)}
					</div>
					<div className="flex justify-end gap-2">
						<button
							type="button"
							onClick={onClose}
							className="px-4 py-2 rounded-lg bg-slate-700 text-slate-200 hover:bg-slate-600 transition-all duration-200 transform hover:scale-105"
						>
							Cancel
						</button>
						<button
							type="submit"
							className="px-4 py-2 rounded-lg bg-gradient-to-r from-slate-600 to-slate-700 text-white hover:bg-gradient-to-r hover:from-slate-500 hover:to-slate-600 transition-all duration-300 transform hover:scale-105"
						>
							{service ? "Update" : "Add"} Service Log
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}
