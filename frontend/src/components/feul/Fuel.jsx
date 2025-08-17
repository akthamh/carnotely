import { useState } from "react";
import { useUser } from "@clerk/clerk-react";
import { FaPlus, FaGasPump } from "react-icons/fa";
import DashboardLayout from "../DashboardLayout";
import FuelCard from "./FuelCard";
import FuelForm from "./FuelForm";

import MySwal from "sweetalert2";
import { useSettings } from "../../contexts/SettingsContext";
import { useData } from "../../contexts/DataContext";

export default function Fuels() {
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [editingFuel, setEditingFuel] = useState(null);
	const [formErrors, setFormErrors] = useState({});
	const { isSignedIn } = useUser();
	const { fuels, cars, loadingFuels, loadingCars, deleteFuel } = useData();
	const { settings } = useSettings();

	const handleAddFuel = () => {
		setEditingFuel(null);
		setFormErrors({});
		setIsModalOpen(true);
	};

	const handleEditFuel = (fuel) => {
		setEditingFuel(fuel);
		setFormErrors({});
		setIsModalOpen(true);
	};

	const handleDelete = async (fuelId) => {
		const result = await MySwal.fire({
			title: "Are you sure?",
			text: "This fuel log will be permanently deleted!",
			icon: "warning",
			showCancelButton: true,
			confirmButtonColor: "#d33",
			cancelButtonColor: "#3085d6",
			confirmButtonText: "Yes, delete it!",
		});

		if (result.isConfirmed) {
			await deleteFuel(fuelId);
		}
	};

	return (
		<DashboardLayout>
			<div className="container mx-auto py-6 sm:px-6 lg:px-8">
				<div className="flex justify-between items-center mb-8">
					<h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100 transition-all duration-300 hover:text-slate-700 dark:hover:text-slate-300">
						Fuel Logs
					</h2>
					<button
						onClick={handleAddFuel}
						disabled={loadingFuels || loadingCars}
						className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-2 rounded-lg shadow transition-transform duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
					>
						<FaGasPump className="w-5 h-5" />
						<FaPlus className="w-3 h-3" />
					</button>
				</div>

				{loadingFuels || loadingCars ? (
					<div className="text-center text-slate-500 dark:text-slate-400 text-lg animate-pulse">
						Loading fuel logs...
					</div>
				) : !isSignedIn ? (
					<div className="flex flex-col items-center justify-center py-12 animate-fade-in">
						<p className="text-slate-500 dark:text-slate-400 text-lg mb-4">
							Please sign in to view fuel logs.
						</p>
					</div>
				) : fuels.length === 0 ? (
					<div className="flex flex-col items-center justify-center py-12 animate-fade-in">
						<p className="text-slate-500 dark:text-slate-400 text-lg mb-4">
							No fuel logs added yet.
						</p>
						<button
							onClick={handleAddFuel}
							className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition"
						>
							<FaPlus className="w-4 h-4" />
							Add Your First Fuel Log
						</button>
					</div>
				) : (
					<div className="space-y-4">
						{fuels.map((fuel) => (
							<FuelCard
								key={fuel._id}
								fuel={fuel}
								cars={cars}
								settings={settings}
								onEdit={() => handleEditFuel(fuel)}
								onDelete={() => handleDelete(fuel._id)}
							/>
						))}
					</div>
				)}

				{isModalOpen && (
					<FuelForm
						fuel={editingFuel}
						cars={cars}
						settings={settings}
						onClose={() => {
							setIsModalOpen(false);
							setEditingFuel(null);
							setFormErrors({});
						}}
						serverErrors={formErrors}
					/>
				)}
			</div>
		</DashboardLayout>
	);
}
