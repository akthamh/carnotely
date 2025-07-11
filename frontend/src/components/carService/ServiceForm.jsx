import { useState, useEffect } from "react";
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
					{service ? "Edit Service Log" : "Add Service Log"}
				</h2>
				{serverErrors.form && (
					<p className="text-red-500 mb-4 text-center font-semibold">
						{serverErrors.form}
					</p>
				)}
				<form onSubmit={handleSubmit} className="space-y-4" noValidate>
					<div>
						<label className="block text-sm font-medium text-slate-700">
							Car
						</label>
						<select
							name="carId"
							value={formData.carId}
							onChange={handleChange}
							className="mt-1 block w-full rounded-lg border border-slate-300 bg-white p-2 focus:outline-none focus:border-blue-600 transition"
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
							<p className="text-red-500 text-sm mt-1">
								{errors.carId || serverErrors.carId}
							</p>
						)}
					</div>
					<div>
						<label className="block text-sm font-medium text-slate-700">
							Service Name
						</label>
						<select
							name="serviceName"
							value={formData.serviceName}
							onChange={handleChange}
							className="mt-1 block w-full rounded-lg border border-slate-300 bg-white p-2 focus:outline-none focus:border-blue-600 transition"
							aria-label="Select service type"
						>
							<option value="">Select service type</option>
							{SERVICE_TYPES.map((type) => (
								<option key={type} value={type}>
									{type}
								</option>
							))}
						</select>
						{(errors.serviceName || serverErrors.serviceName) && (
							<p className="text-red-500 text-sm mt-1">
								{errors.serviceName || serverErrors.serviceName}
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
							<label className="block text-sm font-medium text-slate-700">
								{label}
							</label>
							<input
								type={type}
								name={name}
								value={formData[name]}
								onChange={handleChange}
								step={step}
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
							Comment (Optional)
						</label>
						<textarea
							name="comment"
							value={formData.comment}
							onChange={handleChange}
							rows="3"
							className="mt-1 w-full rounded-lg border border-slate-300 p-2 focus:outline-none focus:border-blue-600 transition"
							aria-label="Comment"
						/>
						{(errors.comment || serverErrors.comment) && (
							<p className="text-red-500 text-sm mt-1">
								{errors.comment || serverErrors.comment}
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
							{service ? "Update" : "Add"}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}
