import express from "express";
import { connectToDatabase } from "./config/db.js";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";

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
app.set("trust proxy", 1); // required if behind nginx/proxy for correct IPs
const port = process.env.PORT || 8000;


// Security headers
app.use(helmet());

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Parse incoming JSON
app.use(express.json());

// ✅ Fixed CORS configuration
// removed

const allowedOrigins = [
  ...(process.env.ALLOWED_ORIGINS || "").split(",").map((o) => o.trim()).filter(Boolean),
  ...(process.env.NODE_ENV === "development" ? ["http://localhost:5173","http://localhost:5174"] : []),
];
app.use(cors({
  origin: (origin, cb) => (!origin || allowedOrigins.includes(origin)) ? cb(null, true) : cb(new Error(`Not allowed by CORS: ${origin}`)),
  credentials: true,
  methods: ["GET","POST","PUT","PATCH","DELETE","OPTIONS"],
  allowedHeaders: ["Content-Type","Authorization"],
}));

// Basic rate limit on all routes (tune as needed)
app.use(rateLimit({ windowMs: 15 * 60 * 1000, limit: 1000 }));

// Clerk
import { ClerkExpressWithAuth } from "@clerk/clerk-sdk-node";

// ✅ Clerk middleware
app.use(ClerkExpressWithAuth());

// ✅ Optional health check
app.get("/health", (req, res) => {
	res.json({ status: "ok" });
});

app.get("/", (req, res) => {
	res.json({ message: "Backend is running" });
});

// ✅ Your API routes
app.use("/api/cars", carRoutes);
app.use("/api/fuels", fuelRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/settings", userSettingsRoutes);

// ✅ Improved error handler that includes CORS headers
app.use((err, req, res, next) => {
	console.error("🔥 Express error:", err);

	// Set CORS headers so frontend can read the error response
	res.status(500)
		.set("Access-Control-Allow-Origin", req.headers.origin || "*")
		.set("Access-Control-Allow-Credentials", "true")
		.json({ message: "Something went wrong!" });
});

// ✅ Connect to DB and start server
connectToDatabase();

app.listen(port, () => {
	console.log(`✅ Server is running on port ${port}`);
});
