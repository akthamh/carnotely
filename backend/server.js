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
const allowedOrigins =
	process.env.NODE_ENV === "development"
		? ["http://localhost:5173"]
		: ["https://your-production-url.com"];

app.use(
	cors({
		origin: function (origin, callback) {
			if (!origin) return callback(null, true); // Allow mobile apps/postman
			if (allowedOrigins.includes(origin)) return callback(null, true);
			console.warn(`Blocked by CORS: ${origin}`);
			return callback(new Error("Not allowed by CORS"));
		},
		credentials: true,
	})
);

app.use(ClerkExpressWithAuth());


// Optional health check route
app.get("/health", (req, res) => {
	res.json({ status: "ok" });
});

// Routes
app.use("/api/cars", carRoutes);
app.use("/api/fuels", fuelRoutes);
app.use("/api/services", serviceRoutes);

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
