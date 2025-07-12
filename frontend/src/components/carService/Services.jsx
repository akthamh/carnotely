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

	return (
		<DashboardLayout>
			<div className="container mx-auto py-6 sm:px-6 lg:px-8">
				<div className="flex justify-between items-center mb-8">
					<h2 className="text-3xl font-bold text-slate-800 transition-all duration-300 hover:text-slate-700">
						Service Logs
					</h2>
					<button
						onClick={handleAddService}
						disabled={loadingServices || loadingCars}
						className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-2 rounded-lg shadow transition-transform duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
					>
						<FaWrench className="w-5 h-5" />
						<FaPlus className="w-3 h-3" />
					</button>
				</div>

				{loadingServices || loadingCars ? (
					<div className="text-center text-slate-500 text-lg animate-pulse">
						Loading service logs...
					</div>
				) : services.length === 0 ? (
					<div className="flex flex-col items-center justify-center py-12 animate-fade-in">
						<p className="text-slate-500 text-lg mb-4">
							No service logs added yet.
						</p>
						<button
							onClick={handleAddService}
							className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition"
						>
							<FaPlus className="w-4 h-4" />
							Add Your First Service Log
						</button>
					</div>
				) : (
					<div className="space-y-4">
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
						onSubmit={async (serviceData) => {
							try {
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
									toast.success(
										"Service log updated successfully"
									);
								} else {
									const response = await axiosInstance.post(
										"/services",
										serviceData
									);
									setServices((prev) => [
										...prev,
										response.data,
									]);
									toast.success(
										"Service log added successfully"
									);
								}
								setIsModalOpen(false);
								setEditingService(null);
							} catch (error) {
								console.error("Error saving service:", error);
								toast.error(
									"Failed to save service log. Please try again."
								);
							}
						}}
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
