import { useState, useEffect } from "react";
import { useUser, useAuth } from "@clerk/clerk-react";
import { setupAxios } from "../../config/axios";
import { FaPlus, FaGasPump } from "react-icons/fa";
import DashboardLayout from "../DashboardLayout";
import FuelCard from "./FuelCard";
import FuelForm from "./FuelForm";
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
			<div className="container mx-auto py-6  sm:px-6 lg:px-8">
				<div className="flex justify-between items-center mb-8">
					<h2 className="text-3xl font-bold text-slate-800 transition-all duration-300 hover:text-slate-700">
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
					<div className="text-center text-slate-500 text-lg animate-pulse">
						Loading fuel logs...
					</div>
				) : fuels.length === 0 ? (
					<div className="flex flex-col items-center justify-center py-12 animate-fade-in">
						{/* <EmptyIllustration className="w-48 h-48 mb-6 opacity-80" /> */}
						<p className="text-slate-500 text-lg mb-4">
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
