import { useState, useEffect, useMemo } from "react";
import { useUser, useAuth } from "@clerk/clerk-react";
import { setupAxios } from "../../config/axios";
import { FaPlus, FaWrench } from "react-icons/fa";
import DashboardLayout from "../DashboardLayout";
import ServiceCard from "./ServiceCard";
import ServiceForm from "./ServiceForm";
import { toast } from "react-hot-toast";
import MySwal from "sweetalert2";

export default function Services() {
	const [services, setServices] = useState([]);
	const [cars, setCars] = useState([]);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [editingService, setEditingService] = useState(null);
	const [loadingServices, setLoadingServices] = useState(false);
	const [loadingCars, setLoadingCars] = useState(false);
	const [formErrors, setFormErrors] = useState({});
	const { isSignedIn } = useUser();
	const { getToken } = useAuth();

	const axiosInstance = useMemo(() => setupAxios(getToken), [getToken]);

	useEffect(() => {
		if (isSignedIn) {
			const fetchData = async () => {
				setLoadingServices(true);
				setLoadingCars(true);
				try {
					const [servicesResponse, carsResponse] = await Promise.all([
						axiosInstance.get("/services"),
						axiosInstance.get("/cars"),
					]);
					setServices(servicesResponse.data);
					setCars(carsResponse.data);
				} catch (error) {
					toast.error("Failed to fetch data. Please try again.");
					console.error("Error fetching data:", error);
				} finally {
					setLoadingServices(false);
					setLoadingCars(false);
				}
			};
			fetchData();
		} else {
			setServices([]);
			setCars([]);
		}
	}, [isSignedIn, axiosInstance]);

	const handleAddService = () => {
		setEditingService(null);
		setFormErrors({});
		setIsModalOpen(true);
	};

	const handleEditService = (service) => {
		setEditingService(service);
		setFormErrors({});
		setIsModalOpen(true);
	};

	const handleDelete = async (serviceId) => {
		const result = await MySwal.fire({
			title: "Are you sure?",
			text: "This service log will be permanently deleted!",
			icon: "warning",
			showCancelButton: true,
			confirmButtonColor: "#d33",
			cancelButtonColor: "#3085d6",
			confirmButtonText: "Yes, delete it!",
		});

		if (result.isConfirmed) {
			try {
				await axiosInstance.delete(`/services/${serviceId}`);
				setServices((prev) =>
					prev.filter((service) => service._id !== serviceId)
				);
				MySwal.fire(
					"Deleted!",
					"The service log has been removed.",
					"success"
				);
			} catch (error) {
				MySwal.fire(
					"Error",
					"Something went wrong while deleting.",
					"error"
				);
			}
		}
	};

	const handleDeleteAllServices = async () => {
		const result = await MySwal.fire({
			title: "Are you sure?",
			text: "All service logs will be permanently deleted!",
			icon: "warning",
			showCancelButton: true,
			confirmButtonColor: "#d33",
			cancelButtonColor: "#3085d6",
			confirmButtonText: "Yes, delete all!",
		});

		if (result.isConfirmed) {
			try {
				await axiosInstance.delete("/services");
				setServices([]);
				MySwal.fire(
					"Deleted!",
					"All service logs have been removed.",
					"success"
				);
			} catch (error) {
				MySwal.fire(
					"Error",
					"Something went wrong while deleting.",
					"error"
				);
			}
		}
	};

	const handleFormSubmit = async (serviceData) => {
		try {
			setFormErrors({});
			if (editingService) {
				const response = await axiosInstance.patch(
					`/services/${editingService._id}`,
					serviceData
				);
				setServices((prev) =>
					prev.map((service) =>
						service._id === editingService._id
							? response.data
							: service
					)
				);
				toast.success("Service log updated successfully");
			} else {
				const response = await axiosInstance.post(
					"/services",
					serviceData
				);
				setServices((prev) => [...prev, response.data]);
				toast.success("Service log added successfully");
			}
			setIsModalOpen(false);
			setEditingService(null);
		} catch (error) {
			console.error("Error saving service:", error);
			if (error.response?.status === 400 && error.response.data) {
				const { field, message } = error.response.data;
				if (field && message) {
					setFormErrors({ [field]: message });
				} else if (error.response.data.message) {
					setFormErrors({ form: error.response.data.message });
				}
			} else {
				toast.error("Failed to save service log. Please try again.");
			}
		}
	};

	return (
		<DashboardLayout>
			<div className="container mx-auto py-6">
				<div className="flex justify-between items-center mb-6">
					<h2 className="text-3xl font-bold text-slate-800 transition-all duration-300 hover:text-slate-700">
						Service Logs
					</h2>
					<div className="flex gap-2">
						<button
							onClick={handleAddService}
							disabled={loadingServices || loadingCars}
							className={`flex items-center gap-2 bg-gradient-to-r from-slate-600 to-slate-700 text-white px-4 py-2 rounded-lg shadow transition-transform duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed`}
						>
							<FaPlus className="w-5 h-5" />
							Add Service Log
						</button>
						<button
							onClick={handleDeleteAllServices}
							disabled={loadingServices || loadingCars}
							className={`flex items-center gap-2 bg-gradient-to-r from-red-600 to-red-700 text-white px-4 py-2 rounded-lg shadow transition-transform duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed`}
						>
							<FaWrench className="w-5 h-5" />
							Delete All
						</button>
					</div>
				</div>

				{loadingServices || loadingCars ? (
					<div className="text-center text-slate-500 text-lg animate-pulse">
						Loading service logs...
					</div>
				) : services.length === 0 ? (
					<div className="text-center text-slate-500 text-lg animate-fade-in">
						No service logs added yet. Click "Add Service Log" to
						get started!
					</div>
				) : (
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
						{services.map((service) => (
							<ServiceCard
								key={service._id}
								service={service}
								cars={cars}
								onEdit={() => handleEditService(service)}
								onDelete={() => handleDelete(service._id)}
							/>
						))}
					</div>
				)}

				{isModalOpen && (
					<ServiceForm
						service={editingService}
						cars={cars}
						onSubmit={handleFormSubmit}
						onClose={() => {
							setIsModalOpen(false);
							setEditingService(null);
							setFormErrors({});
						}}
						serverErrors={formErrors}
					/>
				)}
			</div>
		</DashboardLayout>
	);
}
