import { useState, useEffect } from "react";
import { useUser, useAuth } from "@clerk/clerk-react";
import { setupAxios } from "../../config/axios";
import { FaPlus } from "react-icons/fa";
import DashboardLayout from "../DashboardLayout";
import FuelCard from "./FuelCard";
import FuelForm from "./fuelForm";
import { toast } from "react-hot-toast";
import MySwal from "sweetalert2";

export default function Fuels() {
	const [fuels, setFuels] = useState([]);
	const [cars, setCars] = useState([]);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [editingFuel, setEditingFuel] = useState(null);
	const [loadingFuels, setLoadingFuels] = useState(false);
	const [loadingCars, setLoadingCars] = useState(false);
	const { isSignedIn } = useUser();
	const { getToken } = useAuth();
	const axiosInstance = setupAxios(getToken);

	useEffect(() => {
		if (isSignedIn) {
			fetchFuels();
			fetchCars();
		} else {
			setFuels([]);
			setCars([]);
		}
	}, [isSignedIn]);

	const fetchFuels = async () => {
		setLoadingFuels(true);
		try {
			const response = await axiosInstance.get("/fuels");
			setFuels(response.data);
		} catch (error) {
			console.error("Error fetching fuels:", error);
		} finally {
			setLoadingFuels(false);
		}
	};

	const fetchCars = async () => {
		setLoadingCars(true);
		try {
			const response = await axiosInstance.get("/cars");
			setCars(response.data);
		} catch (error) {
			console.error("Error fetching cars:", error);
		} finally {
			setLoadingCars(false);
		}
	};

	const handleAddFuel = () => {
		setEditingFuel(null);
		setIsModalOpen(true);
	};

	const handleEditFuel = (fuel) => {
		setEditingFuel(fuel);
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
			try {
				await axiosInstance.delete(`/fuels/${fuelId}`);
				setFuels((prev) => prev.filter((fuel) => fuel._id !== fuelId));
				MySwal.fire(
					"Deleted!",
					"The fuel log has been removed.",
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

	const handleFormSubmit = async (fuelData) => {
		try {
			if (editingFuel) {
				const response = await axiosInstance.patch(
					`/fuels/${editingFuel._id}`,
					fuelData
				);
				setFuels((prev) =>
					prev.map((fuel) =>
						fuel._id === editingFuel._id ? response.data : fuel
					)
				);
				toast.success("Fuel log updated successfully");
			} else {
				const response = await axiosInstance.post("/fuels", fuelData);
				setFuels((prev) => [...prev, response.data]);
				toast.success("Fuel log added successfully");
			}
			setIsModalOpen(false);
			setEditingFuel(null);
		} catch (error) {
			console.error("Error saving fuel:", error);
		}
	};

	return (
		<DashboardLayout>
			<div className="container mx-auto py-6">
				<div className="flex justify-between items-center mb-6">
					<h2 className="text-3xl font-bold text-slate-800 transition-all duration-300 hover:text-slate-700">
						Fuel Logs 
					</h2>
					<button
						onClick={handleAddFuel}
						disabled={loadingFuels || loadingCars}
						className={`flex items-center gap-2 bg-gradient-to-r from-slate-600 to-slate-700 text-white px-4 py-2 rounded-lg shadow transition-transform duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed`}
					>
						<FaPlus className="w-5 h-5" />
						Add Fuel Log
					</button>
				</div>

				{loadingFuels || loadingCars ? (
					<div className="text-center text-slate-500 text-lg animate-pulse">
						Loading fuel logs...
					</div>
				) : fuels.length === 0 ? (
					<div className="text-center text-slate-500 text-lg animate-fade-in">
						No fuel logs added yet. Click "Add Fuel Log" to get
						started!
					</div>
				) : (
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
						{fuels.map((fuel) => (
							<FuelCard
								key={fuel._id}
								fuel={fuel}
								cars={cars}
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
						onSubmit={handleFormSubmit}
						onClose={() => {
							setIsModalOpen(false);
							setEditingFuel(null);
						}}
					/>
				)}
			</div>
		</DashboardLayout>
	);
}
