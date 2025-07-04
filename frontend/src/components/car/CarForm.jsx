import { useState } from "react";
import { FaTimes } from "react-icons/fa";

export default function CarForm({ car, onSubmit, onClose }) {
	const [formData, setFormData] = useState({
		make: car?.make || "",
		model: car?.model || "",
		year: car?.year || "",
		registrationNumber: car?.registrationNumber || "",
		vin: car?.vin || "",
		color: car?.color || "",
		fuelType: car?.fuelType || "",
	});
	const [errors, setErrors] = useState({});

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData({ ...formData, [name]: value });
		if (errors[name]) {
			setErrors({ ...errors, [name]: null });
		}
	};

	const validateForm = () => {
		const schema = {
			make: (val) => (!val ? "Make is required" : null),
			model: (val) => (!val ? "Model is required" : null),
			year: (val) => {
				if (!val) return "Year is required";
				const yearNum = parseInt(val);
				const currentYear = new Date().getFullYear();
				if (yearNum < 1886 || yearNum > currentYear)
					return "Year must be between 1886 and " + currentYear;
				return null;
			},
			registrationNumber: (val) =>
				!val ? "Registration number is required" : null,
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
		<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fade-in">
			<div className="bg-slate-800 rounded-2xl p-6 w-full max-w-md transform transition-all duration-300 scale-100">
				<div className="flex justify-between items-center mb-4">
					<h2 className="text-2xl font-bold text-slate-100">
						{car ? "Edit Car" : "Add Car"}
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
						<label className="block text-slate-300 mb-1">
							Make
						</label>
						<input
							type="text"
							name="make"
							value={formData.make}
							onChange={handleChange}
							className="w-full p-2 rounded-lg bg-slate-900 text-white border border-slate-600 focus:outline-none focus:border-slate-400 transition-all duration-200"
						/>
						{errors.make && (
							<p className="text-red-400 text-sm mt-1">
								{errors.make}
							</p>
						)}
					</div>
					<div className="mb-4">
						<label className="block text-slate-300 mb-1">
							Model
						</label>
						<input
							type="text"
							name="model"
							value={formData.model}
							onChange={handleChange}
							className="w-full p-2 rounded-lg bg-slate-900 text-white border border-slate-600 focus:outline-none focus:border-slate-400 transition-all duration-200"
						/>
						{errors.model && (
							<p className="text-red-400 text-sm mt-1">
								{errors.model}
							</p>
						)}
					</div>
					<div className="mb-4">
						<label className="block text-slate-300 mb-1">
							Year
						</label>
						<input
							type="number"
							name="year"
							value={formData.year}
							onChange={handleChange}
							className="w-full p-2 rounded-lg bg-slate-900 text-white border border-slate-600 focus:outline-none focus:border-slate-400 transition-all duration-200"
						/>
						{errors.year && (
							<p className="text-red-400 text-sm mt-1">
								{errors.year}
							</p>
						)}
					</div>
					<div className="mb-4">
						<label className="block text-slate-300 mb-1">
							Registration Number
						</label>
						<input
							type="text"
							name="registrationNumber"
							value={formData.registrationNumber}
							onChange={handleChange}
							className="w-full p-2 rounded-lg bg-slate-900 text-white border border-slate-600 focus:outline-none focus:border-slate-400 transition-all duration-200"
						/>
						{errors.registrationNumber && (
							<p className="text-red-400 text-sm mt-1">
								{errors.registrationNumber}
							</p>
						)}
					</div>
					<div className="mb-4">
						<label className="block text-slate-300 mb-1">
							VIN (Optional)
						</label>
						<input
							type="text"
							name="vin"
							value={formData.vin}
							onChange={handleChange}
							className="w-full p-2 rounded-lg bg-slate-900 text-white border border-slate-600 focus:outline-none focus:border-slate-400 transition-all duration-200"
						/>
					</div>
					<div className="mb-4">
						<label className="block text-slate-300 mb-1">
							Color (Optional)
						</label>
						<input
							type="text"
							name="color"
							value={formData.color}
							onChange={handleChange}
							className="w-full p-2 rounded-lg bg-slate-900 text-white border border-slate-600 focus:outline-none focus:border-slate-400 transition-all duration-200"
						/>
					</div>
					<div className="mb-4">
						<label className="block text-slate-300 mb-1">
							Fuel Type (Optional)
						</label>
						<select
							name="fuelType"
							value={formData.fuelType}
							onChange={handleChange}
							className="w-full p-2 rounded-lg bg-slate-900 text-white border border-slate-600 focus:outline-none focus:border-slate-400 transition-all duration-200"
						>
							<option value="">Select Fuel Type</option>
							{[
								"Diesel",
								"Petrol",
								"Ethanol",
								"LPG",
								"CNG",
								"Hybrid",
							].map((type) => (
								<option key={type} value={type}>
									{type}
								</option>
							))}
						</select>
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
							{car ? "Update" : "Add"} Car
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}
