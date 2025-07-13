import express from "express";
import { connectToDatabase } from "./config/db.js";
import cors from "cors";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname } from "path";
import { ClerkExpressWithAuth } from "@clerk/clerk-sdk-node";

import carRoutes from "./routes/Car.routes.js";
import fuelRoutes from "./routes/Fuel.routes.js";
import serviceRoutes from "./routes/Service.routes.js";
import userSettingsRoutes from "./routes/UserSetting.routes.js";

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
const port = process.env.PORT || 8000;

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Parse incoming JSON
app.use(express.json());

// CORS configuration
app.use(
	cors({
		origin: (origin, callback) => {
			const allowedOrigins = (process.env.ALLOWED_ORIGINS || "")
				.split(",")
				.map((o) => o.trim())
				.filter(Boolean); // Ensure no empty entries

			// In development, extend with additional origins if needed
			if (process.env.NODE_ENV === "development") {
				allowedOrigins.push(
					"http://localhost:5173",
					"http://localhost:5174",
					"https://car-notely.vercel.app"
				);
			}

			if (!origin || allowedOrigins.includes(origin)) {
				if (process.env.NODE_ENV === "development") {
				}
				callback(null, true);
			} else {
				console.error("Blocked by CORS:", { origin, allowedOrigins });
				callback(new Error(`Not allowed by CORS: ${origin}`));
			}
		},
		credentials: true,
		methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
		allowedHeaders: ["Content-Type", "Authorization"],
	})
);
app.use(ClerkExpressWithAuth());

// Optional health check route
app.get("/health", (req, res) => {
	res.json({ status: "ok" });
});
app.get("/", (req, res) => {
	res.json({ message: "Backend is running" });
});
// Routes
app.use("/api/cars", carRoutes);
app.use("/api/fuels", fuelRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/settings", userSettingsRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
	console.error(err.stack);
	res.status(500).json({ message: "Something went wrong!" });
});

// Connect to database
connectToDatabase();

// Start server
app.listen(port, () => {
	console.log(`✅ Server is running on port ${port}`);
});
