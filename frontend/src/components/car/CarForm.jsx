import { useState, useEffect } from "react";
import { FaTimes } from "react-icons/fa";

export default function CarForm({ car, onSubmit, onClose, serverErrors = {} }) {
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

	useEffect(() => {
		setFormData({
			make: car?.make || "",
			model: car?.model || "",
			year: car?.year || "",
			registrationNumber: car?.registrationNumber || "",
			vin: car?.vin || "",
			color: car?.color || "",
			fuelType: car?.fuelType || "",
		});
		setErrors({});
	}, [car]);

	// Add keyboard accessibility (Escape key to close)
	useEffect(() => {
		const handleEscape = (e) => {
			if (e.key === "Escape") onClose();
		};
		document.addEventListener("keydown", handleEscape);
		return () => document.removeEventListener("keydown", handleEscape);
	}, [onClose]);

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData({ ...formData, [name]: value });
		if (errors[name] || serverErrors[name]) {
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
					return `Year must be between 1886 and ${currentYear}`;
				return null;
			},
			registrationNumber: (val) =>
				!val ? "Registration number is required" : null,
			vin: (val) =>
				val && val.length > 17
					? "VIN must be 17 characters or less"
					: null,
			color: (val) =>
				val && val.length > 50
					? "Color must be 50 characters or less"
					: null,
			fuelType: (val) => (!val ? "Fuel type is required" : null),
		};
		const newErrors = {};
		Object.entries(schema).forEach(([key, validate]) => {
			const error = validate(formData[key]);
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
		<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
			<div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl relative">
				<button
					onClick={onClose}
					className="absolute top-3 right-3 text-slate-500 hover:text-slate-700"
					aria-label="Close modal"
				>
					<FaTimes className="w-5 h-5" />
				</button>
				<h2 className="text-xl font-semibold text-slate-800 mb-4">
					{car ? "Edit Car" : "Add Car"}
				</h2>
				{serverErrors.form && (
					<p className="text-red-500 mb-4 text-center font-semibold">
						{serverErrors.form}
					</p>
				)}
				<form onSubmit={handleSubmit} className="space-y-4" noValidate>
					{[
						{ label: "Make", name: "make", type: "text" },
						{ label: "Model", name: "model", type: "text" },
						{ label: "Year", name: "year", type: "number" },
						{
							label: "Registration Number",
							name: "registrationNumber",
							type: "text",
						},
						{ label: "VIN", name: "vin", type: "text" },
						{ label: "Color", name: "color", type: "text" },
					].map(({ label, name, type }) => (
						<div key={name}>
							<label className="block text-sm font-medium text-slate-700">
								{label}
							</label>
							<input
								type={type}
								name={name}
								value={formData[name]}
								onChange={handleChange}
								className="mt-1 block w-full rounded-lg border border-slate-300 p-2 focus:outline-none focus:border-blue-600 transition"
								aria-label={label}
							/>
							{(errors[name] || serverErrors[name]) && (
								<p className="text-red-500 text-sm mt-1">
									{errors[name] || serverErrors[name]}
								</p>
							)}
						</div>
					))}
					<div>
						<label className="block text-sm font-medium text-slate-700">
							Fuel Type
						</label>
						<select
							name="fuelType"
							value={formData.fuelType}
							onChange={handleChange}
							className="mt-1 block w-full rounded-lg border border-slate-300 bg-white p-2 focus:outline-none focus:border-blue-600 transition"
							aria-label="Fuel Type"
						>
							<option value="">Select fuel type</option>
							<option value="Petrol">Petrol</option>
							<option value="Diesel">Diesel</option>
							<option value="Electric">Electric</option>
							<option value="Hybrid">Hybrid</option>
						</select>
						{(errors.fuelType || serverErrors.fuelType) && (
							<p className="text-red-500 text-sm mt-1">
								{errors.fuelType || serverErrors.fuelType}
							</p>
						)}
					</div>
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
							{car ? "Update" : "Add"}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}
