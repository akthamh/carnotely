import { useState, useEffect } from "react";
import { useUser, useAuth } from "@clerk/clerk-react";
import { setupAxios } from "../../config/axios";
import { FaCar, FaPlus } from "react-icons/fa";
import DashboardLayout from "../DashboardLayout";
import CarCard from "./CarCard";
import CarForm from "./CarForm";
import { toast } from "react-hot-toast";

export default function Cars() {
	const [cars, setCars] = useState([]);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [editingCar, setEditingCar] = useState(null);
	const { isSignedIn } = useUser();
	const { getToken } = useAuth();

	const axiosInstance = setupAxios(getToken);

	useEffect(() => {
		if (isSignedIn) {
			fetchCars();
		}
	}, [isSignedIn]);

	const fetchCars = async () => {
		try {
			const response = await axiosInstance.get("/cars");
			setCars(response.data);
		} catch (error) {
			console.error("Error fetching cars:", error);
			// Error handling is managed by axios interceptor
		}
	};

	const handleAddCar = () => {
		setEditingCar(null);
		setIsModalOpen(true);
	};

	const handleEditCar = (car) => {
		setEditingCar(car);
		setIsModalOpen(true);
	};

	const handleDeleteCar = async (carId) => {
		if (!window.confirm("Are you sure you want to delete this car?"))
			return;
		try {
			await axiosInstance.delete(`/cars/${carId}`);
			setCars(cars.filter((car) => car._id !== carId));
			toast.success("Car deleted successfully");
		} catch (error) {
			console.error("Error deleting car:", error);
			// Error handling is managed by axios interceptor
		}
	};

	const handleFormSubmit = async (carData) => {
		try {
			if (editingCar) {
				const response = await axiosInstance.patch(
					`/cars/${editingCar._id}`,
					carData
				);
				setCars(
					cars.map((car) =>
						car._id === editingCar._id ? response.data : car
					)
				);
				toast.success("Car updated successfully");
			} else {
				const response = await axiosInstance.post("/cars", carData);
				setCars([...cars, response.data]);
				toast.success("Car added successfully");
			}
			setIsModalOpen(false);
			setEditingCar(null);
		} catch (error) {
			console.error("Error saving car:", error);
			// Error handling is managed by axios interceptor
		}
	};

	return (
		<DashboardLayout>
			<div className="container mx-auto py-6">
				<div className="flex justify-between items-center mb-6">
					<h2 className="text-3xl font-bold text-slate-800 transition-all duration-300 hover:text-slate-700">
						My Cars
					</h2>
					<button
						onClick={handleAddCar}
						className="flex items-center gap-2 bg-gradient-to-r from-slate-600 to-slate-700 text-white px-4 py-2 rounded-lg shadow hover:bg-gradient-to-r hover:from-slate-500 hover:to-slate-600 transition-all duration-300 transform hover:scale-105"
					>
						<FaPlus className="w-5 h-5" />
						Add Car
					</button>
				</div>
				{cars.length === 0 ? (
					<div className="text-center text-slate-500 text-lg animate-fade-in">
						No cars added yet. Click "Add Car" to get started!
					</div>
				) : (
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
						{cars.map((car) => (
							<CarCard
								key={car._id}
								car={car}
								onEdit={() => handleEditCar(car)}
								onDelete={() => handleDeleteCar(car._id)}
							/>
						))}
					</div>
				)}
				{isModalOpen && (
					<CarForm
						car={editingCar}
						onSubmit={handleFormSubmit}
						onClose={() => {
							setIsModalOpen(false);
							setEditingCar(null);
						}}
					/>
				)}
			</div>
		</DashboardLayout>
	);
}
