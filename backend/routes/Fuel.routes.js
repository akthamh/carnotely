import express from "express";
import { auth } from "../middleware/auth.js";
import {
	getAllFuels,
	getFuelById,
	createFuel,
	updateFuel,
	deleteFuel,
	getFuelCostSummary,
	getMonthlyFuelCost,
	getLastFiveFuels,
} from "../controllers/Fuel.controller.js";

const router = express.Router();

router.get("/", auth, getAllFuels);
router.get("/last-five", auth, getLastFiveFuels); // Last 5 fuel logs for the user
router.get("/cost-month", auth, getMonthlyFuelCost); // Monthly fuel cost summary for the user
router.get("/cost", auth, getFuelCostSummary); // Total fuel cost summary for the user

router.post("/", auth, createFuel);
router.get("/:id", auth, getFuelById);
router.patch("/:id", auth, updateFuel);
router.delete("/:id", auth, deleteFuel);

export default router;
