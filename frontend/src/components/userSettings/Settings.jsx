import { useEffect, useState } from "react";
import { FaCog, FaTrash } from "react-icons/fa";
import { motion } from "framer-motion";
import { useAuth } from "@clerk/clerk-react";
import { Toaster, toast } from "react-hot-toast";
import { setupAxios } from "../../config/axios";
import DashboardLayout from "../DashboardLayout";
import Swal from "sweetalert2";
import { useSettings } from "../../contexts/SettingsContext";

export default function Settings() {
	const { getToken, isSignedIn } = useAuth();
	const { settings, setSettings, updateSettings } = useSettings();
	const axiosInstance = setupAxios(getToken);
	const [cars, setCars] = useState([]);
	const [loading, setLoading] = useState(false);

	const fetchCars = async () => {
		try {
			setLoading(true);
			const response = await axiosInstance.get("/cars");
			setCars(response.data);
		} catch (error) {
			console.error("Error fetching cars:", error);
			toast.error("Failed to load cars");
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		if (isSignedIn) {
			fetchCars();
		} else {
			setCars([]);
		}
	}, [isSignedIn]);

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			setLoading(true);
			const updatedSettings = {
				...settings,
				defaultCarId:
					settings.defaultCarId ||
					(cars.length > 0 ? cars[0]._id : null),
			};
			await updateSettings(updatedSettings);
			toast.success("Settings saved successfully");
		} catch (err) {
			console.error("Error updating settings:", err);
			toast.error(
				err.response?.data?.message || "Failed to update settings"
			);
		} finally {
			setLoading(false);
		}
	};

	const handleReset = async () => {
		const result = await Swal.fire({
			title: "Reset Settings?",
			text: "This will revert all settings to defaults.",
			icon: "warning",
			showCancelButton: true,
			confirmButtonColor: "#dc2626",
			cancelButtonColor: "#1e40af",
			confirmButtonText: "Yes, reset",
		});
		if (result.isConfirmed) {
			try {
				setLoading(true);
				await axiosInstance.delete("/settings");
				setSettings({
					currency: "AFN",
					distanceUnit: "km",
					timeFormat: "24h",
					dateFormat: "DD/MM/YYYY",
					defaultCarId: cars.length > 0 ? cars[0]._id : null,
				});
				toast.success("Settings reset successfully");
			} catch (err) {
				console.error("Error resetting settings:", err);
				toast.error(
					err.response?.data?.message || "Failed to reset settings"
				);
			} finally {
				setLoading(false);
			}
		}
	};

	return (
		<DashboardLayout>
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 dark:bg-slate-900">
				<motion.h1
					className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-8"
					initial={{ opacity: 0, y: -20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.4 }}
				>
					Settings
				</motion.h1>

				<Toaster />

				<motion.div
					className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-sm"
					initial={{ opacity: 0, y: 30 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.2 }}
				>
					<h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-6 flex items-center">
						<FaCog className="mr-2" />
						User Preferences
					</h2>

					{loading ? (
						<p className="text-slate-500 dark:text-slate-400">
							Loading settings...
						</p>
					) : (
						<form onSubmit={handleSubmit} className="space-y-6">
							<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
								<div>
									<label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
										Currency
									</label>
									<select
										value={settings.currency || "AFN"}
										onChange={(e) =>
											setSettings((prev) => ({
												...prev,
												currency: e.target.value,
											}))
										}
										className="mt-1 block w-full rounded-md border-gray-300 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
									>
										{[
											"AFN",
											"USD",
											"EUR",
											"INR",
											"PKR",
											"AED",
											"Other",
										].map((currency) => (
											<option
												key={currency}
												value={currency}
											>
												{currency}
											</option>
										))}
									</select>
								</div>

								<div>
									<label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
										Distance Unit
									</label>
									<select
										value={settings.distanceUnit || "km"}
										onChange={(e) =>
											setSettings((prev) => ({
												...prev,
												distanceUnit: e.target.value,
											}))
										}
										className="mt-1 block w-full rounded-md border-gray-300 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
									>
										<option value="km">Kilometers</option>
										<option value="miles">Miles</option>
									</select>
								</div>

								<div>
									<label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
										Time Format
									</label>
									<select
										value={settings.timeFormat || "24h"}
										onChange={(e) =>
											setSettings((prev) => ({
												...prev,
												timeFormat: e.target.value,
											}))
										}
										className="mt-1 block w-full rounded-md border-gray-300 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
									>
										<option value="24h">24-Hour</option>
										<option value="12h">12-Hour</option>
									</select>
								</div>

								<div>
									<label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
										Date Format
									</label>
									<select
										value={
											settings.dateFormat || "DD/MM/YYYY"
										}
										onChange={(e) =>
											setSettings((prev) => ({
												...prev,
												dateFormat: e.target.value,
											}))
										}
										className="mt-1 block w-full rounded-md border-gray-300 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
									>
										<option value="DD/MM/YYYY">
											DD/MM/YYYY
										</option>
										<option value="MM/DD/YYYY">
											MM/DD/YYYY
										</option>
										<option value="YYYY-MM-DD">
											YYYY-MM-DD
										</option>
									</select>
								</div>

								<div>
									<label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
										Default Car
									</label>
									<select
										value={settings.defaultCarId || ""}
										onChange={(e) =>
											setSettings((prev) => ({
												...prev,
												defaultCarId:
													e.target.value || null,
											}))
										}
										disabled={cars.length === 0}
										className="mt-1 block w-full rounded-md border-gray-300 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 disabled:opacity-50"
									>
										<option value="">No Default Car</option>
										{cars.map((car) => (
											<option
												key={car._id}
												value={car._id}
											>
												{car.make} {car.model} (
												{car.year})
											</option>
										))}
									</select>
									{cars.length === 0 && (
										<p className="text-sm text-red-600 mt-1">
											Add a car to select a default.
										</p>
									)}
								</div>
							</div>

							<div className="flex justify-between">
								<button
									type="submit"
									disabled={loading}
									className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-medium py-3 px-6 rounded-lg transition-colors disabled:opacity-50"
								>
									Save
								</button>
								<button
									type="button"
									onClick={handleReset}
									disabled={loading}
									className="bg-red-600 hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600 text-white font-medium py-3 px-6 rounded-lg transition-colors disabled:opacity-50 flex items-center"
								>
									<FaTrash className="mr-2" />
									Reset
								</button>
							</div>
						</form>
					)}
				</motion.div>
			</div>
		</DashboardLayout>
	);
}
