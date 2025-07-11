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
		<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
			<div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl relative">
				<button
					onClick={onClose}
					className="absolute top-3 right-3 text-slate-500 hover:text-slate-700"
				>
					<FaTimes />
				</button>
				<h2 className="text-xl font-semibold text-slate-800 mb-4">
					{fuel ? "Edit Fuel Log" : "Add Fuel Log"}
				</h2>
				<form onSubmit={handleSubmit} className="space-y-4">
					{/* Car Select */}
					<div>
						<label className="block text-sm font-medium text-slate-700">
							Car
						</label>
						<select
							name="carId"
							value={formData.carId}
							onChange={handleChange}
							className="mt-1 block w-full rounded-lg border border-slate-300 bg-white p-2"
						>
							<option value="">Select a car</option>
							{cars.map((car) => (
								<option key={car._id} value={car._id}>
									{car.make} {car.model}
								</option>
							))}
						</select>
						{errors.carId && (
							<p className="text-red-500 text-sm mt-1">
								{errors.carId}
							</p>
						)}
					</div>

					{/* Fuel Type */}
					<div>
						<label className="block text-sm font-medium text-slate-700">
							Fuel Type
						</label>
						<select
							name="fuelType"
							value={formData.fuelType}
							onChange={handleChange}
							className="mt-1 block w-full rounded-lg border border-slate-300 bg-white p-2"
						>
							<option value="">Select fuel type</option>
							<option value="Petrol">Petrol</option>
							<option value="Diesel">Diesel</option>
							<option value="Electric">Electric</option>
							<option value="Hybrid">Hybrid</option>
						</select>
						{errors.fuelType && (
							<p className="text-red-500 text-sm mt-1">
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
						},
						{
							label: "Fuel Volume (L)",
							name: "fuelVolume",
							step: "0.01",
						},
						{ label: "Mileage (km)", name: "mileage", step: "1" },
						{ label: "Fuel Date", name: "fuelDate", type: "date" },
					].map(({ label, name, type = "number", step }) => (
						<div key={name}>
							<label className="block text-sm font-medium text-slate-700">
								{label}
							</label>
							<input
								type={type}
								step={step}
								name={name}
								value={formData[name]}
								onChange={handleChange}
								className="mt-1 block w-full rounded-lg border border-slate-300 p-2"
							/>
							{errors[name] && (
								<p className="text-red-500 text-sm mt-1">
									{errors[name]}
								</p>
							)}
						</div>
					))}

					{/* Full Tank */}
					<label className="inline-flex items-center gap-2 text-slate-700">
						<input
							type="checkbox"
							name="isFullTank"
							checked={formData.isFullTank}
							onChange={handleChange}
							className="accent-blue-600"
						/>
						Full Tank
					</label>

					{/* Comment */}
					<div>
						<label className="block text-sm font-medium text-slate-700">
							Comment
						</label>
						<textarea
							name="comment"
							value={formData.comment}
							onChange={handleChange}
							rows="3"
							className="mt-1 w-full rounded-lg border border-slate-300 p-2"
						/>
						{errors.comment && (
							<p className="text-red-500 text-sm mt-1">
								{errors.comment}
							</p>
						)}
					</div>

					{/* Actions */}
					<div className="flex justify-end gap-2 pt-2">
						<button
							type="button"
							onClick={onClose}
							className="px-4 py-2 rounded-lg bg-slate-200 text-slate-700 hover:bg-slate-300 transition"
						>
							Cancel
						</button>
						<button
							type="submit"
							className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
						>
							{fuel ? "Update" : "Add"}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}
