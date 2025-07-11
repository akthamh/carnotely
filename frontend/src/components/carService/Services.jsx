import { useState, useEffect } from "react";
import { useUser, useAuth } from "@clerk/clerk-react";
import { setupAxios } from "../../config/axios";
import { FaPlus, FaWrench } from "react-icons/fa";
import DashboardLayout from "../DashboardLayout";
import ServiceCard from "./ServiceCard";
import ServiceForm from "./ServiceForm";
import { Toaster, toast } from "react-hot-toast";
import MySwal from "sweetalert2";

export default function Services() {
	const [services, setServices] = useState([]);
	const [cars, setCars] = useState([]);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [editingService, setEditingService] = useState(null);
	const { isSignedIn } = useUser();
	const { getToken } = useAuth();
	const axiosInstance = setupAxios(getToken);

	useEffect(() => {
		if (isSignedIn) {
			fetchServices();
			fetchCars();
		}
	}, [isSignedIn]);

	const fetchServices = async () => {
		try {
			const response = await axiosInstance.get("/services");
			setServices(response.data);
		} catch (error) {
			console.error("Error fetching services:", error);
			// Error handling managed by axios interceptor
		}
	};

	const fetchCars = async () => {
		try {
			const response = await axiosInstance.get("/cars");
			setCars(response.data);
		} catch (error) {
			console.error("Error fetching cars:", error);
			// Error handling managed by axios interceptor
		}
	};

	const handleAddService = () => {
		setEditingService(null);
		setIsModalOpen(true);
	};

	const handleEditService = (service) => {
		setEditingService(service);
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
				setServices(
					services.filter((service) => service._id !== serviceId)
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

	// const handleDeleteService = async (serviceId) => {
	// 	if (
	// 		!window.confirm("Are you sure you want to delete this service log?")
	// 	)
	// 		return;
	// 	try {
	// 		await axiosInstance.delete(`/services/${serviceId}`);
	// 		setServices(
	// 			services.filter((service) => service._id !== serviceId)
	// 		);
	// 		toast.success("Service log deleted successfully");
	// 	} catch (error) {
	// 		console.error("Error deleting service:", error);
	// 		// Error handling managed by axios interceptor
	// 	}
	// };

	const handleDeleteAllServices = async () => {
		if (
			!window.confirm(
				"Are you sure you want to delete all service logs? This action cannot be undone."
			)
		)
			return;
		try {
			await axiosInstance.delete("/services");
			setServices([]);
			toast.success("All service logs deleted successfully");
		} catch (error) {
			console.error("Error deleting all services:", error);
			// Error handling managed by axios interceptor
		}
	};

	const handleFormSubmit = async (serviceData) => {
		try {
			if (editingService) {
				const response = await axiosInstance.patch(
					`/services/${editingService._id}`,
					serviceData
				);
				setServices(
					services.map((service) =>
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
				setServices([...services, response.data]);
				toast.success("Service log added successfully");
			}
			setIsModalOpen(false);
			setEditingService(null);
		} catch (error) {
			console.error("Error saving service:", error);
			// Error handling managed by axios interceptor
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
							className="flex items-center gap-2 bg-gradient-to-r from-slate-600 to-slate-700 text-white px-4 py-2 rounded-lg shadow hover:bg-gradient-to-r hover:from-slate-500 hover:to-slate-600 transition-all duration-300 transform hover:scale-105"
						>
							<FaPlus className="w-5 h-5" />
							Add Service Log
						</button>
						<button
							onClick={handleDeleteAllServices}
							className="flex items-center gap-2 bg-gradient-to-r from-red-600 to-red-700 text-white px-4 py-2 rounded-lg shadow hover:bg-gradient-to-r hover:from-red-500 hover:to-red-600 transition-all duration-300 transform hover:scale-105"
						>
							<FaWrench className="w-5 h-5" />
							Delete All
						</button>
					</div>
				</div>
				{services.length === 0 ? (
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
						}}
					/>
				)}
			</div>
		</DashboardLayout>
	);
}
