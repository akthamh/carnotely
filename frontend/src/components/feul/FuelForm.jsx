import { useState } from "react";
import { FaTimes } from "react-icons/fa";

export default function FuelForm({ fuel, cars, onSubmit, onClose }) {
	const [formData, setFormData] = useState({
		carId: fuel?.carId || "",
		fuelType: fuel?.fuelType || "",
		pricePerLiter: fuel?.pricePerLiter || "",
		fuelVolume: fuel?.fuelVolume || "",
		mileage: fuel?.mileage || "",
		fuelDate: fuel?.fuelDate
			? new Date(fuel.fuelDate).toISOString().split("T")[0]
			: "",
		isFullTank: fuel?.isFullTank || false,
		comment: fuel?.comment || "",
	});
	const [errors, setErrors] = useState({});

	const handleChange = (e) => {
		const { name, value, type, checked } = e.target;
		setFormData({
			...formData,
			[name]: type === "checkbox" ? checked : value,
		});
		if (errors[name]) {
			setErrors({ ...errors, [name]: null });
		}
	};

	const validateForm = () => {
		const schema = {
			carId: (val) => (!val ? "Car is required" : null),
			fuelType: (val) => (!val ? "Fuel type is required" : null),
			pricePerLiter: (val) => {
				if (!val) return "Price per liter is required";
				if (parseFloat(val) < 0)
					return "Price per liter must be non-negative";
				return null;
			},
			fuelVolume: (val) => {
				if (!val) return "Fuel volume is required";
				if (parseFloat(val) < 0)
					return "Fuel volume must be non-negative";
				return null;
			},
			mileage: (val) => {
				if (!val) return "Mileage is required";
				if (parseFloat(val) < 0) return "Mileage must be non-negative";
				return null;
			},
			fuelDate: (val) => (!val ? "Fuel date is required" : null),
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
						{fuel ? "Edit Fuel Log" : "Add Fuel Log"}
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
							Fuel Type
						</label>
						<select
							name="fuelType"
							value={formData.fuelType}
							onChange={handleChange}
							className="w-full p-2 rounded-lg bg-slate-900 text-white border border-slate-600 focus:outline-none focus:border-slate-400 transition-all duration-200"
						>
							<option value="">Select fuel type</option>
							<option value="Petrol">Petrol</option>
							<option value="Diesel">Diesel</option>
							<option value="Electric">Electric</option>
							<option value="Hybrid">Hybrid</option>
						</select>

						{errors.fuelType && (
							<p className="text-red-400 text-sm mt-1">
								{errors.fuelType}
							</p>
						)}
					</div>
					<div className="mb-4">
						<label className="block text-slate-300 mb-1">
							Price per Liter
						</label>
						<input
							type="number"
							name="pricePerLiter"
							value={formData.pricePerLiter}
							onChange={handleChange}
							step="0.01"
							className="w-full p-2 rounded-lg bg-slate-900 text-white border border-slate-600 focus:outline-none focus:border-slate-400 transition-all duration-200"
						/>
						{errors.pricePerLiter && (
							<p className="text-red-400 text-sm mt-1">
								{errors.pricePerLiter}
							</p>
						)}
					</div>
					<div className="mb-4">
						<label className="block text-slate-300 mb-1">
							Fuel Volume (liters)
						</label>
						<input
							type="number"
							name="fuelVolume"
							value={formData.fuelVolume}
							onChange={handleChange}
							step="0.01"
							className="w-full p-2 rounded-lg bg-slate-900 text-white border border-slate-600 focus:outline-none focus:border-slate-400 transition-all duration-200"
						/>
						{errors.fuelVolume && (
							<p className="text-red-400 text-sm mt-1">
								{errors.fuelVolume}
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
							Fuel Date
						</label>
						<input
							type="date"
							name="fuelDate"
							value={formData.fuelDate}
							onChange={handleChange}
							className="w-full p-2 rounded-lg bg-slate-900 text-white border border-slate-600 focus:outline-none focus:border-slate-400 transition-all duration-200"
						/>
						{errors.fuelDate && (
							<p className="text-red-400 text-sm mt-1">
								{errors.fuelDate}
							</p>
						)}
					</div>
					<div className="mb-4">
						<label className="flex items-center text-slate-300">
							<input
								type="checkbox"
								name="isFullTank"
								checked={formData.isFullTank}
								onChange={handleChange}
								className="mr-2"
							/>
							Full Tank
						</label>
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
							{fuel ? "Update" : "Add"} Fuel Log
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}
