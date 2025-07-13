// frontend/src/context/SettingsContext.jsx
import { createContext, useContext, useEffect, useState } from "react";
import { useAuth, useUser } from "@clerk/clerk-react";
import { setupAxios } from "../config/axios";
import { toast } from "react-hot-toast";

const SettingsContext = createContext();

export function SettingsProvider({ children }) {
	const { getToken } = useAuth();
	const { isSignedIn } = useUser();
	const axiosInstance = setupAxios(getToken);
	const [settings, setSettings] = useState({
		currency: "AFN",
		distanceUnit: "km",
		timeFormat: "24h",
		dateFormat: "DD/MM/YYYY",
		nightMode: false,
		defaultCarId: null,
	});

	useEffect(() => {
		if (isSignedIn) {
			axiosInstance
				.get("/settings")
				.then((res) => {
					// Exclude _id from settings
					const { _id, ...cleanSettings } = res.data;
					setSettings(cleanSettings);
					// Ensure dark class matches nightMode
					if (cleanSettings.nightMode) {
						document.documentElement.classList.add("dark");
					} else {
						document.documentElement.classList.remove("dark");
					}
				})
				.catch((err) => {
					console.error("Error loading settings:", err);
					toast.error(
						err.response?.data?.message || "Failed to load settings"
					);
				});
		} else {
			// Reset to defaults for unauthenticated users
			setSettings({
				currency: "AFN",
				distanceUnit: "km",
				timeFormat: "24h",
				dateFormat: "DD/MM/YYYY",
				nightMode: false,
				defaultCarId: null,
			});
			document.documentElement.classList.remove("dark");
		}
	}, [isSignedIn, axiosInstance]);

	// Remove separate useEffect for nightMode to avoid race conditions
	// Dark class is now handled in the main useEffect

	return (
		<SettingsContext.Provider
			value={{ settings, setSettings, axiosInstance }}
		>
			{children}
		</SettingsContext.Provider>
	);
}

export const useSettings = () => useContext(SettingsContext);
