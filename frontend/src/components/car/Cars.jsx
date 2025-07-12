import { useState, useEffect, useMemo } from "react";
import { useUser, useAuth } from "@clerk/clerk-react";
import { setupAxios } from "../../config/axios";
import { FaPlus, FaWrench } from "react-icons/fa";
import DashboardLayout from "../DashboardLayout";
import CarCard from "./CarCard";
import CarForm from "./CarForm";
import { toast } from "react-hot-toast";
import MySwal from "sweetalert2";

export default function Cars() {
	const [cars, setCars] = useState([]);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [editingCar, setEditingCar] = useState(null);
	const [loadingCars, setLoadingCars] = useState(false);
	const [formErrors, setFormErrors] = useState({});
	const { isSignedIn } = useUser();
	const { getToken } = useAuth();

	const axiosInstance = useMemo(() => setupAxios(getToken), [getToken]);

	useEffect(() => {
		if (isSignedIn) {
			fetchCars();
		} else {
			setCars([]);
		}
	}, [isSignedIn, axiosInstance]);

	const fetchCars = async () => {
		setLoadingCars(true);
		try {
			const response = await axiosInstance.get("/cars");
			setCars(response.data);
		} catch (error) {
			toast.error("Failed to fetch cars. Please try again.");
			console.error("Error fetching cars:", error);
		} finally {
			setLoadingCars(false);
		}
	};

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
			text: "This car will be permanently deleted!",
			icon: "warning",
			showCancelButton: true,
			confirmButtonColor: "#d33",
			cancelButtonColor: "#3085d6",
			confirmButtonText: "Yes, delete it!",
		});

		if (result.isConfirmed) {
			try {
				await axiosInstance.delete(`/cars/${carId}`);
				setCars((prev) => prev.filter((car) => car._id !== carId));
				MySwal.fire("Deleted!", "The car has been removed.", "success");
			} catch (error) {
				MySwal.fire(
					"Error",
					"Something went wrong while deleting.",
					"error"
				);
			}
		}
	};

	const handleFormSubmit = async (carData) => {
		try {
			setFormErrors({});
			if (editingCar) {
				const response = await axiosInstance.patch(
					`/cars/${editingCar._id}`,
					carData
				);
				setCars((prev) =>
					prev.map((car) =>
						car._id === editingCar._id ? response.data : car
					)
				);
				toast.success("Car updated successfully");
			} else {
				const response = await axiosInstance.post("/cars", carData);
				setCars((prev) => [...prev, response.data]);
				toast.success("Car added successfully");
			}
			setIsModalOpen(false);
			setEditingCar(null);
		} catch (error) {
			console.error("Error saving car:", error);
			if (error.response?.status === 400 && error.response.data) {
				const { field, message } = error.response.data;
				if (field && message) {
					setFormErrors({ [field]: message });
				} else if (error.response.data.message) {
					setFormErrors({ form: error.response.data.message });
				}
			} else {
				toast.error("Failed to save car. Please try again.");
			}
		}
	};

	return (
		<DashboardLayout>
			<div className="container mx-auto py-6 sm:px-6 lg:px-8">
				<div className="flex justify-between items-center mb-8">
					<h2 className="text-3xl font-bold text-slate-800 transition-all duration-300 hover:text-slate-700">
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
					<div className="text-center text-slate-500 text-lg animate-pulse">
						Loading cars...
					</div>
				) : cars.length === 0 ? (
					<div className="flex flex-col items-center justify-center py-12 animate-fade-in">
						<p className="text-slate-500 text-lg mb-4">
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
						onSubmit={handleFormSubmit}
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
