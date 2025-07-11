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

router.get("/", auth, getAllFuels);
router.get("/:id", auth, getFuelById);
router.post("/", auth, createFuel);
router.patch("/:id", auth, updateFuel);
router.delete("/:id", auth, deleteFuel);
router.get("/:id/cost", auth, getFuelCostSummary);
router.get("/:id/cost-month", auth, getMonthlyFuelCost);

export default router;
