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

router.get("/", auth, getAllServices);
router.post("/", auth, createService);
router.patch("/:id", auth, updateService);
router.delete("/:id", auth, deleteService);
router.delete("/", auth, deleteAllServices);

export default router;
