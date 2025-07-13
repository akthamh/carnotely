import express from "express";
import { auth } from "../middleware/auth.js";
import {
	getAllCars,
	getCarById,
	createCar,
	updateCar,
	deleteCar,
} from "../controllers/Car.controller.js";

const router = express.Router();

router.get("/", auth, getAllCars);
router.get("/:id", auth, getCarById);
router.post("/", auth, createCar);
router.patch("/:id", auth, updateCar);
router.delete("/:id", auth, deleteCar);

export default router;
