import { useState, useEffect } from "react";
import { FaTimes } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { formatCurrency } from "../../utils/formatCurrency";
import { useData } from "../../contexts/DataContext";
import { useSettings } from "../../contexts/SettingsContext";

export default function FuelForm({
	fuel,
	cars,
	settings,
	onClose,
	serverErrors = {},
}) {
	const [formData, setFormData] = useState({
		carId: fuel?.carId || settings.defaultCarId || "",
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
	const { addFuel, updateFuel } = useData();

	useEffect(() => {
		setFormData({
			carId: fuel?.carId || settings.defaultCarId || "",
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
		setErrors({});
	}, [fuel, settings.defaultCarId]);

	useEffect(() => {
		const handleEscape = (e) => {
			if (e.key === "Escape") onClose();
		};
		document.addEventListener("keydown", handleEscape);
		return () => document.removeEventListener("keydown", handleEscape);
	}, [onClose]);

	const handleChange = (e) => {
		const { name, value, type, checked } = e.target;
		setFormData({
			...formData,
			[name]: type === "checkbox" ? checked : value,
		});
		if (errors[name] || serverErrors[name]) {
			setErrors({ ...errors, [name]: null });
		}
	};

	const validateForm = () => {
		const schema = {
			carId: (val) => (!val ? "Car is required" : null),
			fuelType: (val) => (!val ? "Fuel type is required" : null),
			pricePerLiter: (val) =>
				!val
					? "Required"
					: parseFloat(val) <= 0
					? "Must be positive"
					: null,
			fuelVolume: (val) =>
				!val
					? "Required"
					: parseFloat(val) <= 0
					? "Must be positive"
					: null,
			mileage: (val) =>
				!val
					? "Required"
					: parseFloat(val) <= 0
					? "Must be positive"
					: null,
			fuelDate: (val) => (!val ? "Date is required" : null),
			comment: (val) =>
				val && val.length > 1000
					? "Comment must be 1000 characters or less"
					: null,
		};
		const newErrors = {};
		Object.entries(schema).forEach(([key, validate]) => {
			const err = validate(formData[key]);
			if (err) newErrors[key] = err;
		});
		return newErrors;
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		const newErrors = validateForm();
		if (Object.keys(newErrors).length) {
			setErrors(newErrors);
			return;
		}
		const fuelTotalCost =
			parseFloat(formData.pricePerLiter) *
			parseFloat(formData.fuelVolume);
		const fuelData = {
			...formData,
			pricePerLiter: parseFloat(formData.pricePerLiter) || 0,
			fuelVolume: parseFloat(formData.fuelVolume) || 0,
			mileage:
				settings.distanceUnit === "miles"
					? parseFloat(formData.mileage) / 0.621371
					: parseFloat(formData.mileage) || 0,
			fuelTotalCost: isNaN(fuelTotalCost) ? 0 : fuelTotalCost,
		};
		try {
			if (fuel) {
				await updateFuel(fuel._id, fuelData);
			} else {
				await addFuel(fuelData);
			}
			onClose();
		} catch (error) {
			try {
				const parsedError = JSON.parse(error.message);
				setErrors(parsedError);
			} catch {
				// Errors are handled via toast in DataContext
			}
		}
	};

	const computedTotalCost = () => {
		const total =
			parseFloat(formData.pricePerLiter) *
			parseFloat(formData.fuelVolume);
		return formatCurrency(isNaN(total) ? 0 : total, settings.currency);
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
						{fuel ? "Edit Fuel Log" : "Add Fuel Log"}
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
						<div>
							<label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
								Car
							</label>
							<select
								name="carId"
								value={formData.carId}
								onChange={handleChange}
								className="w-full rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-800 dark:text-white p-2 sm:p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
								aria-label="Select a car"
							>
								<option value="">Select a car</option>
								{cars.map((car) => (
									<option key={car._id} value={car._id}>
										{car.make} {car.model}{" "}
										{settings.defaultCarId === car._id
											? "(Default)"
											: ""}
									</option>
								))}
							</select>
							{(errors.carId || serverErrors.carId) && (
								<p className="text-red-500 text-xs mt-1">
									{errors.carId || serverErrors.carId}
								</p>
							)}
							{cars.length === 0 && (
								<p className="text-sm text-red-600 mt-1">
									Add a car to log fuel.
								</p>
							)}
						</div>

						<div>
							<label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
								Fuel Type
							</label>
							<select
								name="fuelType"
								value={formData.fuelType}
								onChange={handleChange}
								className="w-full rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-800 dark:text-white p-2 sm:p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
								aria-label="Select fuel type"
							>
								<option value="">Select fuel type</option>
								<option value="Petrol">Petrol</option>
								<option value="Diesel">Diesel</option>
								<option value="Electric">Electric</option>
								<option value="Hybrid">Hybrid</option>
							</select>
							{(errors.fuelType || serverErrors.fuelType) && (
								<p className="text-red-500 text-xs mt-1">
									{errors.fuelType || serverErrors.fuelType}
								</p>
							)}
						</div>

						<div className="sm:grid sm:grid-cols-2 sm:gap-4">
							{[
								{
									label: `Price per Liter (${settings.currency})`,
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
							].map(({ label, name, type, step }) => (
								<div key={name}>
									<label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
										{label}
									</label>
									<input
										type={type}
										step={step}
										name={name}
										value={formData[name]}
										onChange={handleChange}
										className="w-full rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-800 dark:text-white p-2 sm:p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
										aria-label={label}
									/>
									{(errors[name] || serverErrors[name]) && (
										<p className="text-red-500 text-xs mt-1">
											{errors[name] || serverErrors[name]}
										</p>
									)}
								</div>
							))}
						</div>

						<div className="sm:grid sm:grid-cols-2 sm:gap-4">
							{[
								{
									label: `Mileage (${settings.distanceUnit})`,
									name: "mileage",
									step: "1",
									type: "number",
								},
								{
									label: `Fuel Date (${settings.dateFormat})`,
									name: "fuelDate",
									type: "date",
								},
							].map(({ label, name, type, step }) => (
								<div key={name}>
									<label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
										{label}
									</label>
									<input
										type={type}
										step={step}
										name={name}
										value={formData[name]}
										onChange={handleChange}
										className="w-full rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-800 dark:text-white p-2 sm:p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
										aria-label={label}
									/>
									{(errors[name] || serverErrors[name]) && (
										<p className="text-red-500 text-xs mt-1">
											{errors[name] || serverErrors[name]}
										</p>
									)}
								</div>
							))}
						</div>

						<div>
							<label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
								Total Cost
							</label>
							<p className="text-sm text-slate-600 dark:text-slate-300">
								{computedTotalCost()}
							</p>
						</div>

						<label className="inline-flex items-center gap-2 text-slate-700 dark:text-slate-300 cursor-pointer">
							<input
								type="checkbox"
								name="isFullTank"
								checked={formData.isFullTank}
								onChange={handleChange}
								className="w-4 h-4 accent-blue-600 bg-white dark:bg-slate-800 rounded focus:ring-2 focus:ring-blue-500"
							/>
							<span className="text-sm">Full Tank</span>
						</label>

						<div>
							<label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
								Comment
							</label>
							<textarea
								name="comment"
								value={formData.comment}
								onChange={handleChange}
								rows="3"
								className="w-full rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-800 dark:text-white p-2 sm:p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors resize-none"
								aria-label="Comment"
							/>
							{(errors.comment || serverErrors.comment) && (
								<p className="text-red-500 text-xs mt-1">
									{errors.comment || serverErrors.comment}
								</p>
							)}
						</div>

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
								{fuel ? "Update" : "Add"}
							</button>
						</div>
					</form>
				</motion.div>
			</motion.div>
		</AnimatePresence>
	);
}
