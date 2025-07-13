// routes/userSettingsRoutes.js
import express from "express";
import { auth } from "../middleware/auth.js";
import {
	getSettings,
	createOrUpdateSettings,
	deleteSettings,
} from "../controllers/UserSetting.controller.js";

const router = express.Router();

// All routes require authentication
router.use(auth);

router.get("/", getSettings);
router.post("/", createOrUpdateSettings);
router.delete("/", deleteSettings);

export default router;
