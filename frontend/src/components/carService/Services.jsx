import { useState } from "react";
import { useUser } from "@clerk/clerk-react";
import { FaPlus, FaWrench } from "react-icons/fa";
import DashboardLayout from "../DashboardLayout";
import ServiceCard from "./ServiceCard";
import ServiceForm from "./ServiceForm";
import MySwal from "sweetalert2";
import { useSettings } from "../../contexts/SettingsContext";
import { useData } from "../../contexts/DataContext";

export default function Services() {
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [editingService, setEditingService] = useState(null);
	const { isSignedIn } = useUser();
	const { services, cars, loadingServices, loadingCars } = useData();
	const { settings } = useSettings();

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
			await useData().deleteService(serviceId);
		}
	};

	return (
		<DashboardLayout>
			<div className="container mx-auto py-6 sm:px-6 lg:px-8">
				<div className="flex justify-between items-center mb-8">
					<h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100 transition-all duration-300 hover:text-slate-700 dark:hover:text-slate-300">
						Service Logs
					</h2>
					<button
						onClick={handleAddService}
						disabled={loadingServices || loadingCars || !isSignedIn}
						className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-2 rounded-lg shadow transition-transform duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
					>
						<FaWrench className="w-5 h-5" />
						<FaPlus className="w-3 h-3" />
					</button>
				</div>

				{loadingServices || loadingCars ? (
					<div className="text-center text-slate-500 dark:text-slate-400 text-lg animate-pulse">
						Loading service logs...
					</div>
				) : !isSignedIn ? (
					<div className="flex flex-col items-center justify-center py-12 animate-fade-in">
						<p className="text-slate-500 dark:text-slate-400 text-lg mb-4">
							Please sign in to view service logs.
						</p>
					</div>
				) : services.length === 0 ? (
					<div className="flex flex-col items-center justify-center py-12 animate-fade-in">
						<p className="text-slate-500 dark:text-slate-400 text-lg mb-4">
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
								settings={settings}
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
						settings={settings}
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
