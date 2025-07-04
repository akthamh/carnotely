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
} from "../controllers/Fuel.controller.js";

const router = express.Router();

router.get("/fuels", auth, getAllFuels);
router.get("/fuels/:id", auth, getFuelById);
router.post("/fuels", auth, createFuel);
router.patch("/fuels/:id", auth, updateFuel);
router.delete("/fuels/:id", auth, deleteFuel);
router.get("/fuels/:id/cost", auth, getFuelCostSummary);
router.get("/fuels/:id/cost-month", auth, getMonthlyFuelCost);

export default router;
