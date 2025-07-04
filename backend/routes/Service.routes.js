import express from "express";
import { auth } from "../middleware/auth.js";
import {
	getAllServices,
	createService,
	updateService,
	deleteService,
	deleteAllServices,
} from "../controllers/Service.controller.js";

const router = express.Router();

router.get("/services", auth, getAllServices);
router.post("/services", auth, createService);
router.patch("/services/:id", auth, updateService);
router.delete("/services/:id", auth, deleteService);
router.delete("/services", auth, deleteAllServices);

export default router;
