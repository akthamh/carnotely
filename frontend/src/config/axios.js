import axios from "axios";
import { toast } from "react-hot-toast";

const baseURL = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

const axiosInstance = axios.create({
	baseURL,
	timeout: 5000,
	headers: {
		"Content-Type": "application/json",
	},
});

export const setupAxios = (getToken) => {
	axiosInstance.interceptors.request.use(
		async (config) => {
			try {
				const token = await getToken();
				if (token) {
					config.headers.Authorization = `Bearer ${token}`;
				}
				return config;
			} catch (error) {
				return Promise.reject(error);
			}
		},
		(error) => Promise.reject(error)
	);

	axiosInstance.interceptors.response.use(
		(response) => response,
		(error) => {
			if (error.response) {
				switch (error.response.status) {
					case 401:
						toast.error("Unauthorized. Please login.");
						break;
					case 403:
						toast.error("Access denied.");
						break;
					case 404:
						toast.error("Resource not found.");
						break;
					case 500:
						toast.error("Server error. Try again later.");
						break;
					default:
						toast.error("Something went wrong.");
						break;
				}
			} else {
				toast.error("Network error or server not responding.");
			}
			return Promise.reject(error);
		}
	);

	return axiosInstance;
};
