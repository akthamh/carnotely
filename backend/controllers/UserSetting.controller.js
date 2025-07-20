// controllers/userSettingsController.js
import mongoose from "mongoose";
import UserSettings from "../models/UserSetting.model.js";
import Car from "../models/Car.model.js";
import Joi from "joi";

// Validation schema for user settings
const settingsSchema = Joi.object({
	currency: Joi.string()
		.valid("AFN", "USD", "EUR", "INR", "PKR", "AED", "Other")
		.optional(),
	distanceUnit: Joi.string().valid("km", "miles").optional(),
	timeFormat: Joi.string().valid("12h", "24h").optional(),
	dateFormat: Joi.string()
		.valid("DD/MM/YYYY", "MM/DD/YYYY", "YYYY-MM-DD")
		.optional(),
	defaultCarId: Joi.string().optional().allow(null),
});

// Get user settings
export const getSettings = async (req, res) => {
	try {
		const userId = req.user.id; // Clerk provides userId from auth middleware

		const settings = await UserSettings.findOne({ userId })
			.populate("defaultCarId")
			.select("-userId")
			.lean();

		if (!settings) {
			return res.status(404).json({ message: "User settings not found" });
		}

		res.status(200).json(settings);
	} catch (error) {
		console.error("Error in getSettings:", error.message);
		if (error.name === "CastError") {
			return res.status(400).json({ message: "Invalid user ID" });
		}
		res.status(500).json({ message: "Server error" });
	}
};

// Create or update user settings
export const createOrUpdateSettings = async (req, res) => {
	try {
		const userId = req.user.id;

		// Validate input
		const { error, value } = settingsSchema.validate(req.body, {
			stripUnknown: true,
		});

		if (error) {
			return res.status(400).json({ message: error.details[0].message });
		}

		if (!req.body || Object.keys(req.body).length === 0) {
			return res.status(400).json({ message: "No data provided" });
		}

		const { defaultCarId, ...settingsData } = req.body;

		// Validate defaultCarId if provided
		if (defaultCarId) {
			if (!mongoose.Types.ObjectId.isValid(defaultCarId)) {
				return res
					.status(400)
					.json({ message: "Invalid default car ID" });
			}
			const car = await Car.findOne({ _id: defaultCarId, userId });
			if (!car) {
				return res.status(403).json({
					message: "Unauthorized car access or car not found",
				});
			}
		}

		// Find existing settings or create new
		let settings = await UserSettings.findOne({ userId });

		if (settings) {
			// Update existing settings
			settings = await UserSettings.findOneAndUpdate(
				{ userId },
				{
					...settingsData,
					defaultCarId: defaultCarId || settings.defaultCarId,
				},
				{ new: true }
			)
				.populate("defaultCarId")
				.select("-userId");
		} else {
			// Create new settings
			settings = await UserSettings.create({
				userId,
				currency: settingsData.currency || "AFN",
				distanceUnit: settingsData.distanceUnit || "km",
				timeFormat: settingsData.timeFormat || "24h",
				dateFormat: settingsData.dateFormat || "DD/MM/YYYY",
				defaultCarId,
			});
			await settings.populate("defaultCarId");
			settings = settings.toObject();
			delete settings.userId;
		}

		res.status(200).json(settings);
	} catch (error) {
		console.error("Error in createOrUpdateSettings:", error.message);
		if (error.name === "CastError") {
			return res.status(400).json({ message: "Invalid ID format" });
		}
		res.status(500).json({ message: "Server error" });
	}
};

// Delete user settings
export const deleteSettings = async (req, res) => {
	try {
		const userId = req.user.id;

		const deletedSettings = await UserSettings.findOneAndDelete({ userId });

		if (!deletedSettings) {
			return res.status(404).json({ message: "User settings not found" });
		}

		res.status(200).json({ message: "User settings deleted successfully" });
	} catch (error) {
		console.error("Error in deleteSettings:", error.message);
		if (error.name === "CastError") {
			return res.status(400).json({ message: "Invalid user ID" });
		}
		res.status(500).json({ message: "Server error" });
	}
};
