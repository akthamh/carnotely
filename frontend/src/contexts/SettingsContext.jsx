import { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "@clerk/clerk-react";
import { setupAxios } from "../config/axios";
import { toast } from "react-hot-toast";

const SettingsContext = createContext();

export function SettingsProvider({ children }) {
    const { getToken, isSignedIn } = useAuth();
    const axiosInstance = setupAxios(getToken);
    const [settings, setSettings] = useState({
        currency: "AFN",
        distanceUnit: "km",
        timeFormat: "24h",
        dateFormat: "DD/MM/YYYY",
        defaultCarId: null,
    });
    const [nightMode, setNightMode] = useState(localStorage.getItem("theme") === "dark");

    // Apply night mode
    useEffect(() => {
        if (nightMode) {
            document.documentElement.classList.add("dark");
            localStorage.setItem("theme", "dark");
        } else {
            document.documentElement.classList.remove("dark");
            localStorage.setItem("theme", "light");
        }
    }, [nightMode]);

    // Fetch settings on mount
    useEffect(() => {
        if (isSignedIn) {
            const fetchSettings = async () => {
                try {
                    const res = await axiosInstance.get("/settings");
                    setSettings(res.data);
                } catch (err) {
                    console.error("Error loading settings:", err);
                    toast.error(err.response?.data?.message || "Failed to load settings");
                }
            };
            fetchSettings();
        }
    }, [isSignedIn, axiosInstance]);

    // Update settings
    const updateSettings = async (newSettings) => {
        try {
            const res = await axiosInstance.post("/settings", newSettings);
            setSettings(res.data);
            toast.success("Settings updated successfully");
        } catch (err) {
            console.error("Error updating settings:", err);
            toast.error(err.response?.data?.message || "Failed to update settings");
            throw err;
        }
    };

    // Toggle night mode client-side
    const toggleNightMode = () => {
        setNightMode((prev) => !prev);
    };

    return (
        <SettingsContext.Provider value={{ settings, setSettings, updateSettings, nightMode, toggleNightMode }}>
            {children}
        </SettingsContext.Provider>
    );
}

export const useSettings = () => useContext(SettingsContext);