import { createContext, useContext, useState, useEffect, useMemo } from "react";
import { useAuth, useUser } from "@clerk/clerk-react";
import { setupAxios } from "../config/axios";
import { toast } from "react-hot-toast";
import dayjs from "dayjs";
import { useSettings } from "./SettingsContext";

const DataContext = createContext();

export const DataProvider = ({ children }) => {
	const [services, setServices] = useState([]);
	const [recentServices, setRecentServices] = useState([]);

	const [cars, setCars] = useState([]);
	const [recentCars, setRecentCars] = useState([]);

	const [fuels, setFuels] = useState([]);
	const [recentFuels, setRecentFuels] = useState([]);

	const [monthlyFuelData, setMonthlyFuelData] = useState([]);
	const [monthlyServiceData, setMonthlyServiceData] = useState([]);
	const [loadingServices, setLoadingServices] = useState(false);
	const [loadingCars, setLoadingCars] = useState(false);
	const [loadingFuels, setLoadingFuels] = useState(false);
	const { isSignedIn } = useUser();
	const { getToken } = useAuth();
	const { settings, updateSettings } = useSettings();

	const axiosInstance = useMemo(() => setupAxios(getToken), [getToken]);

	// Fetch all data when user is signed in
	useEffect(() => {
		if (isSignedIn) {
			const fetchData = async () => {
				setLoadingServices(true);
				setLoadingCars(true);
				setLoadingFuels(true);
				try {
					const [
						carsResponse,
						servicesResponse,
						fuelsResponse,
						monthlyFuelResponse,
						monthlyServiceResponse,
					] = await Promise.all([
						axiosInstance.get("/cars"),
						axiosInstance.get("/services"),
						axiosInstance.get("/fuels"),
						axiosInstance.get("/fuels/cost-month"),
						axiosInstance.get("/services/monthly-cost"),
					]);
					setCars(carsResponse.data);
					setServices(servicesResponse.data);
					setFuels(fuelsResponse.data);
					setMonthlyFuelData(
						monthlyFuelResponse.data.monthly.map((item) => ({
							month: dayjs(item.month, "YYYY-MM").format("MMM"),
							totalCost: item.totalCost,
						}))
					);
					setMonthlyServiceData(
						monthlyServiceResponse.data.monthly.map((item) => ({
							month: dayjs(item._id, "YYYY-MM").format("MMM"),
							totalCost: item.totalCost,
						}))
					);
				} catch (error) {
					toast.error("Failed to fetch data. Please try again.");
					console.error("Error fetching data:", error);
				} finally {
					setLoadingServices(false);
					setLoadingCars(false);
					setLoadingFuels(false);
				}
			};
			fetchData();
		} else {
			setServices([]);
			setCars([]);
			setFuels([]);
			setMonthlyFuelData([]);
			setMonthlyServiceData([]);
		}
	}, [isSignedIn, axiosInstance]);

	// CRUD methods for services
	const addService = async (serviceData) => {
		try {
			const response = await axiosInstance.post("/services", serviceData);
			setServices((prev) => [...prev, response.data]);
			// Refetch monthly service data to update charts
			const monthlyServiceResponse = await axiosInstance.get(
				"/services/monthly-cost"
			);
			setMonthlyServiceData(
				monthlyServiceResponse.data.monthly.map((item) => ({
					month: dayjs(item._id, "YYYY-MM").format("MMM"),
					totalCost: item.totalCost,
				}))
			);
			toast.success("Service log added successfully");
			return response.data;
		} catch (error) {
			console.error("Error adding service:", error);
			toast.error("Failed to save service log. Please try again.");
			throw error;
		}
	};

	const updateService = async (serviceId, serviceData) => {
		try {
			const response = await axiosInstance.patch(
				`/services/${serviceId}`,
				serviceData
			);
			setServices((prev) =>
				prev.map((service) =>
					service._id === serviceId ? response.data : service
				)
			);
			// Refetch monthly service data to update charts
			const monthlyServiceResponse = await axiosInstance.get(
				"/services/monthly-cost"
			);
			setMonthlyServiceData(
				monthlyServiceResponse.data.monthly.map((item) => ({
					month: dayjs(item._id, "YYYY-MM").format("MMM"),
					totalCost: item.totalCost,
				}))
			);
			toast.success("Service log updated successfully");
			return response.data;
		} catch (error) {
			console.error("Error updating service:", error);
			toast.error("Failed to update service log. Please try again.");
			throw error;
		}
	};

	const deleteService = async (serviceId) => {
		try {
			await axiosInstance.delete(`/services/${serviceId}`);
			setServices((prev) =>
				prev.filter((service) => service._id !== serviceId)
			);
			// Refetch monthly service data to update charts
			const monthlyServiceResponse = await axiosInstance.get(
				"/services/monthly-cost"
			);
			setMonthlyServiceData(
				monthlyServiceResponse.data.monthly.map((item) => ({
					month: dayjs(item._id, "YYYY-MM").format("MMM"),
					totalCost: item.totalCost,
				}))
			);
			toast.success("Service log deleted successfully");
		} catch (error) {
			console.error("Error deleting service:", error);
			toast.error("Failed to delete service log. Please try again.");
			throw error;
		}
	};

	// CRUD methods for cars
	const addCar = async (carData) => {
		try {
			const response = await axiosInstance.post("/cars", carData);
			setCars((prev) => [...prev, response.data]);
			if (!settings.defaultCarId) {
				await updateSettings({
					...settings,
					defaultCarId: response.data._id,
				});
			}
			toast.success("Car added successfully");
			return response.data;
		} catch (error) {
			console.error("Error adding car:", error);
			if (error.response?.status === 400 && error.response.data) {
				const { field, message } = error.response.data;
				if (field && message) {
					toast.error(message);
					throw new Error(JSON.stringify({ [field]: message }));
				} else if (error.response.data.message) {
					toast.error(error.response.data.message);
					throw new Error(
						JSON.stringify({ form: error.response.data.message })
					);
				}
			}
			toast.error("Failed to add car. Please try again.");
			throw error;
		}
	};

	const updateCar = async (carId, carData) => {
		try {
			const response = await axiosInstance.patch(
				`/cars/${carId}`,
				carData
			);
			setCars((prev) =>
				prev.map((car) => (car._id === carId ? response.data : car))
			);
			toast.success("Car updated successfully");
			return response.data;
		} catch (error) {
			console.error("Error updating car:", error);
			if (error.response?.status === 400 && error.response.data) {
				const { field, message } = error.response.data;
				if (field && message) {
					toast.error(message);
					throw new Error(JSON.stringify({ [field]: message }));
				} else if (error.response.data.message) {
					toast.error(error.response.data.message);
					throw new Error(
						JSON.stringify({ form: error.response.data.message })
					);
				}
			}
			toast.error("Failed to update car. Please try again.");
			throw error;
		}
	};

	const deleteCar = async (carId) => {
		try {
			await axiosInstance.delete(`/cars/${carId}`);
			setCars((prev) => prev.filter((car) => car._id !== carId));
			if (settings.defaultCarId === carId) {
				const newDefaultCarId =
					cars.length > 1
						? cars.find((c) => c._id !== carId)._id
						: null;
				await updateSettings({
					...settings,
					defaultCarId: newDefaultCarId,
				});
			}
			toast.success("Car deleted successfully");
		} catch (error) {
			console.error("Error deleting car:", error);
			toast.error("Failed to delete car. Please try again.");
			throw error;
		}
	};

	// CRUD methods for fuels
	const addFuel = async (fuelData) => {
		try {
			const response = await axiosInstance.post("/fuels", fuelData);
			setFuels((prev) => [...prev, response.data]);
			// Refetch monthly fuel data to update charts
			const monthlyFuelResponse = await axiosInstance.get(
				"/fuels/cost-month"
			);
			setMonthlyFuelData(
				monthlyFuelResponse.data.monthly.map((item) => ({
					month: dayjs(item.month, "YYYY-MM").format("MMM"),
					totalCost: item.totalCost,
				}))
			);
			toast.success("Fuel log added successfully");
			return response.data;
		} catch (error) {
			console.error("Error adding fuel:", error);
			if (error.response?.status === 400 && error.response.data) {
				const { field, message } = error.response.data;
				if (field && message) {
					toast.error(message);
					throw new Error(JSON.stringify({ [field]: message }));
				} else if (error.response.data.message) {
					toast.error(error.response.data.message);
					throw new Error(
						JSON.stringify({ form: error.response.data.message })
					);
				}
			}
			toast.error("Failed to save fuel log. Please try again.");
			throw error;
		}
	};

	const updateFuel = async (fuelId, fuelData) => {
		try {
			const response = await axiosInstance.patch(
				`/fuels/${fuelId}`,
				fuelData
			);
			setFuels((prev) =>
				prev.map((fuel) => (fuel._id === fuelId ? response.data : fuel))
			);
			// Refetch monthly fuel data to update charts
			const monthlyFuelResponse = await axiosInstance.get(
				"/fuels/cost-month"
			);
			setMonthlyFuelData(
				monthlyFuelResponse.data.monthly.map((item) => ({
					month: dayjs(item.month, "YYYY-MM").format("MMM"),
					totalCost: item.totalCost,
				}))
			);
			toast.success("Fuel log updated successfully");
			return response.data;
		} catch (error) {
			console.error("Error updating fuel:", error);
			if (error.response?.status === 400 && error.response.data) {
				const { field, message } = error.response.data;
				if (field && message) {
					toast.error(message);
					throw new Error(JSON.stringify({ [field]: message }));
				} else if (error.response.data.message) {
					toast.error(error.response.data.message);
					throw new Error(
						JSON.stringify({ form: error.response.data.message })
					);
				}
			}
			toast.error("Failed to update fuel log. Please try again.");
			throw error;
		}
	};

	const deleteFuel = async (fuelId) => {
		try {
			await axiosInstance.delete(`/fuels/${fuelId}`);
			setFuels((prev) => prev.filter((fuel) => fuel._id !== fuelId));
			// Refetch monthly fuel data to update charts
			const monthlyFuelResponse = await axiosInstance.get(
				"/fuels/cost-month"
			);
			setMonthlyFuelData(
				monthlyFuelResponse.data.monthly.map((item) => ({
					month: dayjs(item.month, "YYYY-MM").format("MMM"),
					totalCost: item.totalCost,
				}))
			);
			toast.success("Fuel log deleted successfully");
		} catch (error) {
			console.error("Error deleting fuel:", error);
			toast.error("Failed to delete fuel log. Please try again.");
			throw error;
		}
	};

	const getRecentItems = (data = [], dataKey = "date", limit = 5) => {
		return [...data]
			.sort(
				(a, b) => new Date(b[dataKey] || 0) - new Date(a[dataKey] || 0)
			)
			.slice(0, limit);
	};

	const getRecentFuels = useMemo(() => {
		return getRecentItems(fuels, "date");
	}, [fuels]);
	const getRecentServices = useMemo(() => {
		return getRecentItems(services, "date");
	}, [services]);

	const value = {
		services,
		cars,
		fuels,
		monthlyFuelData,
		monthlyServiceData,
		loadingServices,
		loadingCars,
		loadingFuels,
		getRecentFuels,
		getRecentServices,
		addService,
		updateService,
		deleteService,
		addCar,
		updateCar,
		deleteCar,
		addFuel,
		updateFuel,
		deleteFuel,
	};

	return (
		<DataContext.Provider value={value}>{children}</DataContext.Provider>
	);
};

export const useData = () => {
	const context = useContext(DataContext);
	if (!context) {
		throw new Error("useData must be used within a DataProvider");
	}
	return context;
};
