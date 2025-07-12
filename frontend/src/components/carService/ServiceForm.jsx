import { useState, useEffect } from "react";
import { FaTimes } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

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

export default function ServiceForm({
	service,
	cars,
	onSubmit,
	onClose,
	serverErrors = {},
}) {
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

	useEffect(() => {
		setFormData({
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
		setErrors({});
	}, [service]);

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
			carId: (val) => (!val ? "Car is required" : null),
			serviceName: (val) => (!val ? "Service name is required" : null),
			partsCost: (val) =>
				!val
					? "Parts cost is required"
					: parseFloat(val) < 0
					? "Parts cost must be non-negative"
					: null,
			laborCost: (val) =>
				!val
					? "Labor cost is required"
					: parseFloat(val) < 0
					? "Labor cost must be non-negative"
					: null,
			mileage: (val) =>
				!val
					? "Mileage is required"
					: parseFloat(val) < 0
					? "Mileage must be non-negative"
					: null,
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
						aria-label="Close modal"
					>
						<FaTimes className="w-5 h-5" />
					</button>
					<h2 className="text-xl sm:text-2xl font-bold text-slate-800 mb-4 sm:mb-6">
						{service ? "Edit Service Log" : "Add Service Log"}
					</h2>
					{serverErrors.form && (
						<p className="text-red-500 mb-4 text-center font-semibold">
							{serverErrors.form}
						</p>
					)}
					<form
						onSubmit={handleSubmit}
						className="space-y-4 sm:space-y-5"
						noValidate
					>
						<div>
							<label className="block text-sm font-medium text-slate-700 mb-1">
								Car
							</label>
							<select
								name="carId"
								value={formData.carId}
								onChange={handleChange}
								className="w-full rounded-lg border border-slate-200 bg-white p-2 sm:p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
								aria-label="Select a car"
							>
								<option value="">Select a car</option>
								{cars.map((car) => (
									<option key={car._id} value={car._id}>
										{car.make} {car.model}
									</option>
								))}
							</select>
							{(errors.carId || serverErrors.carId) && (
								<p className="text-red-500 text-xs mt-1">
									{errors.carId || serverErrors.carId}
								</p>
							)}
						</div>
						<div>
							<label className="block text-sm font-medium text-slate-700 mb-1">
								Service Name
							</label>
							<select
								name="serviceName"
								value={formData.serviceName}
								onChange={handleChange}
								className="w-full rounded-lg border border-slate-200 bg-white p-2 sm:p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
								aria-label="Select service type"
							>
								<option value="">Select service type</option>
								{SERVICE_TYPES.map((type) => (
									<option key={type} value={type}>
										{type}
									</option>
								))}
							</select>
							{(errors.serviceName ||
								serverErrors.serviceName) && (
								<p className="text-red-500 text-xs mt-1">
									{errors.serviceName ||
										serverErrors.serviceName}
								</p>
							)}
						</div>
						{[
							{
								label: "Parts Cost ($)",
								name: "partsCost",
								type: "number",
								step: "0.01",
							},
							{
								label: "Labor Cost ($)",
								name: "laborCost",
								type: "number",
								step: "0.01",
							},
							{
								label: "Mileage (km)",
								name: "mileage",
								type: "number",
								step: "1",
							},
							{
								label: "Service Date",
								name: "serviceDate",
								type: "date",
							},
							{
								label: "Service Center (Optional)",
								name: "serviceCenterName",
								type: "text",
							},
						].map(({ label, name, type, step }) => (
							<div key={name}>
								<label className="block text-sm font-medium text-slate-700 mb-1">
									{label}
								</label>
								<input
									type={type}
									name={name}
									value={formData[name]}
									onChange={handleChange}
									step={step}
									className="w-full rounded-lg border border-slate-200 p-2 sm:p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
									aria-label={label}
								/>
								{(errors[name] || serverErrors[name]) && (
									<p className="text-red-500 text-xs mt-1">
										{errors[name] || serverErrors[name]}
									</p>
								)}
							</div>
						))}
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
								className="px-3 sm:px-4 py-2 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors"
							>
								Cancel
							</button>
							<button
								type="submit"
								className="px-3 sm:px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
							>
								{service ? "Update" : "Add"}
							</button>
						</div>
					</form>
				</motion.div>
			</motion.div>
		</AnimatePresence>
	);
}
