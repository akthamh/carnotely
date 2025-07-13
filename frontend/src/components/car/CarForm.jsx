import { useState, useEffect } from "react";
import { FaTimes } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

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
		<AnimatePresence>
			<motion.div
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				exit={{ opacity: 0 }}
				className="fixed inset-0 bg-black/60 dark:bg-black/80 flex items-start sm:items-center justify-center z-50 p-4 overflow-y-auto"
			>
				<motion.div
					initial={{ scale: 0.95, opacity: 0 }}
					animate={{ scale: 1, opacity: 1 }}
					exit={{ scale: 0.95, opacity: 0 }}
					transition={{ duration: 0.2 }}
					className="bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-6 w-full max-w-md sm:max-w-lg max-h-[90vh] shadow-2xl relative overflow-y-auto"
				>
					<div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 to-blue-400" />
					<button
						onClick={onClose}
						className="absolute top-3 right-3 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-white transition-colors"
						aria-label="Close modal"
					>
						<FaTimes className="w-5 h-5" />
					</button>
					<h2 className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-white mb-4 sm:mb-6">
						{car ? "Edit Car" : "Add Car"}
					</h2>
					{serverErrors.form && (
						<p className="text-red-500 mb-4 text-center font-semibold">
							{serverErrors.form}
						</p>
					)}
					<form
						onSubmit={handleSubmit}
						className="space-y-4"
						noValidate
					>
						{[
							{ label: "Make", name: "make", type: "text" },
							{ label: "Model", name: "model", type: "text" },
						].map(({ label, name, type }) => (
							<div key={name}>
								<label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
									{label}
								</label>
								<input
									type={type}
									name={name}
									value={formData[name]}
									onChange={handleChange}
									className="w-full rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-800 dark:text-white p-2 sm:p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
								/>
								{(errors[name] || serverErrors[name]) && (
									<p className="text-red-500 text-xs mt-1">
										{errors[name] || serverErrors[name]}
									</p>
								)}
							</div>
						))}

						<div className="sm:grid sm:grid-cols-2 sm:gap-4">
							{[
								{ label: "Year", name: "year", type: "number" },
								{
									label: "Registration Number",
									name: "registrationNumber",
									type: "text",
								},
							].map(({ label, name, type }) => (
								<div key={name}>
									<label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
										{label}
									</label>
									<input
										type={type}
										name={name}
										value={formData[name]}
										onChange={handleChange}
										className="w-full rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-800 dark:text-white p-2 sm:p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
									/>
									{(errors[name] || serverErrors[name]) && (
										<p className="text-red-500 text-xs mt-1">
											{errors[name] || serverErrors[name]}
										</p>
									)}
								</div>
							))}
						</div>

						{[
							{
								label: "VIN (Optional)",
								name: "vin",
								type: "text",
							},
							{
								label: "Color (Optional)",
								name: "color",
								type: "text",
							},
							{
								label: "Fuel Type",
								name: "fuelType",
								type: "select",
							},
						].map(({ label, name, type }) => (
							<div key={name}>
								<label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
									{label}
								</label>
								{type === "select" ? (
									<select
										name={name}
										value={formData[name]}
										onChange={handleChange}
										className="w-full rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-800 dark:text-white p-2 sm:p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
									>
										<option value="">
											Select fuel type
										</option>
										<option value="Petrol">Petrol</option>
										<option value="Diesel">Diesel</option>
										<option value="Electric">
											Electric
										</option>
										<option value="Hybrid">Hybrid</option>
									</select>
								) : (
									<input
										type={type}
										name={name}
										value={formData[name]}
										onChange={handleChange}
										className="w-full rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-800 dark:text-white p-2 sm:p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
									/>
								)}
								{(errors[name] || serverErrors[name]) && (
									<p className="text-red-500 text-xs mt-1">
										{errors[name] || serverErrors[name]}
									</p>
								)}
							</div>
						))}

						<div className="flex justify-end gap-3 pt-4">
							<button
								type="button"
								onClick={onClose}
								className="px-3 sm:px-4 py-2 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-white hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
							>
								Cancel
							</button>
							<button
								type="submit"
								className="px-3 sm:px-4 py-2 rounded-lg bg-blue-600 dark:bg-blue-500 text-white hover:bg-blue-700 dark:hover:bg-blue-400 transition-colors"
							>
								{car ? "Update" : "Add"}
							</button>
						</div>
					</form>
				</motion.div>
			</motion.div>
		</AnimatePresence>
	);
}
