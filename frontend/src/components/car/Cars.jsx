import { useState } from "react";
import { useUser } from "@clerk/clerk-react";
import { FaPlus, FaWrench } from "react-icons/fa";
import DashboardLayout from "../DashboardLayout";
import CarCard from "./CarCard";
import CarForm from "./CarForm";
import MySwal from "sweetalert2";
import { useSettings } from "../../contexts/SettingsContext";
import { useData } from "../../contexts/DataContext";

export default function Cars() {
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [editingCar, setEditingCar] = useState(null);
	const [formErrors, setFormErrors] = useState({});
	const { isSignedIn } = useUser();
	const { cars, loadingCars, deleteCar } = useData();
	const { settings } = useSettings();

	const handleAddCar = () => {
		setEditingCar(null);
		setFormErrors({});
		setIsModalOpen(true);
	};

	const handleEditCar = (car) => {
		setEditingCar(car);
		setFormErrors({});
		setIsModalOpen(true);
	};

	const handleDelete = async (carId) => {
		const result = await MySwal.fire({
			title: "Are you sure?",
			text:
				settings.defaultCarId === carId
					? "This is your default car. Deleting it will reset the default car setting. Continue?"
					: "This car will be permanently deleted!",
			icon: "warning",
			showCancelButton: true,
			confirmButtonColor: "#d33",
			cancelButtonColor: "#3085d6",
			confirmButtonText: "Yes, delete it!",
		});

		if (result.isConfirmed) {
			await deleteCar(carId);
		}
	};

	return (
		<DashboardLayout>
			<div className="container mx-auto py-6 sm:px-6 lg:px-8">
				<div className="flex justify-between items-center mb-8">
					<h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100 transition-all duration-300 hover:text-slate-700 dark:hover:text-slate-300">
						My Cars
					</h2>
					<button
						onClick={handleAddCar}
						disabled={loadingCars}
						className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-2 rounded-lg shadow transition-transform duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
					>
						<FaWrench className="w-5 h-5" />
						<FaPlus className="w-3 h-3" />
					</button>
				</div>

				{loadingCars ? (
					<div className="text-center text-slate-500 dark:text-slate-400 text-lg animate-pulse">
						Loading cars...
					</div>
				) : !isSignedIn ? (
					<div className="flex flex-col items-center justify-center py-12 animate-fade-in">
						<p className="text-slate-500 dark:text-slate-400 text-lg mb-4">
							Please sign in to view cars.
						</p>
					</div>
				) : cars.length === 0 ? (
					<div className="flex flex-col items-center justify-center py-12 animate-fade-in">
						<p className="text-slate-500 dark:text-slate-400 text-lg mb-4">
							No cars added yet.
						</p>
						<button
							onClick={handleAddCar}
							className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition"
						>
							<FaPlus className="w-4 h-4" />
							Add Your First Car
						</button>
					</div>
				) : (
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
						{cars.map((car) => (
							<CarCard
								key={car._id}
								car={car}
								onEdit={() => handleEditCar(car)}
								onDelete={() => handleDelete(car._id)}
							/>
						))}
					</div>
				)}

				{isModalOpen && (
					<CarForm
						car={editingCar}
						onClose={() => {
							setIsModalOpen(false);
							setEditingCar(null);
							setFormErrors({});
						}}
						serverErrors={formErrors}
					/>
				)}
			</div>
		</DashboardLayout>
	);
}
