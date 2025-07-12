import { useState } from "react";
import { FaTimes } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

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
	console.log("cars", cars);

	const handleChange = (e) => {
		const { name, value, type, checked } = e.target;
		setFormData({
			...formData,
			[name]: type === "checkbox" ? checked : value,
		});
		if (errors[name]) setErrors({ ...errors, [name]: null });
	};

	const validateForm = () => {
		const schema = {
			carId: (val) => (!val ? "Car is required" : null),
			fuelType: (val) => (!val ? "Fuel type is required" : null),
			pricePerLiter: (val) =>
				!val
					? "Required"
					: parseFloat(val) < 0
					? "Must be positive"
					: null,
			fuelVolume: (val) =>
				!val
					? "Required"
					: parseFloat(val) < 0
					? "Must be positive"
					: null,
			mileage: (val) =>
				!val
					? "Required"
					: parseFloat(val) < 0
					? "Must be positive"
					: null,
			fuelDate: (val) => (!val ? "Date is required" : null),
			comment: (val) => (val && val.length > 1000 ? "Too long" : null),
		};
		const newErrors = {};
		Object.entries(schema).forEach(([key, validate]) => {
			const err = validate(formData[key]);
			if (err) newErrors[key] = err;
		});
		return newErrors;
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		const newErrors = validateForm();
		if (Object.keys(newErrors).length) return setErrors(newErrors);
		onSubmit(formData);
	};

	return (
		<AnimatePresence>
			<motion.div
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				exit={{ opacity: 0 }}
				className="fixed inset-0 bg-black/60 flex items-start sm:items-center justify-center z-50 p-4 overflow-y-auto"
			>
				<motion.div
					initial={{ scale: 0.95, opacity: 0 }}
					animate={{ scale: 1, opacity: 1 }}
					exit={{ scale: 0.95, opacity: 0 }}
					transition={{ duration: 0.2 }}
					className="bg-white rounded-2xl p-4 sm:p-6 w-full max-w-md sm:max-w-lg max-h-[90vh] shadow-2xl relative overflow-y-auto"
				>
					<div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 to-blue-400" />
					<button
						onClick={onClose}
						className="absolute top-3 right-3 text-slate-500 hover:text-slate-700 transition-colors"
					>
						<FaTimes className="w-5 h-5" />
					</button>
					<h2 className="text-xl sm:text-2xl font-bold text-slate-800 mb-4 sm:mb-6">
						{fuel ? "Edit Fuel Log" : "Add Fuel Log"}
					</h2>
					<form
						onSubmit={handleSubmit}
						className="space-y-4 sm:space-y-5"
					>
						{/* Car Select */}
						<div>
							<label className="block text-sm font-medium text-slate-700 mb-1">
								Car
							</label>
							<select
								name="carId"
								value={formData.carId}
								onChange={handleChange}
								className="w-full rounded-lg border border-slate-200 bg-white p-2 sm:p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
							>
								<option value="">Select a car</option>
								{cars.map((car) => (
									<option key={car._id} value={car._id}>
										{car.make} {car.model}
									</option>
								))}
							</select>
							{errors.carId && (
								<p className="text-red-500 text-xs mt-1">
									{errors.carId}
								</p>
							)}
						</div>

						{/* Fuel Type */}
						<div>
							<label className="block text-sm font-medium text-slate-700 mb-1">
								Fuel Type
							</label>
							<select
								name="fuelType"
								value={formData.fuelType}
								onChange={handleChange}
								className="w-full rounded-lg border border-slate-200 bg-white p-2 sm:p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
							>
								<option value="">Select fuel type</option>
								<option value="Petrol">Petrol</option>
								<option value="Diesel">Diesel</option>
								<option value="Electric">Electric</option>
								<option value="Hybrid">Hybrid</option>
							</select>
							{errors.fuelType && (
								<p className="text-red-500 text-xs mt-1">
									{errors.fuelType}
								</p>
							)}
						</div>

						{/* Price, Volume, Mileage, Date */}
						{[
							{
								label: "Price per Liter",
								name: "pricePerLiter",
								step: "0.01",
								type: "number",
							},
							{
								label: "Fuel Volume (L)",
								name: "fuelVolume",
								step: "0.01",
								type: "number",
							},
							{
								label: "Mileage (km)",
								name: "mileage",
								step: "1",
								type: "number",
							},
							{
								label: "Fuel Date",
								name: "fuelDate",
								type: "date",
							},
						].map(({ label, name, type, step }) => (
							<div key={name}>
								<label className="block text-sm font-medium text-slate-700 mb-1">
									{label}
								</label>
								<input
									type={type}
									step={step}
									name={name}
									value={formData[name]}
									onChange={handleChange}
									className="w-full rounded-lg border border-slate-200 p-2 sm:p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
								/>
								{errors[name] && (
									<p className="text-red-500 text-xs mt-1">
										{errors[name]}
									</p>
								)}
							</div>
						))}

						{/* Full Tank */}
						<label className="inline-flex items-center gap-2 text-slate-700 cursor-pointer">
							<input
								type="checkbox"
								name="isFullTank"
								checked={formData.isFullTank}
								onChange={handleChange}
								className="w-4 h-4 accent-blue-600 rounded focus:ring-2 focus:ring-blue-500"
							/>
							<span className="text-sm">Full Tank</span>
						</label>

						{/* Comment */}
						<div>
							<label className="block text-sm font-medium text-slate-700 mb-1">
								Comment
							</label>
							<textarea
								name="comment"
								value={formData.comment}
								onChange={handleChange}
								rows="3"
								className="w-full rounded-lg border border-slate-200 p-2 sm:p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors resize-none"
							/>
							{errors.comment && (
								<p className="text-red-500 text-xs mt-1">
									{errors.comment}
								</p>
							)}
						</div>

						{/* Actions */}
						<div className="flex justify-end gap-3 pt-4">
							<button
								type="button"
								onClick={onClose}
								className="px-3 sm:px-4 py-2 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors"
							>
								Cancel
							</button>
							<button
								type="submit"
								className="px-3 sm:px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
							>
								{fuel ? "Update" : "Add"}
							</button>
						</div>
					</form>
				</motion.div>
			</motion.div>
		</AnimatePresence>
	);
}
